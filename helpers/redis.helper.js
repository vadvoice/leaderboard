function getDetailedInfo(redisClient, member) {
  return callback => {
    return redisClient.hgetall(member, (err, obj) => callback(err, obj));
  };
}

module.exports = {
  getDetailedInfo,
}