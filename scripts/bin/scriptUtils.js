import { readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
export function cjsDirname(url) {
    return join(dirname(fileURLToPath(url)));
}
export const retrieveManifest = async (manifest) => {
    try {
        const rawManifest = await readFile(manifest, 'utf-8');
        return JSON.parse(rawManifest);
    }
    catch (error) {
        if (error.code === 'ENOENT')
            throw new Error(`Could not locate manifest file at ${manifest}`);
        throw error;
    }
};
export const wrapWithTimer = (func) => async (...params) => {
    const startTime = performance.now();
    const result = await func(...params);
    const endTime = performance.now();
    return {
        elapsed: endTime - startTime,
        result,
    };
};
