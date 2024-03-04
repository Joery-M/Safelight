import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';
import { mkdir, writeFile } from 'fs/promises';

if (!existsSync('./src/generated')) {
    mkdir('./src/generated');
}

const bannedKeys = ['unsavedDependencies', 'path'];

const output = spawn('pnpm', ['list', '--depth', '2', '--json', '--long'], {
    cwd: join(process.cwd(), '../../'),
    stdio: ['inherit', 'pipe', 'inherit'],
    shell: true
});

// Everything is spat out in one go
output.stdout.once('data', async (msg) => {
    const filteredFile = removePath(JSON.parse(msg.toString())[0]);
    await writeFile('./src/generated/packages.json', JSON.stringify(filteredFile, undefined, 4));
});

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
