import http from 'k6/http';
import { check,sleep } from 'k6';

//Used this code as template to start my test for selecting crocodile data by id
// https://grafana.com/docs/k6/latest/using-k6/scenarios/advanced-examples/

let scenarios = {
  first_test: {
    vus: 1,
    exec: 'apitest_jsonexp'
  },
  my_api_test_1: {
    executor: 'constant-arrival-rate',
    rate: 5,
    timeUnit: '10s', // 90 iterations per minute, i.e. 1.5 RPS
    duration: '30s',
    preAllocatedVUs: 10, // the size of the VU (i.e. worker) pool for this scenario
    tags: { test_type: 'api' }, // different extra metric tags for this scenario
    env: { MY_CROC_ID: '1' }, // and we can specify extra environment variables as well!
    exec: 'apitest', // this scenario is executing different code than the one above!
  },
  /* my_api_test_2: {
    executor: 'ramping-arrival-rate',
    startTime: '30s', // the ramping API test starts a little later
    startRate: 50,
    timeUnit: '1s', // we start at 50 iterations per second
    stages: [
      { target: 200, duration: '30s' }, // go from 50 to 200 iters/s in the first 30 seconds
      { target: 200, duration: '3m30s' }, // hold at 200 iters/s for 3.5 minutes
      { target: 0, duration: '30s' }, // ramp down back to 0 iters/s over the last 30 second
    ],
    preAllocatedVUs: 50, // how large the initial pool of VUs would be
    maxVUs: 100, // if the preAllocatedVUs are not enough, we can initialize more
    tags: { test_type: 'api' }, // different extra metric tags for this scenario
    env: { MY_CROC_ID: '2' }, // same function, different environment variables
    exec: 'apitest', // same function as the scenario above, but with different env vars
  }, */
};

export let options = {
  scenarios : {},
  thresholds: {
    // we can set different thresholds for the different scenarios because
    // of the extra metric tags we set!
    'http_req_duration{test_type:api}': ['p(95)<250', 'p(99)<350'],
    // 'http_req_duration{test_type:website}': ['p(99)<500'],
    // we can reference the scenario names as well
    // 'http_req_duration{scenario:my_api_test_2}': ['p(99)<300'],
  },
};


if (__ENV.scenario) {
  // Use just a single scenario if `--env scenario=whatever` is used
  options.scenarios[__ENV.scenario] = scenarios[__ENV.scenario];
} else {
  // Use all scenrios
  options.scenarios = scenarios;
}

export function apitest_jsonexp(){
  let res = http.get(`https://test-api.k6.io/public/crocodiles/`);
  check(res, { "status is 200": (res) => res.status === 200 });
  console.log("This is the json response",res.json()); 
  jsonObject = res.json();                                          
  const statusIds = Object.values(jsonObject).map(r => r.id)      //reading json response and getting specifically id values to be stored into variable. 
  console.log("These are all the ids",statusIds)
}

export function apitest() {
  let res = http.get(`https://test-api.k6.io/public/crocodiles/${__ENV.MY_CROC_ID}`);
  check(res, { "status is 200": (res) => res.status === 200 });
  console.log(res.json());
  // no need for sleep() here, the iteration pacing will be controlled by the
  // arrival-rate executors above!
}