import ts from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import externals from 'rollup-plugin-node-externals';

const config = [
	{
		input: './src/index.ts',
		output: [
			{
				dir: './dist/esm',
				entryFileNames: '[name].mjs',
				exports: 'named',
				format: 'esm',
				preserveModules: true,
				sourcemap: true,
			},
			{
				dir: './dist/cjs',
				entryFileNames: '[name].cjs',
				exports: 'named',
				format: 'cjs',
				preserveModules: true,
				sourcemap: true,
			},
		],
		plugins: [externals(), ts()],
	},
	{
		input: './src/index.ts',
		output: [
			{
				dir: './dist/types',
				entryFileNames: '[name].d.ts',
				exports: 'named',
				format: 'esm',
				preserveModules: true,
				sourcemap: false,
			},
		],
		plugins: [externals(), ts(), dts()],
	},
];

export default config;
