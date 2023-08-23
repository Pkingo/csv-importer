import express from "express";

import * as customerService from "../services/customerService";
import * as customerXStoreService from "../services/customerXStoreService";

const customerRouter = express.Router();

customerRouter.get("/", async (req, res) => {
  const stores = await customerService.fetchAll();
  return res.json(stores);
});

customerRouter.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const customer = await customerService.findById(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    const storeIds = await customerXStoreService.findAllStoresByCustomerId(id);

    return res.json({ ...customer, storeIds });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

export default customerRouter;
