# The Leaking Problem

The Leaking Problem This issue is occurring because apparently the
[porsager/postgres library](https://github.com/porsager/postgres) keeps
asynchronous operations in memory without completing them. This may be causing
the [Deno test runner library](https://deno.land/std@0.212.0/testing/bdd.ts) to
fail during assertion.

To simulate the problem of this project, make sure you have
[Deno](https://deno.land/) and [Docker](https://www.docker.com/) installed.

1. Build the PostgreSQL database with:

   ```bash
   deno task db:build
   ```

2. Run the test with:

   ```bash
   deno task test
   ```

Note that the test will fail with an output like:

<details>
    <summary>👈 Click here to see the error output</summary>

```
ERRORS

leak problem test ... should not leak => https://deno.land/std@0.212.0/testing/_test_suite.ts:323:15
error: Leaking async ops:
  - 1 async operation to op_read was started in this test, but never completed. The operation was started here:
    at handleOpCallTracing (ext:core/01_core.js:535:42)
    at Object.op_read (ext:core/01_core.js:379:21)
    at TcpConn.read (ext:deno_net/01_net.js:128:26)
    at success (https://deno.land/x/postgresjs@v3.4.3/polyfills.js:97:66)
    at eventLoopTick (ext:core/01_core.js:182:7)
  - 1 async operation to sleep for a duration was started in this test, but never completed. This is often caused by not cancelling a `setTimeout` or `setInterval` call. The operation was started here:
    at handleOpCallTracing (ext:core/01_core.js:535:42)
    at op_sleep (ext:core/01_core.js:379:21)
    at runAfterTimeout (ext:deno_web/02_timers.js:234:20)
    at initializeTimer (ext:deno_web/02_timers.js:192:3)
    at setTimeout (ext:deno_web/02_timers.js:336:10)
    at Object.start (https://deno.land/x/postgresjs@v3.4.3/src/connection.js:1033:15)
    at connected (https://deno.land/x/postgresjs@v3.4.3/src/connection.js:365:17)
    at https://deno.land/x/postgresjs@v3.4.3/polyfills.js:138:30
    at Array.forEach (<anonymous>)
    at call (https://deno.land/x/postgresjs@v3.4.3/polyfills.js:138:16)

FAILURES

leak problem test ... should not leak => https://deno.land/std@0.212.0/testing/_test_suite.ts:323:15
```

</details>

However, note that if you turn off sanitizeOps and sanitizeResources by setting
false for the sanitizers constant around line 13, the test passes again:

<details>
    <summary>👈 Oops, now the test passes! ✅</summary>

```bash
running 1 test from ./main_test.ts
leak problem test ...
  should not leak ...
------- output -------
create_result:  Result(0) []
insert_result:  Result(1) [ { name: "test" } ]
drop_result:  Result(0) []
----- output end -----
  should not leak ... ok (319ms)
leak problem test ... ok (323ms)

ok | 1 passed (1 step) | 0 failed (329ms)
```

</details>

3. To completely remove the PostgreSQL database, run:

   ```bash
   deno task db:remove
   ```

_Bonus_: if you are on Linux, run `deno task docker:print` to view your Docker
objects.
