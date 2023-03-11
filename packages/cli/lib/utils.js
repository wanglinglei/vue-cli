const modules = ["vueVersion"];

/**
 * @description: 获取选项模块
 * @return {*}
 */
function getPromptModules() {
  return modules.map((file) => {
    return require(`./promptModules/` + file);
  });
}

module.exports = { getPromptModules };
