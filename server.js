const http = require('http');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config({path:"./config.env"})

const headers = require('./headers.js');
const handleSuccess = require('./handleSuccess.js');
const handleError = require('./handleError.js');

const Post = require('./models/post')

// const DB = process.env.DATABASE.replace(
//   '<password>',
//   process.env.DATABASE_PASSWORD
// )
const DB = "mongodb://localhost:27017/testPosts"

mongoose
.connect(DB)
.then(() => console.log('資料庫連接成功'));

const requestListener = async(req, res)=>{
  let body = "";
  req.on('data', chunk=>{
      body+=chunk;
  })
  
  if(req.url=="/posts" && req.method == "GET"){
    const post = await Post.find();
    handleSuccess(res, "文章獲取成功", post)

  }else if(req.url=="/posts" && req.method == "POST"){
    req.on('end',async()=>{
      try{
        const data = JSON.parse(body);
        if(data.content !== undefined){
          const newPost = await Post.create(
            {
                name: data.name,
                content: data.content,
            }
          );
          handleSuccess(res, "文章發布成功", newPost)
            
        }else{
          handleError(res,"欄位未填寫正確，或無此 ID")
        }
      }catch(error){
        handleError(res,error)
      }
    })
  }else if(req.url.startsWith("/posts/") && req.method=="DELETE"){
    const id = req.url.split('/').pop();
    try{
      await Post.findByIdAndDelete(id);
      handleSuccess(res, "文章刪除成功", null)
    }
    catch(error){
      handleError(res, "文章刪除失敗", null)
    }
  }else if(req.method == "OPTIONS"){
    res.writeHead(200,headers);
    res.end();
  }else{
    handleError(res,"無此網站路由")
  }
}
const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005);