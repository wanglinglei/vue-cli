import inquirer from "inquirer";
import cloneDeep from "lodash/cloneDeep.js";

import { defaults } from "./options.js";
import PromptModuleApi from "./promptModuleApi.js";
import { writeFileTree } from "./utils.js";
import { chalk } from "cli-shared-utils";

const isManualMode = (answers) => answers.preset === "_manual_";

class Creator {
  constructor(name, context, promptModules) {
    this.name = name;
    this.context = context;
    this.promptModules = promptModules;
    // 添加了新的特性后 有后续选择时添加
    this.injectedPrompts = [];
    // 选择所有选项后的回调
    this.promptCompleteCallbacks = [];
    const { presetPrompt, featurePrompt } = this.resolveIntroPrompts();
    this.presetPrompt = presetPrompt;
    this.featurePrompt = featurePrompt;
    const PromptApi = new PromptModuleApi(this);
    promptModules.forEach((module) => {
      module(PromptApi);
    });
  }
  async create() {
    const { name, context } = this;
    let answers = await this.promptAndResolvePresets();
    let preset;
    if (answers.preset && answers.preset !== "_manual_") {
      // 默认配置
      preset = await this.resolvePreset(answers.preset);
    } else {
      // 选择手动配置  插件配置为空 根据选择结果插入
      preset = {
        plugins: {},
      };
      answers.feature = answers.feature || [];
      this.promptCompleteCallbacks.forEach((callback) => {
        callback(answers, preset);
      });
    }

    preset = cloneDeep(preset);
    console.log("Creator-create------", answers, preset);
    // 添加核心模块
    preset.plugins["@vue/cli-service"] = Object.assign(
      { projectName: name },
      preset
    );
    //@note 生成语句提示
    console.log(`😶 Create project in ${chalk.yellow(context)}.`);
    // 生成项目package.json
    const pkg = {
      name,
      version: "0.1.0",
      private: true,
      devDependencies: {},
    };
    const deps = Object.keys(preset.plugins);
    deps.forEach((dep) => {
      pkg.devDependencies[dep] = "latest";
    });
    await writeFileTree(context, {
      "package.json": JSON.stringify(pkg, null, 2),
    });

    return preset;
  }
  resolvePreset(preset) {
    return this.getPresets()[preset];
  }
  async promptAndResolvePresets() {
    const finalPrompts = this.resolveFinalPrompts();
    let answers = await inquirer.prompt(finalPrompts);
    return answers;
  }
  resolveFinalPrompts() {
    this.injectedPrompts.forEach((prompt) => {
      let originWhen = prompt.when || (() => true);
      prompt.when = (answers) => {
        // 是手动模式 并且牵制选择完成后才会弹出
        return isManualMode && originWhen(answers);
      };
    });
    let prompts = [
      this.presetPrompt, // 选择预设
      this.featurePrompt, //  选对应特性
      ...this.injectedPrompts, // 不同的promptModule插入选项
    ];
    return prompts;
  }
  getPresets() {
    return Object.assign({}, defaults);
  }

  resolveIntroPrompts() {
    let presets = this.getPresets();
    const presetChoices = Object.entries(presets).map(([name]) => {
      let displayName = name;
      if (name === "default") {
        displayName = "Default";
      } else if (name === "_default_vue3") {
        displayName = "Default (vue3)";
      }
      return {
        name: `${displayName}`,
        value: name,
      };
    });

    const presetPrompt = {
      name: "preset",
      type: "list",
      message: "please select a preset",
      choices: [
        ...presetChoices,
        {
          name: "Manually select feature",
          value: "_manual_",
        },
      ],
    };

    const featurePrompt = {
      name: "feature",
      when: isManualMode,
      type: "checkbox",
      message: "Check feature needed for your project",
      choices: [],
    };
    return { presetPrompt, featurePrompt };
  }
}

export { Creator };
