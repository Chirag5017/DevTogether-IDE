import { Router } from "express";
import { generateFileTree } from "../controllers/generateFileTree.controller.js";

const router = Router()

router.route("/file-path").get(async (req,res) => {
    const file = await generateFileTree("../user")
    res.json({fileTree : file})
})

export default router;