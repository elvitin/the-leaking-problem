import postgresjs from 'https://deno.land/x/postgresjs@v3.4.3/mod.js';
import { describe, it, beforeEach, afterEach, afterAll, beforeAll } from 'https://deno.land/std@0.212.0/testing/bdd.ts';
import { expect } from 'https://deno.land/std@0.212.0/expect/mod.ts';
import { msgMoji } from '/utils/msgmoji.ts';
const d = msgMoji('🧪test_tube');
const i = msgMoji('🟡yellow_circle');

const sql = postgresjs({
  host: '0.0.0.0',
  port: 5432,
  user: 'leak_problem_user',
  password: 'leak_problem_password',
  database: 'leak_problem_db'
});

const sanatizers = true;

describe(d('leak problem test'), { sanitizeOps: sanatizers, sanitizeResources: sanatizers }, () => {
  afterEach(async () => {
    const dropResult = await sql`DROP TABLE IF EXISTS leak_problem_table;`.execute();
    console.log('drop_result: ', dropResult);
  });

  beforeAll(async () => {
    const version = await sql`SELECT version();`;
    console.log('open connection: ', JSON.stringify(version.at(0), undefined, 2));
  });

  beforeEach(async () => {
    const createResult = await sql`
    CREATE TABLE IF NOT EXISTS
    leak_problem_table (
      id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL
    )`.execute();
    console.log('create_result: ', createResult);
  });

  afterAll(async () => {
    await sql.end();
  });

  it(i('should not leak'), async () => {
    type LeakType = { name: string };
    const insertResult = await sql<Array<LeakType>>`
      INSERT INTO leak_problem_table 
      (name) VALUES ('test') 
      RETURNING name
    `.execute();

    console.log('insert_result: ', insertResult);
    expect(insertResult[0].name).toBe('test');
  });
});
