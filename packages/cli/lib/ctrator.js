const { defaults } = require("./options");
const inquirer = require("inquirer");
const isManualMode = (answers) => answers.preset === "_manual_";
const PromptModuleApi = require("./promptModuleApi");

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
    let preset = await this.promptAndResolvePresets();
    console.log("Creator-create------", preset);
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

module.exports = Creator;
