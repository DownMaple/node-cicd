import express from 'express'
import * as userHandler from './router_handler/generator.js'
import { getOneAPI } from './router_handler/list.js'
// 创建路由对象
const router = express.Router()

// 获取列表
router.get('/list', userHandler.getListAPI)
// 生成代码
router.get('/code', userHandler.getCodeAPI)

export default router
