import { program } from "commander";
import Jimp from "jimp";
import { Config, DefaultConfig, RuntimeConfig, ParsedConfig } from "./config";
import * as toml from "toml";
import { readFileSync, writeFileSync } from "fs";
import ora from "ora";
import chroma from "chroma-js";
import { flatMap, sortBy } from "lodash";
import tinycolor = require("tinycolor2");
import { environment as env } from "./environment";
import ColorGrid from "./colorgrid";
import PrimaryColor from "./primarycolor";
import MixedColor from "./mixedcolor";
import { exporter, unitType } from "makerjs";

async function run() {
    program
        .requiredOption("-i <imagepath>")
        .requiredOption("-c <configpath>")
        .parse();
    const spinner = ora("⛏️Crunching numbers⛏️");
    env.opts = program.opts();
    env.config = createConfig(env.opts["c"]);
    env.colorGrid = new ColorGrid(env.config.image.size[0], env.config.image.size[1]);
    env.image = await Jimp.read(env.opts["i"]);
    env.image.resize(env.config.image.size[0], env.config.image.size[1]);
    if (env.config.image.grayscale) env.image.grayscale();
    env.image.scan(0, 0, env.image.bitmap.width, env.image.bitmap.height, (x, y) => {
        const rgbColor = Jimp.intToRGBA(env.image.getPixelColor(x, y));
        const pixelColor = tinycolor({ r: rgbColor.r, g: rgbColor.g, b: rgbColor.b, a: 255 });
        const closestPrimaryColor = getClosestColor(pixelColor);
        if (closestPrimaryColor && closestPrimaryColor.distance <= env.config.color.maxDiff) {
            env.colorGrid.setColor(y, x, new PrimaryColor(closestPrimaryColor.color));
        } else {
            env.colorGrid.setColor(y, x, new MixedColor({
                r: { color: tinycolor("red"), ratio: pixelColor.toRgb().r / 255 },
                g: { color: tinycolor("green"), ratio: pixelColor.toRgb().g / 255 },
                b: { color: tinycolor("blue"), ratio: pixelColor.toRgb().b / 255 }
            }));
        }
    });
    const layers = env.colorGrid.build();
    const paths = flatMap(layers, (layer) => { return layer.paths; });
    const outCOntent = env.config.output.format === "svg" ? exporter.toSVG(paths, {
        units: unitType.Millimeter
    }) : exporter.toDXF(paths, {
        units: unitType.Millimeter
    });
    writeFileSync(`Drillfile.${env.config.output.format}`, outCOntent);
    env.image.write("out.png");
    spinner.stop();
}

function createConfig(filePath: string): RuntimeConfig {
    const config: Config = Object.assign({}, DefaultConfig, toml.parse(readFileSync(filePath, "utf-8")) as ParsedConfig);
    return Object.assign(config, {
        mmPerPixelX: config.workpiece.dimensions[0] / config.image.size[0],
        mmPerPixelY: config.workpiece.dimensions[1] / config.image.size[1]
    } as RuntimeConfig);
}

function getClosestColor(color: tinycolorInstance): { color: tinycolorInstance, distance: number } {
    const mappedColors = env.config.color.primaryColors.map((primaryColorHexString) => {
        const primaryColor = tinycolor(primaryColorHexString);
        return { color: primaryColor, distance: chroma.deltaE(primaryColor.toHexString(), color.toHexString()) };
    });
    return sortBy(mappedColors, (entry) => { return entry.distance; })[0];
}

(async () => {
    await run();
})();