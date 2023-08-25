import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import esbuild from "rollup-plugin-esbuild";
import dts from "rollup-plugin-dts";

import globalPackageJSON from "./package.json" assert { type: "json" };

export const dist = "dist/bundle";

export const bundleConfig = (packageJSON, externalsWhitelist = []) => {
  const external = [
    ...Object.keys(packageJSON.devDependencies ?? {}),
    ...Object.keys(packageJSON.dependencies ?? {}),
    ...Object.keys(globalPackageJSON.devDependencies ?? {}),
    ...Object.keys(globalPackageJSON.dependencies ?? {})
  ].filter(dep => !externalsWhitelist.includes(dep));

  return {
    input: "src/index.ts",
    output: [
      {
        file: `${dist}.cjs`,
        format: "cjs",
        sourcemap: true,
        inlineDynamicImports: true
      },
      {
        file: `${dist}.mjs`,
        format: "esm",
        sourcemap: true,
        inlineDynamicImports: true
      }
    ],
    plugins: [
      // nodeResolve(),
      commonjs(),
      json(),
      esbuild({
        sourceMap: true,
        target: "es2020",
        minify: process.env.NODE_ENV === "production",
        tsconfig: "./tsconfig.json" // default
      })
    ],
    external
  };
};

export const declarationsConfig = {
  input: "src/index.ts",
  output: [
    {
      file: `${dist}.d.ts`,
      format: "es"
    }
  ],
  plugins: [dts()],
  external: []
};

export default [bundleConfig, declarationsConfig];
