const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
  url: 'redis://redis:6379',
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});

(async () => {
  await redisClient.connect();
})();

const sub = redisClient.duplicate();

(async () => {
  await sub.connect();
})();

function fib(index) {
  if (index < 2) return 1;

  return fib(index - 1) + fib(index - 2);
}

sub.subscribe('insert', async (message) => {
  await redisClient.hSet('values', message, fib(parseInt(message)));
}, true);
