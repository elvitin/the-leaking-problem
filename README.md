# The Leaking Problem

The Leaking Problem This issue is occurring because apparently the
[porsager/postgres library](https://github.com/porsager/postgres) keeps
asynchronous operations in memory without completing them. This may be causing
the [Deno test runner library](https://deno.land/std@0.212.0/testing/bdd.ts) to
fail during assertion.

But, the postgres driver library develop by denodrivers team works fine. You can
see the test passing with this library in the branch `pg_driver_by_denodrivers`.

To test this project, make sure you have [Deno](https://deno.land/) and
[Docker](https://www.docker.com/) installed.

1. Build the PostgreSQL database with:

   ```bash
   deno task db:build
   ```

2. Run the test with:

   ```bash
   deno task test
   ```

`sanatizers` can be activated by setting true.

<details>
    <summary>👈 test passes! ✅</summary>

```bash
Task test deno test --allow-env --allow-net --trace-ops --allow-none
running 1 test from ./main_test.ts
leak problem test ...
  should not leak ...
------- output -------
create_result:  QueryArrayResult {
  query: Query {
    args: [],
    camelcase: undefined,
    fields: undefined,
    result_type: 0,
    text: "\n" +
      "      CREATE TABLE IF NOT EXISTS\n" +
      "      leak_problem_table (\n" +
      "        id SERIAL PRIMARY KEY,\n" +
      "        "... 40 more characters
  },
  command: "CREATE",
  rowCount: NaN,
  warnings: [],
  rows: []
}
insert_result:  test
drop_result:  QueryArrayResult {
  query: Query {
    args: [],
    camelcase: undefined,
    fields: undefined,
    result_type: 0,
    text: "DROP TABLE IF EXISTS leak_problem_table;"
  },
  command: "DROP",
  rowCount: NaN,
  warnings: [],
  rows: []
}
----- output end -----
  should not leak ... ok (41ms)
leak problem test ... ok (87ms)

ok | 1 passed (1 step) | 0 failed (93ms)
```

</details>

3. To completely remove the PostgreSQL database, run:

   ```bash
   deno task db:remove
   ```

_Bonus_: if you are on Linux, run `deno task docker:print` to view your Docker
objects.
