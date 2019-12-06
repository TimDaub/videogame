// @format
import { terser } from "rollup-plugin-terser";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import replace from "rollup-plugin-replace";
import postcss from "rollup-plugin-postcss";
import url from "@rollup/plugin-url";
import copy from "rollup-plugin-copy";

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

module.exports = [
  {
    input: "src/js/main.js",
    output: {
      dir: "public",
      format: "es",
      sourcemap: !production
    },
    plugins: [
      copy({
        targets: [
          { src: "src/html/*.html", dest: "public" },
          { src: "src/images/*.png", dest: "public/images" }
        ]
      }),
      url({
        // by default, rollup-plugin-url will not handle font files
        include: ["**/*.woff", "**/*.woff2"],
        // setting infinite limit will ensure that the files
        // are always bundled with the code, not copied to /dist
        limit: Infinity
      }),
      postcss({
        extensions: [".css", ".scss"]
      }),
      replace({
        "process.env.NODE_ENV": JSON.stringify("production")
      }),
      babel({
        exclude: "node_modules/**"
      }),
      resolve({ browser: true }),
      commonjs(),
      production && terser()
    ]
  }
];
