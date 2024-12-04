


import { HooksModuleMap } from "./hooks/loader.js";
import { Application } from "./providers/Application.js";
console.log("HooksModuleMap",HooksModuleMap)
export const application = new Application();
application.start()
