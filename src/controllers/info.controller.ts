import type { Request, Response } from "express";
import { infoService, type InfoChange } from "../services/info.service.ts";

export const infoController = {
  async get(_req: Request, res: Response) {
    const info = await infoService.get();
    if (!info) return res.status(404).json({ error: "not found" });
    res.json(info);
  },

  async change(req: Request, res: Response) {
    const updated = await infoService.change(req.body as InfoChange);
    res.json(updated);
  },
};
