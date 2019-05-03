const http = require('http');
const redis = require('redis');
const pug = require('pug');
const config = require('./config');
const series = require('async/series');
const resultsTemplate = pug.compileFile('./templates/results.pug');
const { getDetailedInfo } = require('./helpers/redis.helper');

const redisClient = redis.createClient();

// select db instance
redisClient.select(2);

const server = http.createServer((req, res) => {
  redisClient.zrange('Zowie!',0,3, function(err, result) {
    if(err) {
      console.error({ err });
      res.status(400);
      res.write('Error while getting result. Please try again later');
      return res.end();
    }
    let callFunctions = new Array();

    // queue for processing results by hash key
    result.forEach((el, idx) => callFunctions.push(getDetailedInfo(redisClient, result[idx])));

    return series(callFunctions, (err, scores) => {
      if(err) {
        console.error({ err });
        res.status(400);
        return res.end('Error while execution results');
      }

      // set data to template
      const responseTemplate = resultsTemplate({ name: 'test', scores });

      return res.end(responseTemplate);
    })
  })
});

server.listen(config.resultsServerPort);

console.info(`Results available on port: ${config.resultsServerPort}`);
