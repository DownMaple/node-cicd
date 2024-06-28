import express from 'express'
// 创建服务器实例
const app = express()
import joi from 'joi'
import cors from 'cors'

import fs from 'fs'

const path = './project';
// 检查是否存在project文件夹
const exists = fs.existsSync(path);
if (!exists) {
  // 如果不存在则创建一个
  fs.mkdirSync(path);
}

// 解决跨域问题
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))

/**
 * 中间件
 * */
// 响应数据的中间件
app.use((req, res, next) => {
  res.cc = (err,status = 1) =>{
    res.send({
      code: status,
      // 状态描述，判断 err 是 错误对象还是 字符串
      message:err instanceof Error ? err.message : err
    })
  }
  next()
})
// 托管静态资源文件
// app.use('/uploads', express.static('./uploads'))


/**
 * 路由
 * */
// 导入路由模块
import listRouter from './router/list.js'
app.use('/cicd',listRouter)
import generator from './router/generator.js'
app.use('/generator', generator )
app.use((req, res, next) => {
  res.send({
    code: 200,
    message: '成功',
    data: {},
  })
})
/**
 * 错误级别中间件
 * */
app.use((err, req, res, next) => {
  if (err.status === 401) return res.cc('token验证失败')
  if (err instanceof joi.ValidationError) return res.cc(err)
  console.log(err); // 获取未知错误
  res.cc('未知的错误')
})

// 调用方法，指定端口号并启动服务器
app.listen(3012,function (){
  console.log('api server running at http://localhost:3012')
})
