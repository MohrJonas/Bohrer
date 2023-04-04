import Jimp from "jimp";
import { RuntimeConfig } from "./config";
import ColorGrid from "./colorgrid";

class Environment {
    config!: RuntimeConfig;
    opts!: Record<string, string>;
    image!: Jimp;
    colorGrid!: ColorGrid;
}

export const environment = new Environment();