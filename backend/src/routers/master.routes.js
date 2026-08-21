import { Router } from "express";
import masterController from "../controllers/masterController.js";
import authOptional from "../middleware/authOptional.js";
import upload from "../middleware/uploads.js";

const router = Router();

router.post(
  "/",
  authOptional,
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 10 },
    { name: "tour_images", maxCount: 10 },
    { name: "destination_images", maxCount: 10 },
    { name: "documents", maxCount: 10 },
  ]),
  masterController.handle,
);

export default router;
