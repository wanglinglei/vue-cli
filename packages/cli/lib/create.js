import path from "path";
import { getPromptModules } from "./utils.js";
import { Creator } from "./creator.js";
/**
 * @description:
 * @param {*} projectName
 * @return {*}
 */
async function create(projectName) {
  // 获取当前的工作目录
  let cwd = process.cwd();
  const name = projectName;
  // 目标目录
  const targetDir = path.resolve(cwd, name);
  console.log("targetDir", targetDir);
  // 获取选项模块
  let promptModules = await getPromptModules();
  const creator = new Creator(name, targetDir, promptModules);
  creator.create();
}

const createApi = (...args) => {
  return create(...args).catch((err) => {
    console.log("project-create error", err);
  });
};
export { createApi };
