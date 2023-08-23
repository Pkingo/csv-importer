import express from "express";

import * as storeService from "../services/storeService";
import * as storeXDCService from "../services/storeXDCService";
import * as customerXStoreService from "../services/customerXStoreService";

const storesRouter = express.Router();

storesRouter.get("/", async (req, res) => {
  const stores = await storeService.fetchAll();
  return res.json(stores);
});

storesRouter.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const store = await storeService.findById(id);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }
    const [distributionCentreIds, customerIds] = await Promise.all([
      storeXDCService.findAllDCByStoreId(id),
      customerXStoreService.findAllCustomersByStoreId(id),
    ]);

    return res.json({ ...store, distributionCentreIds, customerIds });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

export default storesRouter;
