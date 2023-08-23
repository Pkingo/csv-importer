import sql from "../db/db";

type Relation = { storeId: number; customerId: number };

const find = (relations: Relation[]) => {
  return sql`SELECT * FROM customer_x_store
    WHERE store_id in ${sql(relations.map(({ storeId }) => storeId))}
    AND customer_id in ${sql(relations.map(({ customerId }) => customerId))}`;
};

export const findAllCustomersByStoreId = async (
  storeId: number
): Promise<string[]> => {
  const responses = await sql`SELECT customer_id FROM customer_x_store
    WHERE store_id = ${storeId}`;
  return responses.map(({ customer_id }) => customer_id);
};

export const findAllStoresByCustomerId = async (
  customerId: number
): Promise<string[]> => {
  const responses = await sql`SELECT store_id FROM customer_x_store
    WHERE customer_id = ${customerId}`;
  return responses.map(({ store_id }) => store_id);
};

const createMany = (relations: Relation[]) => {
  if (relations.length === 0) {
    return Promise.resolve([]);
  }
  return sql`INSERT INTO customer_x_store
    (store_id, customer_id)
  VALUES
    ${sql(relations.map(({ storeId, customerId }) => [storeId, customerId]))}
  RETURNING *`;
};

export const addMissingRelations = async (relations: Relation[]) => {
  const existingRelations = await find(relations);
  const existingRelationsSet = new Set(
    existingRelations.map(
      ({ store_id, customer_id }) => `${store_id}-${customer_id}`
    )
  );
  const relationsToCreate = relations.filter(({ storeId, customerId }) => {
    return !existingRelationsSet.has(`${storeId}-${customerId}`);
  });
  return await createMany(relationsToCreate);
};
