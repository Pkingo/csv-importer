import { Store } from "../types/Store";
import sql from "../db/db";

export const findById = async (id: number): Promise<Store | null> => {
  return await sql<Store[]>`SELECT * FROM store WHERE id = ${id}`.then(
    (responses) =>
      responses.length > 0
        ? {
            ...responses[0],
            open_date: new Date(responses[0].open_date),
            close_date: new Date(responses[0].close_date),
          }
        : null
  );
};

export const fetchAll = () => {
  return sql`SELECT * FROM store`;
};

export const findManyById = async (ids: number[]): Promise<Store[]> => {
  return await sql<Store[]>`SELECT * FROM store WHERE id in ${sql(ids)}`.then(
    (responses) =>
      responses.map((response) => ({
        ...response,
        open_date: new Date(response.open_date),
        close_date: new Date(response.close_date),
      }))
  );
};

export const createMany = async (items: Store[]): Promise<Store[]> => {
  if (items.length === 0) {
    return Promise.resolve([]);
  }
  return await sql<Store[]>`INSERT INTO store
      (id, store_name, open_date, close_date)
    VALUES
      ${sql(
        items.map(({ id, store_name, open_date, close_date }) => [
          id,
          store_name,
          open_date.toString(),
          close_date.toString(),
        ])
      )}
    RETURNING *`;
};

export const createMissingStores = async (stores: Map<Store["id"], Store>) => {
  const existingStores = await findManyById([...stores.keys()]);
  existingStores.forEach(({ id }) => {
    stores.delete(id);
  });
  return createMany([...stores.values()]);
};
