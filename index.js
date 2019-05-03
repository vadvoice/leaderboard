const net = require('net');
const config = require('./config');
const redis = require('redis');
const httpZ = require('http-z');

// Crate connection to Redis and select db partition
const redisClient = redis.createClient();
redisClient.select(2);

const server = net.createServer(socket => {
  socket.setDefaultEncoding('utf8')
  console.log(`---------Receive event from: ${socket.remoteAddress}`);

  redisClient.on('error', function(err) {
    console.log('Error ' + err);
  });

  socket.on('data', data => {
    const rawStr = data.toString();
    const httpMessage = rawStr.replace(/\r/gi, '');
    let httpModel;
    try {
      httpModel = httpZ.parse({ httpMessage });
    } catch(e) {
      console.log({ e });
      socket.write(e);
      return socket.end(e);
    }

    const { body } = httpModel;
    if(body) {
      const { formDataParams, json } = body;
      const layerObj = formDataParams || json;

      // add or overwrite score
      redisClient.hset(layerObj.member, "first_name", layerObj.first_name, redis.print);
      redisClient.hset(layerObj.member, "last_name", layerObj.last_name, redis.print);
      redisClient.hset(layerObj.member, "score", layerObj.score, redis.print);
      redisClient.hset(layerObj.member, "date", layerObj.date, redis.print);
      // add to scores for Zowie!
      redisClient.zadd('Zowie!', parseInt(layerObj.score), layerObj.member);
      socket.write('---------Records are added!');
    }
    socket.end();
  });

  socket.on('close', socket => {
    console.log(`---------Socket closed`);
  });

  socket.on('error', err => {
    console.error(err);
  });

});

server.on('connection', event => {
  console.log(`---------User address: ${event.remoteAddress} is connected!`);
})

server.on('error', (err) => {
  console.error({ err });
  throw err;
});

// listening of port
server.listen(config.TCPServerPort, config.TCPHostAddress);

console.info(`Watcher listening on port: ${config.TCPServerPort}`);
