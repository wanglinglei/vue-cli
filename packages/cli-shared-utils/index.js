"use strict";

// import chalk from "chalk";
// import execa from "execa";
// import { isPlugin } from "./lib/pluginResolution";
let modules = Object.create(null);

async function outputModules() {
  // ["pluginResolution.js", "module.js"].forEach(async (module) => {
  //   const file =
  //     Object.assign(modules, import(`./lib/${module}`));
  // });
  // console.log("outputModules", modules);
  return Promise.all(
    ["pluginResolution.js", "module.js"].map(async (module) => {
      const file = await import(`./lib/${module}`);
      modules = { ...modules, ...file };
      return file;
    })
  );
}

// const modules = {};
// ["pluginResolution", "module"].forEach((module) => {
//   Object.assign(modules, require(`./lib/${module}`));
// });
// export { chalk, execa, isPlugin, modules };

// outputModules();
async function getAllFiles() {
  const res = await outputModules();
  console.log("res: ", res, modules);
}

// getAllFiles();
