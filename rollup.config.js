import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from '@rollup/plugin-json';

export default {
  input: './src/app.js',
  output: {
    file: 'lib/updateIconfont.min.js',
    format: 'umd',
    name: 'update-ali-iconfont'
  },
  plugins: [
    resolve(),
    commonjs(),
    json()
  ]
}