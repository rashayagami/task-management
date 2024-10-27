import e from "express"
import { Version } from "../providers/Version.js"
import { testApi } from "../routes/index.js"

export const router = e.Router()
router.use("/api", testApi)