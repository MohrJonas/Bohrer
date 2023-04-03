import * as esbuild from "esbuild";

const context = await esbuild.context({
	entryPoints: ["src/index.ts"],
	bundle: true,
	minify: false,
	minifyIdentifiers: false,
	minifySyntax: false,
	minifyWhitespace: false,
	sourcemap: "inline",
	platform: "node",
	target: "node19",
	outfile: "dist/index.js",
	treeShaking: true
});

await context.watch();