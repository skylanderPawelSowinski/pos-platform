import AWS from "aws-sdk";
import { Client } from "pg";

AWS.config.update({
  region: "eu-north-1",
});

async function main() {
  const signer = new AWS.RDS.Signer({
    region: "eu-north-1",
    hostname: process.env.DATABASE_URL || process.env.DATABASE_HOST,
    port: 5432,
    username: "postgres",
  });

  const password = signer.getAuthToken({});

  const client = new Client({
    host: process.env.DATABASE_URL || process.env.DATABASE_HOST,

    port: 5432,

    database: "postgres",

    user: "postgres",

    password,

    ssl: {
      rejectUnauthorized: false,
    },
  });

  await client.connect();

  const result = await client.query("select version()");

  console.log(result.rows[0]);

  await client.end();
}

main();
