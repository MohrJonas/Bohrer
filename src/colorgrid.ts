import Layer from "./layer";
import MixedColor from "./mixedcolor";
import PrimaryColor from "./primarycolor";
import { environment as env } from "./environment";
import { clamp } from "lodash";
import tinycolor from "tinycolor2";

export default class ColorGrid {

    private readonly grid: Array<Array<PrimaryColor | MixedColor>>;

    constructor(public width: number, public height: number) {
        this.grid = new Array(height);
        for(let i = 0; i < height; i++) {
            this.grid[i] = new Array(width);
        }
    }

    setColor(y: number, x: number, color: PrimaryColor | MixedColor) {
        this.grid[y][x] = color;
    }

    //TODO emit warning when having to clamp value
    build(): Array<Layer> {
        const layers: Array<Layer> = [];
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const color = this.grid[y][x];
                if (color instanceof PrimaryColor) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-ignore
                    let layer = layers.find((layer) => { return tinycolor.equals(layer.color, color.color); });
                    if (!layer) layers.push(new Layer(color.color));
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-ignore
                    layer = layers.find((layer) => { return tinycolor.equals(layer.color, color.color); });
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    layer!.paths.push({
                        type: "circle",
                        origin: [
                            x * env.config.mmPerPixelX,
                            env.config.workpiece.dimensions[1] - y * env.config.mmPerPixelY
                        ],
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        radius: clamp(env.config.mmPerPixelX / 2 - env.config.drilling.holeMargin, env.config.drilling.minHoleSize, env.config.mmPerPixelX / 2),
                        layer: color.color.toName() ? color.color.toName() : color.color.toHexString()
                    });
                } else {
                    //TODO 🤮
                    let redLayer = layers.find((layer) => { return layer.color.toName() === "red"; });
                    let greenLayer = layers.find((layer) => { return layer.color.toName() === "green"; });
                    let blueLayer = layers.find((layer) => { return layer.color.toName() === "blue"; });
                    if (!redLayer) layers.push(new Layer(tinycolor("red")));
                    if (!greenLayer) layers.push(new Layer(tinycolor("green")));
                    if (!blueLayer) layers.push(new Layer(tinycolor("blue")));
                    redLayer = layers.find((layer) => { return layer.color.toName() === "red"; });
                    greenLayer = layers.find((layer) => { return layer.color.toName() === "green"; });
                    blueLayer = layers.find((layer) => { return layer.color.toName() === "blue"; });
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    redLayer!.paths.push({
                        type: "circle",
                        origin: [
                            x * env.config.mmPerPixelX,
                            env.config.workpiece.dimensions[1] - y * env.config.mmPerPixelY
                        ],
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        //radius: clamp(env.config.mmPerPixelX * color.colors.r.ratio, env.config.drilling.minHoleSize, min([env.config.mmPerPixelX, env.config.mmPerPixelY])!),
                        radius: clamp((env.config.mmPerPixelX / 2 - env.config.drilling.holeMargin) * color.colors.r.ratio, env.config.drilling.minHoleSize, env.config.mmPerPixelX / 2),
                        layer: "red"
                    });
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    greenLayer!.paths.push({
                        type: "circle",
                        origin: [
                            x * env.config.mmPerPixelX,
                            env.config.workpiece.dimensions[1] - y * env.config.mmPerPixelY
                        ],
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        //radius: clamp(env.config.mmPerPixelX * color.colors.g.ration, env.config.drilling.minHoleSize, min([env.config.mmPerPixelX, env.config.mmPerPixelY])!),
                        radius: clamp((env.config.mmPerPixelX / 2 - env.config.drilling.holeMargin) * color.colors.g.ratio, env.config.drilling.minHoleSize, env.config.mmPerPixelX / 2),
                        layer: "green"
                    });
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    blueLayer!.paths.push({
                        type: "circle",
                        origin: [
                            x * env.config.mmPerPixelX,
                            env.config.workpiece.dimensions[1] - y * env.config.mmPerPixelY
                        ],
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        //radius: clamp(env.config.mmPerPixelX * color.colors.b.ration, env.config.drilling.minHoleSize, min([env.config.mmPerPixelX, env.config.mmPerPixelY])!),
                        radius: clamp((env.config.mmPerPixelX / 2 - env.config.drilling.holeMargin) * color.colors.b.ratio, env.config.drilling.minHoleSize, env.config.mmPerPixelX / 2),
                        layer: "blue"
                    });
                }
            }
        }
        return layers;
    }
}