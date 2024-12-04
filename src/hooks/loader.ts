import { lstatSync, readdirSync } from "fs";
import { resolve } from "path";

export const HooksModuleMap = await (async function hookModuleLoader(directory = import.meta.dirname + "/module") {
    const map = {}
    const parentPath = directory
    const dirs = readdirSync(parentPath)
    for (let i = 0; i < dirs.length; i++) {
        const dir = dirs[i]
        const path = resolve(parentPath, dir)
        const isDirectory = lstatSync(path).isDirectory()
        if (isDirectory) {
            map[dir] = await hookModuleLoader(path)
        } else {
            if (!dir.startsWith(".")) {
                const module = await import(import.meta.dirname + "/module/" + dir)
                map[dir] = module.hook
            }
        }
    }

    return map
})();