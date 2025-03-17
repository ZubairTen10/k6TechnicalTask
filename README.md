# My k6 Test Project <br>

The advancedtest.js has the k6 test script to run performance tests on the k6 test api *"/public/crocodiles"* URI, and endpoint *"/crocodiles/id"*. <br>

My program has specific scenario running capability, you can specify exactly which test scenario you want to run with the CLI. Using the format " **k6 run --env scenario=<scenario_name> advancedtest.js** " . <br>
Else, if you would like to run the entire test suite, the command is the regular: " **k6 run advancedtest.js** " . <br>

There are 7 scenarios available: <br>

                                                     Scenario names
**simple_smoke_test** : 4 VUs perform 2 iterations each of the getCrocodiles and getCrocodilesById http get requests, with console.log messages to verify and show the correct json data is being retrieved. And to show that the script is dynamically storing and choosing a random ID from the json response. I called this a smoke test because I am checking the simple get functionality of the api, but also validating whether my test script is meeting the objectives: getting correct json response, gathering ids, randomly choosing an id and getting the correct crocodile data attached to that id. <br> <br>
![image](https://github.com/user-attachments/assets/84e7da6e-f051-41dc-861f-07d6fe2a1281)

<br>

**load_test** : 10 VUs for 30 seconds, simple load test with constant-vus executor.<br>![image](https://github.com/user-attachments/assets/e2d27202-52b1-4e77-bbe3-7f38f0eb0e05) <br>

**heavy_load_test** :  40 VUs for 1 minute, heavier load test with constant-vus executor. ![image](https://github.com/user-attachments/assets/4f76df64-73b1-4d5c-9b28-922df0a09b60)
<br> <br>
**Load test and heavy load test results**: <br>
<br>![image](https://github.com/user-attachments/assets/27a76d72-6d0d-444e-965a-672b0f123664)<br> <br>
**constant_request_rate**: arrival-rate-executor, trying to maintain 1000rps with maxVUs of 400. Duration of 30 seconds.  <br> <br>
**ramping_request_rate**: arrival-rate-executor, with stages of intervals of 30 seconds. 1st stage goal: 100 iterations, 2nd stage goal: 500 iterations, 3rd stage goal: 10 iterations. <br>  <br>
**ramping_request_rate_cloud** : Just a copy of ramping_request_rate scenario, but I limited the VUs to 100 to fit the k6 free cloud allowance. <br> <br>

**heavy_load_test_short**: Same as heavy_load_test. But with 70 VUs and only for 30sec duration. 

*I also realise I have VUs executor based scenarios and Arrival-Rate executor scenarios running on the same test function, which is contradictory as VUs test functions need sleep() to mimic think time, whereas Arrival-Rate executors are hindered by it since it can cause delays within VUs, when the aim is to maintain/meet a RPS threshold*. 


