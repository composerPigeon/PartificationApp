import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';

async function moduleUrl(path, imports = {}) {
    const source = await readFile(new URL(path, import.meta.url), 'utf8');
    let output = ts.transpileModule(source, {
        compilerOptions: {
            target: ts.ScriptTarget.ES2023,
            module: ts.ModuleKind.ESNext,
            experimentalDecorators: true,
        },
    }).outputText;
    for (const [specifier, url] of Object.entries(imports)) {
        output = output.replaceAll(`"${specifier}"`, JSON.stringify(url));
    }
    return `data:text/javascript;base64,${Buffer.from(output).toString('base64')}`;
}

const jackson = import.meta.resolve('ts-jackson');
const project = await moduleUrl('../src/domain/Project.ts', {'ts-jackson': jackson});
const helpers = await moduleUrl('../src/services/fileSystem/storageHelpers.ts');
const storage = await moduleUrl('../src/services/fileSystem/FileSystemStorageService.ts', {
    '../../domain': project,
    './storageHelpers.ts': helpers,
    'ts-jackson': jackson,
});
const {FileSystemStorageService} = await import(storage);

test('loads PNGs in original PDF order despite shuffled directory entries', async () => {
    const projectId = 'partification-app.score';
    const entries = new Map();
    for (const number of [10, 2, 1, 12, 3, 9, 4, 11, 5, 8, 6, 7]) {
        entries.set(`${projectId}.page-${number}`, {
            kind: 'directory',
            async getFileHandle(name) {
                assert.equal(name, 'image.png');
                return {getFile: async () => new Blob([`PDF page ${number}`])};
            },
        });
    }
    for (const name of ['notes', 'other.page-1', `${projectId}.page-0`, `${projectId}.page-invalid`]) {
        entries.set(name, {kind: 'directory'});
    }
    entries.set('musicorpus.json', {kind: 'file'});
    const directory = {
        async *[Symbol.asyncIterator]() {
            yield* entries;
        },
        getDirectoryHandle: async name => entries.get(name),
    };
    const service = new FileSystemStorageService({getDirectoryHandle: async () => directory});
    const pages = await service.loadPages(projectId);
    assert.deepEqual(pages.map(page => page.number), Array.from({length: 12}, (_, index) => index + 1));
    assert.deepEqual(await Promise.all(pages.map(page => page.blob.text())),
        Array.from({length: 12}, (_, index) => `PDF page ${index + 1}`));
    assert.ok(pages.every(page => page.projectId === projectId));
});
