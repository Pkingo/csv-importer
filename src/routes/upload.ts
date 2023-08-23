import express from "express";
import multer from "multer";

import * as fileService from "../services/fileService";
import * as distributionCentreService from "../services/distributionCentreService";
import * as storeService from "../services/storeService";
import * as customerService from "../services/customerService";
import * as customerXStoreService from "../services/customerXStoreService";
import * as storeXDCService from "../services/storeXDCService";
import { sortCSVDataSet } from "../utils/formatCSVRow";

const upload = multer({ dest: "tmp/csv/" });

const uploadRouter = express.Router();

uploadRouter.post("/", upload.single("csv"), async (req, res) => {
  const file = req.file;
  if (!file) {
    console.log("No file uploaded");
    return res.redirect("/?error=true");
  }

  try {
    await fileService.removeDoubleQuotes(file.path);
    const [data, faultyRows] = await fileService.convertToJSON(file.path);
    if (faultyRows.length > 0) {
      // should report errors back to user. For now we just console log
      console.log("Faulty rows", faultyRows);
    }
    const {
      distributionCentres,
      stores,
      customers,
      customersXStores,
      storesXDC,
    } = sortCSVDataSet(data);

    await Promise.all([
      distributionCentreService.createMissingDistributionCentres(
        distributionCentres
      ),
      storeService.createMissingStores(stores),
      customerService.createMissingCustomers(customers),
    ]);

    await Promise.all([
      customerXStoreService.addMissingRelations(customersXStores),
      storeXDCService.addMissingRelations(storesXDC),
    ]);

    await fileService.deleteFile(file.path);

    return res.redirect("/?success=true");
  } catch (error) {
    console.log("Error", error);
    await fileService.deleteFile(file.path);
    return res.redirect("/?error=true");
  }
});

export default uploadRouter;
