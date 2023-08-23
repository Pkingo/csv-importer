import { readFile, writeFile, rm } from "fs/promises";
import csv from "csv-parser";
import { createReadStream } from "fs";
import { z } from "zod";

const csvSchema = z.object({
  sdp_id: z.coerce.number(),
  customerId: z.coerce.number(),
  customerName: z.string().trim(),
  store_id: z.coerce.number(),
  store_name: z.string().trim(),
  dc_id: z.coerce.number(),
  dc_name: z.string().trim(),
  open_date: z.coerce.date(),
  close_date: z.coerce.date(),
  mark_for_exclude: z.string().trim(),
  phone: z.coerce.number(),
  street_name: z.string().trim(),
});

export type CSVRow = z.infer<typeof csvSchema>;

export const removeDoubleQuotes = async (filePath: string): Promise<void> => {
  const data = await readFile(filePath, "utf-8");

  // remove double quotes
  const newValue = data.replace(/"/g, "");

  return writeFile(filePath, newValue, "utf-8");
};

export const convertToJSON = async (
  filePath: string
): Promise<[CSVRow[], unknown[]]> => {
  const rows: CSVRow[] = [];
  const faultyRows: unknown[] = [];
  return new Promise((resolve) => {
    createReadStream(filePath)
      .pipe(
        csv({
          separator: ",",
          mapHeaders: ({ header }) => header.trim(),
        })
      )
      .on("data", (data) => {
        const result = csvSchema.safeParse(data);
        if (!result.success) {
          faultyRows.push(data);
        } else {
          rows.push(result.data);
        }
      })
      .on("end", () => {
        resolve([rows, faultyRows]);
      });
  });
};

export const deleteFile = rm;
