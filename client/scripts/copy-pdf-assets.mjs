import { cp, mkdir } from 'node:fs/promises'

const source = new URL('../node_modules/pdfjs-dist/', import.meta.url)
const destination = new URL('../public/pdfjs/', import.meta.url)
await mkdir(destination, { recursive: true })
for (const folder of ['cmaps', 'standard_fonts', 'wasm', 'iccs']) {
  await cp(new URL(folder, source), new URL(folder, destination), { recursive: true })
}
await cp(new URL('LICENSE', source), new URL('LICENSE', destination))
