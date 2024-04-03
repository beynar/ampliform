import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/lib/index.ts'],
	splitting: true,
	skipNodeModulesBundle: true,
	dts: true,
	bundle: true,
	minifyIdentifiers: true,
	minifySyntax: true,
	minifyWhitespace: true,
	platform: 'browser',
	minify: true,

	sourcemap: true,
	format: ['esm', 'cjs'],
	treeshake: true,

	clean: true,
});
