const headers = require('./headers.js');
function handleSuccess(res, message="成功", data){
  res.writeHead(200,headers);
  res.write(JSON.stringify({
    "status": "true",
    "message": message,
    "data": data
  }));
  res.end();
}

module.exports = handleSuccess