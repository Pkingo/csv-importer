import * as fileService from "../services/fileService";
import { Customer } from "../types/Customer";
import { DistributionCentre } from "../types/DistributionCentre";
import { Store } from "../types/Store";

export const sortCSVDataSet = (rows: fileService.CSVRow[]) => {
  const distributionCentres = new Map<
    DistributionCentre["id"],
    DistributionCentre
  >();
  const stores = new Map<Store["id"], Store>();
  const customers = new Map<Customer["id"], Customer>();
  const customersXStores = new Set<string>();
  const storesXDC = new Set<string>();

  rows.forEach((row) => {
    distributionCentres.set(row.dc_id, {
      id: row.dc_id,
      distribution_centre_name: row.dc_name,
    });
    stores.set(row.store_id, {
      id: row.store_id,
      store_name: row.store_name,
      open_date: row.open_date,
      close_date: row.close_date,
    });
    customers.set(row.customerId, {
      id: row.customerId,
      customer_name: row.customerName,
      spd_id: row.sdp_id,
      street_name: row.street_name,
      phone: row.phone,
    });
    customersXStores.add(`${row.customerId}-${row.store_id}`);
    storesXDC.add(`${row.store_id}-${row.dc_id}`);
  });

  return {
    distributionCentres,
    stores,
    customers,
    // return numbers
    customersXStores: [...customersXStores].map((item) => {
      const [customerId, storeId] = item.split("-");
      return { customerId: Number(customerId), storeId: Number(storeId) };
    }),
    storesXDC: [...storesXDC].map((item) => {
      const [storeId, dcId] = item.split("-");
      return { storeId: Number(storeId), dcId: Number(dcId) };
    }),
  };
};
