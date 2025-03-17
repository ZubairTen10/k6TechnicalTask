# My k6 Test Project <br>

The advancedtest.js has the k6 test script to run performance tests on the k6 test api *"/public/crocodiles"* URI, and endpoint *"/crocodiles/id"*. <br>

My program has specific scenario running capability, you can specify exactly which test scenario you want to run with the CLI. Using the format " **k6 run --env scenario=<scenario_name> advancedtest.js** " . <br>
Else, if you would like to run the entire test suite, the command is the regular: " **k6 run advancedtest.js** " . <br>

There are 7 scenarios available: <br>

Scenario names: <br>
**simple_smoke_test** : 4 VUs perform 2 iterations each of the getCrocodiles and getCrocodilesById http get requests, with console.log messages to verify and show the correct json data is being retrieved. And to show that the script is dynamically storing and choosing a random ID from the json response.

**load_test** <br>
**heavy_load_test** <br>
**constant_request_rate** <br>
**ramping_request_rate** <br>
**ramping_request_rate_cloud** : Just a copy of ramping_request_rate scenario, but I limited the VUs to 100 to fit the k6 free cloud allowance. <br>

**heavy_load_test_short** 

*I also realise I have VUs executor based scenarios and Arrival-Rate executor scenarios running on the same test function, which is contradictory as VUs test functions need sleep() to mimic think time, whereas Arrival-Rate executors are hindered by it since it can cause delays within VUs, when the aim is to maintain/meet a RPS threshold*. 
