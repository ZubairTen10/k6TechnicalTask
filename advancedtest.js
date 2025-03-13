import http from 'k6/http';
import { check,sleep } from 'k6';

//Used this code as template to start my test for selecting crocodile data by id
// https://grafana.com/docs/k6/latest/using-k6/scenarios/advanced-examples/




let scenarios = {
  first_test: {
    executor: 'shared-iterations',
    vus: 1,
    exec: 'jsonexptest',
    iterations: 1,
  },
  dyn_api_test: {
    executor: 'shared-iterations',
    vus: 1,
    tags: { test_type: 'api' }, 
    exec: 'apitest', 
    iterations: 1,
  },
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
  // Use just a single scenario if `--env scenario=yourscenarioname` is used
  options.scenarios[__ENV.scenario] = scenarios[__ENV.scenario];
} else {
  options.scenarios = scenarios;
}

export function jsonexptest(){
  let res = http.get(`https://test-api.k6.io/public/crocodiles/`);
  check(res, { "status is 200": (res) => res.status === 200 });
  console.log("This is the json response",res.json()); 
  const jsonRes = res.json();                                          
  const statusIds = Object.values(jsonRes).map(j => j.id)      //reading json response and getting specifically id values to be stored into variable. 
  console.log("These are all the ids",statusIds)
}

export function apitest() {
  const randomElement = array[Math.floor(Math.random() * statusIds.length)];
  const randomId = statusIds[randomElement];
  let res = http.get(`https://test-api.k6.io/public/crocodiles/`+ randomId.toString());
  check(res, { "status is 200": (res) => res.status === 200 });
  console.log(res.json());
  // no need for sleep() here, the iteration pacing will be controlled by the
  // arrival-rate executors above!
}