import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';

const projects = [
    {
        projectPath: 'packages/darkroom',
        outputFileName: 'packages-darkroom.json'
    },
    {
        projectPath: 'packages/safelight',
        outputFileName: 'packages-safelight.json'
    },
    {
        projectPath: 'packages/timeline',
        outputFileName: 'packages-timeline.json'
    },
    {
        projectPath: 'packages/tswebm',
        outputFileName: 'packages-tswebm.json'
    },
    {
        projectPath: '',
        outputFileName: 'packages-workspace.json'
    }
];

if (!existsSync('./src/generated')) {
    mkdir('./src/generated');
}

const bannedKeys = ['unsavedDependencies', 'path'];

async function generatePackagesForProject(projectPath: string, outputFileName: string) {
    const output = spawn('pnpm', ['list', '--depth', '2', '--json', '--long'], {
        cwd: join(process.cwd(), '../../', projectPath),
        stdio: ['inherit', 'pipe', 'inherit'],
        shell: true
    });
    let result = '';
    output.stdout.setEncoding('utf-8');
    output.stdout.addListener('data', (c) => (result += c));

    await new Promise((resolve) => output.addListener('close', resolve));

    const filteredFile = removePath(JSON.parse(result)[0]);
    await writeFile(
        join('./src/generated/', outputFileName),
        JSON.stringify(filteredFile, undefined, 4)
    );
}

// Recursively remove all fields that have the key "path", since this is a local path
function removePath(obj: { [key: string]: any }) {
    const newObj: { [key: string]: any } = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            let val = obj[key];
            if (!bannedKeys.includes(key)) {
                if (val instanceof Object) {
                    val = removePath(val);
                }

                newObj[key] = val;
            }
        }
    }
    return newObj;
}

projects.forEach((project) => {
    generatePackagesForProject(project.projectPath, project.outputFileName);
});
