import { Customer } from "../types/Customer";
import sql from "../db/db";

export const findManyById = async (ids: number[]): Promise<Customer[]> => {
  return await sql<Customer[]>`SELECT * FROM customer WHERE id in ${sql(ids)}`;
};

export const fetchAll = () => {
  return sql`SELECT * FROM customer`;
};

export const findById = async (id: number): Promise<Customer | null> => {
  return await sql<Customer[]>`SELECT * FROM customer WHERE id = ${id}`.then(
    (responses) => (responses.length > 0 ? responses[0] : null)
  );
};

export const createMany = async (items: Customer[]): Promise<Customer[]> => {
  if (items.length === 0) {
    return Promise.resolve([]);
  }
  return await sql<Customer[]>`INSERT INTO customer
      (id, customer_name, spd_id, street_name, phone)
    VALUES
      ${sql(
        items.map(({ id, customer_name, spd_id, street_name, phone }) => [
          id,
          customer_name,
          spd_id,
          street_name,
          phone,
        ])
      )}
    RETURNING *`;
};

export const createMissingCustomers = async (
  customers: Map<Customer["id"], Customer>
) => {
  const existingCustomers = await findManyById([...customers.keys()]);
  existingCustomers.forEach(({ id }) => {
    customers.delete(id);
  });
  return createMany([...customers.values()]);
};
