import express from 'express'
import * as userHandler from './router_handler/list.js'
import { getOneAPI } from './router_handler/list.js'
// 创建路由对象
const router = express.Router()

// 获取列表
router.get('/list', userHandler.getListAPI)
// 获取详细信息
router.get('/getOne', userHandler.getOneAPI)
// 克隆、更新项目
router.get('/gitClone', userHandler.cloneGitAPI)
// 构建项目
router.get('/build', userHandler.buildCodeAPI)


// 部署项目
router.get('/deploy', userHandler.deployFileAPI)
//新增、编辑项目
// router.post('/save', userHandler.saveCodeAPI)
//删除项目
// router.post('/delete', userHandler.deleteCodeAPI)

export default router
