// Import the http module to make HTTP requests. From this point, you can use `http` methods to make HTTP requests.
import http from 'k6/http';

// Import the sleep function to introduce delays. From this point, you can use the `sleep` function to introduce delays in your test script.
import { check, sleep } from 'k6';


export const options = {
  vus: 1,
};

export default function() {
  let res = http.get('https://test-api.k6.io/public/crocodiles/');
  check(res, { "status is 200": (res) => res.status === 200 });
  sleep(1);
}
