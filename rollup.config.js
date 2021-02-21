import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonJS from 'rollup-plugin-commonjs';
import filesize from 'rollup-plugin-filesize';

const modules = ['module'];

export default modules.map((name, index) => ({
  input: `./src/${name}/${name}.tsx`,
  output: {
    dir: 'build',
    format: 'iife',
    globals: {
      react: 'React',
    },
  },
  external: ['react'],
  plugins: [
    typescript(),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.ts', '.tsx'],
      include: ['src/**/*'],
    }),
    resolve(),
    commonJS({
      include: 'node_modules/**',
    }),
    filesize(),
  ],
}));
