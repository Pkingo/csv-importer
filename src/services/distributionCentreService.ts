import { DistributionCentre } from "../types/DistributionCentre";
import sql from "../db/db";

export const findManyById = async (
  ids: number[]
): Promise<DistributionCentre[]> => {
  return await sql<
    DistributionCentre[]
  >`SELECT * FROM distribution_centre WHERE id in (${sql(ids)})`;
};

export const fetchAll = () => {
  return sql`SELECT * FROM distribution_centre`;
};

export const findById = async (
  id: number
): Promise<DistributionCentre | null> => {
  return await sql<
    DistributionCentre[]
  >`SELECT * FROM distribution_centre WHERE id = ${id}`.then((responses) =>
    responses.length > 0 ? responses[0] : null
  );
};

export const createMany = async (
  items: DistributionCentre[]
): Promise<DistributionCentre[]> => {
  if (items.length === 0) {
    return Promise.resolve([]);
  }
  return await sql<DistributionCentre[]>`INSERT INTO distribution_centre
      (id, distribution_centre_name)
    VALUES
      ${sql(
        items.map(({ id, distribution_centre_name }) => [
          id,
          distribution_centre_name,
        ])
      )}
    RETURNING *`;
};

export const createMissingDistributionCentres = async (
  distributionCentres: Map<DistributionCentre["id"], DistributionCentre>
) => {
  const existingDistributionCentres = await findManyById([
    ...distributionCentres.keys(),
  ]);
  existingDistributionCentres.forEach(({ id }) => {
    distributionCentres.delete(id);
  });
  return createMany([...distributionCentres.values()]);
};
