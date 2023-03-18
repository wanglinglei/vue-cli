const pluginReg = /@vue\/cli-plugin-/;

function isPlugin(plugin) {
  return pluginReg.test(plugin);
}

export { isPlugin };
