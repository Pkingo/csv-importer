import express from "express";

import { init } from "./db/db";
import uploadRouter from "./routes/upload";
import storesRouter from "./routes/stores";
import customerRouter from "./routes/customer";
import dcRouter from "./routes/dcRouter";
const app = express();

app.use(express.static("public"));

app.use("/upload", uploadRouter);
app.use("/store", storesRouter);
app.use("/customer", customerRouter);
app.use("/distribution-centre", dcRouter);

app.get("/health", (_req, res) => {
  res.status(200).json({ message: "Server is healthy" });
});

app.listen(3000, () => {
  init();
  console.log("Server listening on port 3000");
});

process.on("exit", function () {
  // disconnect();
});
