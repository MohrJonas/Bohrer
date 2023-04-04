export type ParsedConfig = {
    color: {
        primaryColors: Array<string> | undefined,
        maxDiff: number | undefined
    } | undefined,
    drilling: {
        minHoleSize: number | undefined,
        holeMargin: number | undefined,
        strategy: "stacked" | "grouped" | undefined
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
        primaryColors: Array<string>,
        holeMargin: number,
        maxDiff: number
    },
    drilling: {
        minHoleSize: number,
        strategy: "stacked" | "grouped"
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

export type RuntimeConfig = {
    color: {
        primaryColors: Array<string>,
        maxDiff: number,
    },
    drilling: {
        minHoleSize: number,
        holeMargin: number
        strategy: "stacked" | "grouped"
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
    mmPerPixelY: number
}

export const DefaultConfig: Config = {
    color: {
        primaryColors: [],
        "maxDiff": 25,
        "holeMargin": 2
    },
    drilling: {
        minHoleSize: 1,
        strategy: "grouped"
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