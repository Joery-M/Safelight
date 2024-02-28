import { spawn } from 'child_process';
import { writeFile } from 'fs/promises';

const bannedKeys = ['unsavedDependencies', 'path'];

const output = spawn('pnpm', ['list', '--depth', '2', '--json', '--long'], {
    cwd: process.cwd(),
    stdio: ['inherit', 'pipe', 'inherit'],
    shell: true
});

// Everything is spat out in one go
output.stdout.once('data', (msg) => {
    const filteredFile = removePath(JSON.parse(msg.toString())[0]);
    writeFile('./src/generated/packages.json', JSON.stringify(filteredFile, undefined, 4));
});

// Recursively remove all fields that have the key "path", since this is a local path
function removePath(obj: object) {
    const newObj = {};
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
