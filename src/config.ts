import Layer from "./layer"

export type ParsedConfig = {
    color: {
        colors: Array<string> | undefined
    } | undefined,
    drilling: {
        minHoleSize: number | undefined
    } | undefined,
    image: {
        grayscale: boolean | undefined,
        size: Array<number> | undefined
    } | undefined,
    workpiece: {
        dimensions: Array<number> | undefined
    } | undefined,
    output: {
        format: "svg" | "dxf" | undefined
    } | undefined
}

export type Config = {
    color: {
        colors: Array<string>
    },
    drilling: {
        minHoleSize: number
    },
    image: {
        grayscale: boolean,
        size: Array<number>
    },
    workpiece: {
        dimensions: Array<number>
    },
    output: {
        format: "svg" | "dxf"
    }
}

export type ExtendedConfig = {
    color: {
        colors: Array<string>
    },
    drilling: {
        minHoleSize: number
    },
    image: {
        grayscale: boolean,
        size: Array<number>
    },
    workpiece: {
        dimensions: Array<number>
    },
    output: {
        format: "svg" | "dxf"
    },
    mmPerPixelX: number,
    mmPerPixelY: number,
    layerTable: Record<number, Layer>
}

export const DefaultConfig: Config = {
	color: {
		colors: ["#00ffff", "#ff00ff", "#ffff00", "#000000"]
	},
	drilling: {
		minHoleSize: 1
	},
	image: {
		grayscale: false,
		size: [100, 100]
	},
	workpiece: {
		dimensions: [100, 100]
	},
	output: {
		format: "dxf"
	}
};