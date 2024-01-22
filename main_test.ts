import postgresjs from 'https://deno.land/x/postgresjs@v3.4.3/mod.js';
import { describe, it, beforeEach, afterEach, afterAll, beforeAll } from 'https://deno.land/std@0.212.0/testing/bdd.ts';
import { expect } from 'https://deno.land/std@0.212.0/expect/mod.ts';
import { Client } from 'https://deno.land/x/postgres@v0.17.0/mod.ts';

// const sql = postgresjs({
//   host: '0.0.0.0',
//   port: 5432,
//   user: 'leak_problem_user',
//   password: 'leak_problem_password',
//   database: 'leak_problem_db'
// });

const client = new Client({
  hostname: '0.0.0.0',
  port: 5432,
  user: 'leak_problem_user',
  password: 'leak_problem_password',
  database: 'leak_problem_db'
});

const sanatizers = true;

describe('leak problem test', { sanitizeOps: sanatizers, sanitizeResources: sanatizers }, () => {
  beforeAll(async () => {
    await client.connect();
  });

  afterEach(async () => {
    // const dropResult = await sql`DROP TABLE IF EXISTS leak_problem_table;`.execute();
    const dropResult = await client.queryArray`DROP TABLE IF EXISTS leak_problem_table;`;
    console.log('drop_result: ', dropResult);
  });

  beforeEach(async () => {
    // const createResult = await sql`
    // CREATE TABLE IF NOT EXISTS
    // leak_problem_table (
    //   id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL
    // )`.execute();

    const createResult = await client.queryArray`
      CREATE TABLE IF NOT EXISTS
      leak_problem_table (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );
    `;

    console.log('create_result: ', createResult);
  });

  afterAll(async () => {
    // await sql.end();
    await client.end();
  });

  it('should not leak', async () => {
    type LeakType = { name: string };
    // const insertResult = await sql<Array<LeakType>>`
    //   INSERT INTO leak_problem_table
    //   (name) VALUES ('test')
    //   RETURNING name
    // `.execute();
    const [[insertResult]] = (
      await client.queryArray<Array<LeakType>>`
      INSERT INTO leak_problem_table 
      (name) VALUES ('test') 
      RETURNING name
    `
    ).rows;
    console.log('insert_result: ', insertResult);
    expect(insertResult).toBe('test');
  });
});
