import http from 'k6/http';
import { check,sleep } from 'k6';

let scenarios = {
  first_test: {
    executor: 'shared-iterations',
    vus: 1,
    exec: 'getCrocodilesAndCrocodileByIdTest',
    iterations: 1,
  },
};

export let options = {
  scenarios : {},
};


if (__ENV.scenario) {
  // Use just a single scenario if `--env scenario=yourscenarioname` is used
  options.scenarios[__ENV.scenario] = scenarios[__ENV.scenario];
} else {
  options.scenarios = scenarios;
}

   
export function getCrocodilesAndCrocodileByIdTest(){
  let res1 = http.get(`https://test-api.k6.io/public/crocodiles/`);
  check(res1, { "status is 200": (res1) => res1.status === 200 });
  console.log("This is the json response",res1.json());                                           
  const crocIds = Object.values(res1.json()).map(j => j.id)      //reading json response and getting specifically id values to be stored into variable. 
  console.log("These are all the ids",crocIds)
  const randomId = crocIds[Math.floor(Math.random() * crocIds.length)];
  console.log("The randomly chosen id is:",randomId);
  let res2 = http.get(`https://test-api.k6.io/public/crocodiles/${randomId.toString()}`);
  check(res2, { "status is 200": (res2) => res2.status === 200 });
  console.log(res2.json());
}