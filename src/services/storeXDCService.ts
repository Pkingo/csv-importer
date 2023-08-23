import sql from "../db/db";

type Relation = { storeId: number; dcId: number };

const find = (relations: Relation[]) => {
  return sql`SELECT * FROM store_x_distribution_centre
    WHERE store_id in ${sql(relations.map(({ storeId }) => storeId))}
    AND distribution_centre_id in ${sql(relations.map(({ dcId }) => dcId))}`;
};

export const findAllDCByStoreId = async (
  storeId: number
): Promise<string[]> => {
  const responses =
    await sql`SELECT distribution_centre_id FROM store_x_distribution_centre
    WHERE store_id = ${storeId}`;
  return responses.map(({ distribution_centre_id }) => distribution_centre_id);
};

export const findAllStoresByDCId = async (dcId: number): Promise<string[]> => {
  const responses = await sql`SELECT store_id FROM store_x_distribution_centre
    WHERE distribution_centre_id = ${dcId}`;
  return responses.map(({ store_id }) => store_id);
};

const createMany = (relations: Relation[]) => {
  if (relations.length === 0) {
    return Promise.resolve([]);
  }
  return sql`INSERT INTO store_x_distribution_centre
    (store_id, distribution_centre_id)
  VALUES
    ${sql(relations.map(({ storeId, dcId }) => [storeId, dcId]))}
  RETURNING *`;
};

export const addMissingRelations = async (relations: Relation[]) => {
  const existingRelations = await find(relations);
  const existingRelationsSet = new Set(
    existingRelations.map(
      ({ store_id, distribution_centre_id }) =>
        `${store_id}-${distribution_centre_id}`
    )
  );
  const relationsToCreate = relations.filter(({ storeId, dcId }) => {
    return !existingRelationsSet.has(`${storeId}-${dcId}`);
  });
  return await createMany(relationsToCreate);
};
