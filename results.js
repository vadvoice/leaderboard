const http = require('http');
const redis = require('redis');
const pug = require('pug');
const config = require('./config');
const series = require('async/series');
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

    for (var i = 0; i < result.length; i++) {
      callFunctions.push(getDetailedInfo(redisClient, result[i]));
    }

    return series(callFunctions, (err, scores) => {
      if(err) {
        console.error({ err });
        res.status(400);
        return res.end('Error while execution results');
      }

      return res.end(scores);
    })
  })
});

server.listen(config.resultsServerPort);
