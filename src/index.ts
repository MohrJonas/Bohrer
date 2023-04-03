import { program } from "commander";
import Jimp from "jimp";
import { Config, DefaultConfig, ExtendedConfig, ParsedConfig } from "./config";
import * as toml from "toml";
import { readFileSync, writeFileSync } from "fs";
import ora from "ora";
import chroma from "chroma-js";
import { flatMap, sortBy } from "lodash";
import tinycolor = require("tinycolor2");
import Layer from "./layer";
import { exporter } from "makerjs";

async function run() {
	program
		.requiredOption("-i <imagepath>")
		.requiredOption("-c <configpath>")
		.parse();
	const spinner = ora("⛏️Crunching numbers⛏️");
	spinner.start();
	const options = program.opts();
	const config = createConfig(options["c"]);
	let image = (await Jimp.read(options["i"]))
		.resize(config.image.size[0], config.image.size[1]);
	if (config.image.grayscale) {
		image = image.grayscale();
	}
	image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y) => {
		const layer = getClosestColor(config, image.getPixelColor(x, y));
		const layerColor = Jimp.rgbaToInt(parseInt(layer.color[0]), parseInt(layer.color[1]), parseInt(layer.color[2]), 255);
		image.setPixelColor(layerColor, x, y);
		config.layerTable[layer.index].paths.push({
			type: "circle",
			origin: [x * config.mmPerPixelX + config.mmPerPixelX / 2, config.workpiece.dimensions[1] - y * config.mmPerPixelY + config.mmPerPixelY / 2],
			radius: config.drilling.minHoleSize,
			layer: layer.color
		});
	});
	const paths = flatMap(config.layerTable, (layer) => { return layer.paths; });
	const outCOntent = config.output.format === "svg" ? exporter.toSVG(paths, {
		units: "Millimeter"
	}) : exporter.toDXF(paths, {
		units: "Millimeter"
	});
	writeFileSync(`Drillfile.${config.output.format}`, outCOntent);
	image.write("out.png");
	spinner.stop();
}

function createConfig(filePath: string): ExtendedConfig {
	const config: Config = Object.assign({}, DefaultConfig, toml.parse(readFileSync(filePath, "utf-8")) as ParsedConfig);
	const map: Record<number, Layer> = {};
	config.color.colors.forEach((color, index) => { map[index] = new Layer(index, color); });
	return Object.assign(config, {
		mmPerPixelX: config.workpiece.dimensions[0] / config.image.size[0],
		mmPerPixelY: config.workpiece.dimensions[1] / config.image.size[1],
		layerTable: map
	} as ExtendedConfig
	);
}

function getClosestColor(config: ExtendedConfig, color: number): Layer {
	const colorRGB = Jimp.intToRGBA(color);
	const colorHexString = tinycolor({ r: colorRGB.r, g: colorRGB.g, b: colorRGB.b }).toHexString();
	return sortBy(config.layerTable, (tableEntry) => {
		return chroma.deltaE(tableEntry.color, colorHexString);
	})[0];
}

(async () => {
	await run();
})();