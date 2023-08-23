import express from "express";

import * as distributionCentreService from "../services/distributionCentreService";
import * as storeXDCService from "../services/storeXDCService";

const dcRouter = express.Router();

dcRouter.get("/", async (req, res) => {
  const stores = await distributionCentreService.fetchAll();
  return res.json(stores);
});

dcRouter.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const dc = await distributionCentreService.findById(id);
    if (!dc) {
      return res.status(404).json({ message: "Distribution centre not found" });
    }
    const storeIds = await storeXDCService.findAllStoresByDCId(id);

    return res.json({ ...dc, storeIds });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

export default dcRouter;
