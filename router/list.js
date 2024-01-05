import express from 'express'
import * as userHandler from './router_handler/list.js'
// 创建路由对象
const router = express.Router()


router.get('/list', userHandler.getListAPI)

router.get('/gitClone', userHandler.cloneGitAPI)

router.get('/build', userHandler.buildCodeAPI)


// 部署项目
router.get('/deploy', userHandler.deployFileAPI)
//新增、编辑项目
// router.post('/save', userHandler.saveCodeAPI)
//删除项目
// router.post('/delete', userHandler.deleteCodeAPI)

export default router
