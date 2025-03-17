import http from 'k6/http';
import { check,sleep } from 'k6';
import { Trend } from 'k6/metrics'


const getCrocodilesResponseTime = new Trend('getCrocodiles_response_time', true);
const getCrocodilesByIdResponseTime = new Trend('getCrocodilesById_response_time', true);

let scenarios = {
  simple_smoke_test : {
    executor: 'shared-iterations',     //fixed total number of iteration divided among VUs
    vus: 2,           
    exec: 'getCrocodilesAndCrocodileByIdSmokeTest',
    iterations: 4,          // 4/2=2, 2 iterations of the test function per VU.
    maxDuration: '5s',
  },
  load_test: {
    executor: 'constant-vus',
    vus: 10,
    duration: '30s',
    exec: 'getCrocodilesAndCrocodileByIdTest'
  },
  heavy_load_test: {
    executor: 'constant-vus',
    vus: 40,
    duration: '1m',
    exec: 'getCrocodilesAndCrocodileByIdTest'
  },
  heavy_load_test_short: {
    executor: 'constant-vus',
    vus: 70,
    duration: '30s',
    exec: 'getCrocodilesAndCrocodileByIdTest'
  },
  constant_request_rate: {
    executor: 'constant-arrival-rate',
    rate: 1000,
    timeUnit: '1s', // 1000 iterations per second, i.e. 1000 RPS
    duration: '30s',
    preAllocatedVUs: 100, // how large the initial pool of VUs would be
    maxVUs: 400, // if the preAllocatedVUs are not enough, we can initialize more
    exec: 'getCrocodilesAndCrocodileByIdTest'
  },
  ramping_request_rate:{
    executor: 'ramping-arrival-rate',
    startRate: 10,
    timeunit: '1s',
    preAllocatedVUs: 50,
    maxVUs: 500,
    stages: [
      {duration: '30s', target: 100}, // Start 10 iterations per `timeUnit`, ramp up to 100 rps in 30s.
      {duration: '30s', target: 500}, //Continue starting 500 iterations per `timeUnit` for the following minute.
      {duration: '30s', target: 10}, // Linearly ramp-down to 0 iterations per `timeUnit` over the last 30 seconds.
    ],
    exec: 'getCrocodilesAndCrocodileByIdTest' ,
  },
  ramping_request_rate_cloud:{
    executor: 'ramping-arrival-rate',
    startRate: 10,
    timeunit: '1s',
    preAllocatedVUs: 50,
    maxVUs: 100,
    stages: [
      {duration: '30s', target: 50}, // Start 10 iterations per `timeUnit`, ramp up to 50 rps in 30s.
      {duration: '1m', target: 100}, //Continue starting 500 iterations per `timeUnit` for the following minute.
      {duration: '30s', target: 30}, // Linearly ramp-down to 30 iterations per `timeUnit` over the last 30 seconds.
    ],
    exec: 'getCrocodilesAndCrocodileByIdTest' ,
  }
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

export function getCrocodilesAndCrocodileByIdSmokeTest (){
  let res1 = http.get(`https://test-api.k6.io/public/crocodiles/`);
  check(res1, { "status is 200": (res1) => res1.status === 200 });

  sleep(1);

  console.log("This is the json response",res1.json());      
  const crocIds = Object.values(res1.json()).map(j => j.id)      //reading json response and getting specifically id values to be stored into variable. 
  console.log("These are all the ids",crocIds)
  const randomId = crocIds[Math.floor(Math.random() * crocIds.length)];
  console.log("The randomly chosen id is:",randomId);
  
  let res2 = http.get(`https://test-api.k6.io/public/crocodiles/${randomId.toString()}`);
  check(res2, { "status is 200": (res2) => res2.status === 200 });

  sleep(1);

  console.log('Data of the random crocodile:',res2.json());
  
  getCrocodilesResponseTime.add(res1.timings.duration)
  getCrocodilesByIdResponseTime.add(res2.timings.duration)
  
}
   
export function getCrocodilesAndCrocodileByIdTest(){
  let res1 = http.get(`https://test-api.k6.io/public/crocodiles/`);
  check(res1, { "status is 200": (res1) => res1.status === 200 });
  const crocIds = Object.values(res1.json()).map(j => j.id)      //reading json response and getting specifically id values to be stored into variable. 
  
  const randomId = crocIds[Math.floor(Math.random() * crocIds.length)];
  
  let res2 = http.get(`https://test-api.k6.io/public/crocodiles/${randomId.toString()}`);
  check(res2, { "status is 200": (res2) => res2.status === 200 });

  check(res1, {'Response time for 1st get req is below 500ms': (res1) => res1.timings.duration < 500});
  
  check(res2, {'Response time for 2nd get req is below 600ms': (res2) => res2.timings.duration < 600});
 
  getCrocodilesResponseTime.add(res1.timings.duration)
  getCrocodilesByIdResponseTime.add(res2.timings.duration)

  check(res1, { "res1 status is 500": (res1) => res1.status === 500 });
  check(res2, { "res2 status is 500": (res2) => res2.status === 500 });
  
}