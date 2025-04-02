import { Router } from "express";
import { generateFileTree } from "../controllers/generateFileTree.controller.js";

const router = Router()

router.route("/file-path").get(async (_,res) => {
    const file = await generateFileTree("./user")
    
    res.json({tree:file})
})

export default router;