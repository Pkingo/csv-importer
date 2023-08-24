# CSV importer

When this project is run, visit http://localhost:3000/ to update a CSV file, that will process the data and insert it into a Postgres database.

Afterwards, you can curl the following endpoints to get data out

```
// all customers
http://localhost:3000/customer
// get specific customer
http://localhost:3000/customer/:id
// all stores
http://localhost:3000/store
// get specific store
http://localhost:3000/store/:id
// all distribution centres
http://localhost:3000/distribution-centre
// get specific distribution centre
http://localhost:3000/distribution-centre/:id
```

![Data structure](./images/Untitled-2023-06-12-1420.png)

## Running the project

This project is only meant for local development, as none of the infrastructure of production is in place!

After following the Setting up step, you can run the project using the `dev` component. which starts the project in watch mode

```
pnpm run dev
```

## Setting up

First, you'll need to have Postgres installed. Depending on your OS, this step can vary.
https://www.postgresql.org/download/

This project uses the following connection string for local developerment

```
postgresql://postgres:postgres@127.0.0.1:5432/CSV_IMPORTER
```

Postgres should come with a default user called postgres, so all that is needed should be to create a database called `CSV_IMPORTER`

```
createdb CSV_IMPORTER
```

Lastly, install the dependencies. This project comes with a `pnpm-lock.yaml`, but you can use whatever package manager you prefer.

```bash
# npm
npm install
# yarn
yarn install
# pnpm
pnpm install
```
