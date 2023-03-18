const modules = ["vueVersion.mjs"];
import { ensureDirSync, createFileSync, outputFileSync } from "fs-extra/esm";
import path from "path";
import fs from "fs";
import ejs from "ejs";
/**
 * @description: 获取选项模块
 * @return {*}
 */
async function getPromptModules() {
  return await Promise.all(
    modules.map(async (file) => {
      const module = await import(`./promptModules/` + file);
      return module.default;
    })
  );
}

async function writeFileTree(dir, files) {
  Object.keys(files).forEach((file) => {
    const filePath = path.join(dir, file);
    ensureDirSync(path.dirname(filePath));
    outputFileSync(filePath, files[file]);
  });
}

function extractCallDir() {
  const obj = {};
  Error.captureStackTrace(obj);
  const callSite = obj.stack.split("\n")[3];
  const nameStackRegExp = /\s\((.*):\d+:\d+\)$/;
  const fileName = callSite.match(nameStackRegExp)[1];
  return path.dirname(fileName);
}

function isString(str) {
  return typeof str === "string";
}

function toShortPluginId(id) {
  return id.replace(
    /^(@vue\/cli-plugin-|@vue\/cli-|vue-cli-plugin-|vue-cli-)/,
    ""
  );
}

function renderFile(filePath, data) {}

export {
  getPromptModules,
  writeFileTree,
  extractCallDir,
  isString,
  toShortPluginId,
};
