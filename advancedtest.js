import http from 'k6/http';
import { check,sleep } from 'k6';

let scenarios = {
  first_test: {
    executor: 'shared-iterations',
    vus: 1,
    exec: 'getCrocodilesTest',
    iterations: 1,
  },
  second_test: {
    executor: 'shared-iterations',
    vus: 1,
    tags: { test_type: 'api' }, 
    exec: 'getCrocodileByIdTest', 
    iterations: 1,
  },
};

export let options = {
  scenarios : {},
  thresholds: {
  },
};


if (__ENV.scenario) {
  // Use just a single scenario if `--env scenario=yourscenarioname` is used
  options.scenarios[__ENV.scenario] = scenarios[__ENV.scenario];
} else {
  options.scenarios = scenarios;
}

   
export function getCrocodilesTest(){
  let res = http.get(`https://test-api.k6.io/public/crocodiles/`);
  check(res, { "status is 200": (res) => res.status === 200 });
  console.log("This is the json response",res.json()); 
  const jsonRes = res.json();                                          
  const crocIds = Object.values(jsonRes).map(j => j.id)      //reading json response and getting specifically id values to be stored into variable. 
  console.log("These are all the ids",crocIds)
}

export function getCrocodileByIdTest() {
  const jsonRes = (http.get(`https://test-api.k6.io/public/crocodiles/`)).json()
  const crocIds = Object.values(jsonRes).map(j => j.id)
  const randomId = crocIds[Math.floor(Math.random() * crocIds.length)];
  console.log("The randomly chosen id is:",randomId);
  let res = http.get(`https://test-api.k6.io/public/crocodiles/${randomId.toString()}`);
  check(res, { "status is 200": (res) => res.status === 200 });
  console.log(res.json());
}