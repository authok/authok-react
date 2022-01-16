import del from 'rollup-plugin-delete';
import livereload from 'rollup-plugin-livereload';
import dev from 'rollup-plugin-dev';
import typescript from 'rollup-plugin-typescript2';
import external from 'rollup-plugin-peer-deps-external';
import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import pkg from './package.json';
import analyze from 'rollup-plugin-analyzer';
import { createApp } from './scripts/oidc-provider';

const isProduction = process.env.NODE_ENV === 'production';
const name = 'reactAuthok';
const input = 'src/index.tsx';
const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
};

const _external = Object.keys(globals);

const plugins = [
  del({ targets: 'dist/*', runOnce: true }),
  typescript({ useTsconfigDeclarationDir: true }),
  external(),
  resolve(),
  replace({ __VERSION__: `'${pkg.version}'` }),
  analyze({ summaryOnly: true }),
];

export default [
  {
    input,
    output: [
      {
        name,
        file: 'dist/authok-react.js',
        format: 'umd',
        globals,
        sourcemap: true,
      },
    ],
    external: _external,
    plugins: [
      ...plugins,
      ...(isProduction
        ? []
        : [
            dev({
              dirs: ['dist', 'static'],
              open: true,
              port: 3000,
              extend(app, modules) {
                app.use(modules.mount(createApp({ port: 3000 })));
              }
            }),
            livereload(),
          ]),
    ],
  },
  ...(isProduction
    ? [
        {
          input,
          output: [
            {
              name,
              file: 'dist/authok-react.min.js',
              format: 'umd',
              globals,
              sourcemap: true,
            },
          ],
          external: _external,
          plugins: [...plugins, terser()],
        },
        {
          input,
          output: {
            name,
            file: pkg.main,
            format: 'cjs',
            sourcemap: true,
          },
          external: _external,
          plugins,
        },
        {
          input,
          output: {
            file: pkg.module,
            format: 'esm',
            sourcemap: true,
          },
          external: _external,
          plugins,
        },
      ]
    : []),
];