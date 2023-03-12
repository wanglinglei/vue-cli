const modules = ["vueVersion.mjs"];
import { ensureDirSync, createFileSync, outputFileSync } from "fs-extra/esm";
import path from "path";
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

export { getPromptModules, writeFileTree };
