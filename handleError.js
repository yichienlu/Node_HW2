const headers = require('./headers.js');
function handleError(res, message="發生錯誤"){
  res.writeHead(400,headers);
  res.write(JSON.stringify({
    "status": "false",
    "message": message
  }));
  res.end();
}

module.exports = handleError