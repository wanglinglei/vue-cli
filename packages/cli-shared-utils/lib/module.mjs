import Module from "module";
import path from "path";

function loadModule(request, context) {
  return Module.createRequire(path.resolve(context, "package.json"))(request);
}
export { loadModule };
