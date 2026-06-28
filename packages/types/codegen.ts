import { mkdir } from 'node:fs/promises';

const sourcePath = './src';
const outputPaths = [
  '../browser/src/types',
  '../server/src/types',
];

const sourceFiles = [...new Bun.Glob('*.ts').scanSync(sourcePath)];

const codegenNotice = `// bun-format-ignore-file
/**
 * DO NOT MODIFY THESE FILES!
 *
 * These files were copied from the **types** package. To update this file, make changes to those
 * files instead and then run the following command from the monorepo root folder:
 *
 * bun run codegen:types
 */
// BEGIN CODEGEN
`;

/**
 * Copy files to each output target
 */
for (const outputPath of outputPaths) {
  console.log(`DESTINATION: ${outputPath}`);

  console.log(`Making sure output folder exists...`);
  await mkdir(outputPath, { recursive: true });

  for (const file of sourceFiles) {
    const fileInputPath = `${sourcePath}/${file}`;
    const fileOutputPath = `${outputPath}/${file}`;

    // Read in original file
    let fileContents = await Bun.file(fileInputPath).text();

    // Trim some content from the files being copied over
    fileContents = fileContents.replace('// bun-format-ignore-file\n', '');
    fileContents = fileContents.replace('// BEGIN CODEGEN\n', '');

    // Prepend the codegen notice to the file contents
    const fileContentsWithNotice = `${codegenNotice}${fileContents}`;

    // Write the file
    console.log(`Writing ${fileOutputPath}...`);
    await Bun.write(fileOutputPath, fileContentsWithNotice);
  }
}
