import { copyFile, mkdir, rm } from 'node:fs/promises';
import packageJSON from './package.json' with { type: 'json' };

const outDir = './npm';

await rm(outDir, { recursive: true, force: true });
await mkdir(`${outDir}/dist`, { recursive: true });

await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: `${outDir}/dist`,
  target: 'browser',
  format: 'esm',
  sourcemap: 'external',
  minify: true,
});

await Bun.write(`${outDir}/package.json`, JSON.stringify({
  name: packageJSON.name,
  version: packageJSON.version,
  type: 'module',
  main: './dist/index.js',
  module: './dist/index.js',
  exports: './dist/index.js',
}, null, 2));

await copyFile('LICENSE.md', `${outDir}/LICENSE.md`);
await copyFile('README.md', `${outDir}/README.md`);
