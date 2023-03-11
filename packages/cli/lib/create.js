const path = require("path");
const { getPromptModules } = require("./utils");
const Creator = require("./ctrator");
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
  let promptModules = getPromptModules();

  const creator = new Creator(name, targetDir, promptModules);
  creator.create();
}

module.exports = (...args) => {
  return create(...args).catch((err) => {
    console.log("project-create error", err);
  });
};
