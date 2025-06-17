import * as fs from 'fs'
import { glob } from 'node:fs/promises'
import * as path from 'path'

async function generateExports({
  dirPath,
  output,
  pattern,
}: {
  dirPath: string
  output: string
  pattern: string
}) {
  let indexContent = ''

  for await (const filePath of glob(pattern, { cwd: dirPath })) {
    // Construct the full path to the schema file.
    const fullFilePath = path.posix.join('./', filePath)

    indexContent += `export * from './${fullFilePath}'\n`
  }

  try {
    fs.writeFileSync(output, indexContent)
  } catch (err) {
    console.error(`Error writing to file ${output}:`, err)
  }
}

await generateExports({
  dirPath: './src/schemas',
  output: './src/schemas/index.ts',
  pattern: '**/*/schema.ts',
})

await generateExports({
  dirPath: './src/schemas',
  output: './src/schemas/zod.ts',
  pattern: '**/*/zod.ts',
})
