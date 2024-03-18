import pathlib from 'path'
import jest from 'jest'

export function runJest(jestArgs: string[], srcDir: string) {
	return jest.run(jestArgs, pathlib.join(srcDir, 'jest.config.js'))
}
