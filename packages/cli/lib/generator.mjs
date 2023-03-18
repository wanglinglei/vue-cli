import { isPlugin } from "cli-shared-utils";
import { GeneratorApi } from "./generatorApi.mjs";
class Generator {
  /**
   * @description:
   * @param {*} context 项目目录
   * @param {*} pkg  项目的package.json
   * @param {*} plugins 插件对象 [{id,apply,options}]
   * @return {*}
   */
  constructor(context, { pkg, plugins }) {
    console.log("Generator-构造函数", context, pkg, plugins);
    this.context = context;
    this.plugins = plugins;
    this.pkg = pkg;
    this.files = {}; // 依赖的所有文件存在这里
    this.fileMiddleWares = []; // 生成文件的中间件，每个插件都会往中间件里插入中间件 中间件往this.files 写入有文件

    // 从所有依赖中筛选中所有插件
    this.allPluginIds = Object.keys(this.pkg.dependencies || {})
      .concat(this.pkg.devDependencies || {})
      .filter(isPlugin);

    const cliService = plugins.find(
      (plugin) => plugin.id === "@vue/cli-service"
    );
    // cliService 配置对象是预设配置preset 作为根配置
    this.rootOptions = cliService.options;
  }

  /**
   * @description: 生成模板文件
   * @return {*}
   */
  async generator() {
    this.initPlugins();
  }
  /**
   * @description: 加载插件
   * @return {*}
   */
  initPlugins() {
    const { rootOptions } = this;
    for (const plugin of this.plugins) {
      const { id, apply, options } = plugin;
      // 给每一个插件都添加一个生成器
      const generatorApi = new GeneratorApi({ id, rootOptions, options });
    }
  }
}

export { Generator };
