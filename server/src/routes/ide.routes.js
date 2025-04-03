import { Router } from "express";
import fs from "fs/promises"
import { generateFileTree } from "../controllers/generateFileTree.controller.js";

const router = Router()

router.route("/file-path").get(async (_,res) => {
    const file = await generateFileTree("./user")
    
    res.json({tree:file})
})

router.route("/file-content").get(async(req, res) => {
    const {path} = req.query;
    const content = await fs.readFile(`./user/${path}`, "utf-8")
    res.json({content})
})

export default router;