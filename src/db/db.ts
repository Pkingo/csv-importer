import postgres from "postgres";

const sql = postgres(
  "postgresql://postgres:postgres@127.0.0.1:5432/CSV_IMPORTER"
);

export const init = async () => {
  await sql`CREATE TABLE IF NOT EXISTS distribution_centre (id INTEGER PRIMARY KEY, distribution_centre_name TEXT)`;
  await sql`CREATE TABLE IF NOT EXISTS store (id INTEGER PRIMARY KEY, store_name TEXT, open_date TEXT, close_date TEXT)`;
  await sql`CREATE TABLE IF NOT EXISTS customer (id INTEGER PRIMARY KEY, customer_name TEXT, spd_id INTEGER, street_name TEXT, phone BIGINT)`;
  await sql`CREATE TABLE IF NOT EXISTS customer_x_store (customer_id INTEGER references customer(id), store_id INTEGER references store(id))`;
  await sql`CREATE TABLE IF NOT EXISTS store_x_distribution_centre (store_id INTEGER references store(id), distribution_centre_id INTEGER references distribution_centre(id))`;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS customer_x_store_idx ON customer_x_store(customer_id, store_id)`;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS store_x_distribution_centre_idx ON store_x_distribution_centre(store_id, distribution_centre_id)`;
};

export default sql;
