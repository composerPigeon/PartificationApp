import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, mkdtemp, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import ts from 'typescript'

const temporary = await mkdtemp(join(tmpdir(), 'partification-tests-'))
let ProjectManager
try {
  for (const name of ['directoryStorage', 'ProjectManager']) {
    const source = (await readFile(new URL(`../src/projects/${name}.ts`, import.meta.url), 'utf8'))
      .replace("'./directoryStorage'", "'./directoryStorage.mjs'")
    await writeFile(join(temporary, `${name}.mjs`), ts.transpileModule(source, {
      compilerOptions: { target: ts.ScriptTarget.ES2023, module: ts.ModuleKind.ESNext },
    }).outputText)
  }
  ;({ ProjectManager } = await import(pathToFileURL(join(temporary, 'ProjectManager.mjs'))))
} finally {
  await rm(temporary, { recursive: true, force: true })
}

class Directory {
  kind = 'directory'
  entries = new Map()
  constructor(name) { this.name = name }
  async getDirectoryHandle(name, options = {}) {
    if (!this.entries.has(name) && options.create) this.entries.set(name, new Directory(name))
    if (!this.entries.has(name)) throw new DOMException('Missing', 'NotFoundError')
    return this.entries.get(name)
  }
  async getFileHandle(name, options = {}) {
    if (!this.entries.has(name) && options.create) {
      const file = { name, kind: 'file', data: new Blob(), getFile: async () => file.data,
        createWritable: async () => ({
          write: async data => { file.data = data instanceof Blob ? data : new Blob([data]) },
          close: async () => {}, abort: async () => {},
        }) }
      this.entries.set(name, file)
    }
    if (!this.entries.has(name)) throw new DOMException('Missing', 'NotFoundError')
    return this.entries.get(name)
  }
  async *values() { yield* this.entries.values() }
  async removeEntry(name) { this.entries.delete(name) }
}
const pdf = () => new File(['%PDF-example'], 'Score.pdf', { type: 'application/pdf' })
async function* pages() { yield new Blob(['page'], { type: 'image/png' }) }
function setup() {
  const manager = new ProjectManager()
  const root = new Directory('projects')
  manager.setRoot(root)
  return { manager, root }
}

test('readable unique IDs, project name, original PDF and page round trip', async () => {
  const { manager, root } = setup()
  const first = await manager.createProject(' Choir Practice ', pdf(), pages())
  const second = await manager.createProject(' Choir Practice ', pdf(), pages())
  assert.match(first.id, /^choir-practice-score-/)
  assert.notEqual(first.id, second.id)
  assert.equal(first.name, 'Choir Practice')
  assert.equal(await (await manager.loadPage(first.id, first.images[0])).text(), 'page')
  const directory = await root.getDirectoryHandle(first.id)
  assert.equal(await (await (await directory.getFileHandle('source.pdf')).getFile()).text(), '%PDF-example')
  assert.equal((await manager.loadProjects()).length, 2)
})

test('sorts by project name and accepts legacy metadata', async () => {
  const { manager, root } = setup()
  await manager.createProject('zebra', pdf(), pages())
  await manager.createProject('Alpha', pdf(), pages())
  const legacy = await root.getDirectoryHandle('legacy', { create: true })
  const metadata = await legacy.getFileHandle('project.json', { create: true })
  metadata.data = new Blob([JSON.stringify({ id: 'legacy', pdfFileName: 'Beta.pdf', images: [{ pageNumber: 1, fileName: 'page-1.png' }] })])
  assert.deepEqual((await manager.loadProjects()).map(project => project.name), ['Alpha', 'Beta', 'zebra'])
})

test('conversion failure cleans up only the new project', async () => {
  const { manager, root } = setup()
  const existing = await manager.createProject('Existing', pdf(), pages())
  async function* brokenPages() { yield* pages(); throw new Error('Invalid PDF') }
  await assert.rejects(manager.createProject('Broken', pdf(), brokenPages()), /Invalid PDF/)
  assert.deepEqual([...root.entries.keys()], [existing.id])
})

test('empty names and zero-page conversions cannot create projects', async () => {
  const { manager, root } = setup()
  await assert.rejects(manager.createProject(' ', pdf(), pages()), /project name/)
  await assert.rejects(manager.createProject('Empty', pdf(), (async function* () {})()), /no pages/)
  assert.equal(root.entries.size, 0)
})

test('loads one project without reading unrelated broken metadata', async () => {
  const { manager, root } = setup()
  const project = await manager.createProject('Choir', pdf(), pages())
  const unrelated = await root.getDirectoryHandle('broken', { create: true })
  const metadata = await unrelated.getFileHandle('project.json', { create: true })
  metadata.data = new Blob(['invalid JSON'])
  assert.deepEqual(await manager.loadProject(project.id), project)
  await assert.rejects(manager.loadProject('missing'), /not found/)
  await assert.rejects(manager.loadProject('../escape'), /Invalid project reference/)
})

test('single-project loading preserves legacy project names', async () => {
  const { manager, root } = setup()
  const directory = await root.getDirectoryHandle('legacy', { create: true })
  const metadata = await directory.getFileHandle('project.json', { create: true })
  metadata.data = new Blob([JSON.stringify({ id: 'legacy', pdfFileName: 'Score.pdf', images: [{ pageNumber: 1, fileName: 'page-1.png' }] })])
  assert.equal((await manager.loadProject('legacy')).name, 'Score')
})
