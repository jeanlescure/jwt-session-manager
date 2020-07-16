import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';

const pkg = require('./package.json');

const dev = process.env.ROLLUP_WATCH === 'true';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: `${pkg.main}.js`,
        format: 'cjs',
        sourcemap: true,
      },
    ],
    plugins: [
      typescript({
        useTsconfigDeclarationDir: true,
      }),
      commonjs({
        sourceMap: true,
      }),
      resolve({
        preferBuiltins: true,
      }),
    ],
    // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
    external: [
      ...Object.keys(pkg.dependencies),
      ...Object.keys(pkg.devDependencies),
    ],
    watch: {
      include: 'src/**',
    },
  },
  {
    input: 'src/client-manager/index.ts',
    output: [
      {
        file: `${pkg.main}.browser.js`,
        format: 'iife',
        name: 'ClientJWTSessionManager',
        sourcemap: true,
      },
    ],
    plugins: [
      typescript({
        useTsconfigDeclarationDir: true,
      }),
      commonjs({
        sourceMap: true,
      }),
      resolve({
        preferBuiltins: true,
        browser: true,
      }),
    ],
    // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
    external: [
      ...Object.keys(pkg.dependencies),
      ...Object.keys(pkg.devDependencies),
    ],
    watch: {
      include: 'src/**',
    },
  }
];
