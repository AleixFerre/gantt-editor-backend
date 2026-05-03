import { Router } from "express";
import { infoController } from "../controllers/info.controller.ts";

export const infoRouter = Router();

infoRouter.get("/info", infoController.get);
infoRouter.patch("/change", infoController.change);
