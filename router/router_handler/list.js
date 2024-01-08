import { db } from '../../db/db.js'
import cloneGit from '../../public/cloneGit.js'
import buildCode from '../../public/buildCode.js'
import { ssh, sshConnect, sshUploadFile } from '../../public/sshUtils.js'
import { updateBuildState, updateDeployState, updateState } from './syncDbUpdate.js'

/**
 * 获取 可操作项目列表
 * @param req
 * @param res
 */
export const getListAPI = (req, res) => {
  db.query('SELECT COUNT(*) AS total_rows FROM sys_cicd WHERE del = 0', (allErr, allResult) => {
    if (allErr) return console.log(allErr.message)
    let num = allResult[0].total_rows
    db.query('SELECT * FROM sys_cicd WHERE del = 0 ORDER BY create_time DESC LIMIT ? OFFSET ?',[Number(req.query.pageSize), Number((req.query.page - 1 ) * req.query.pageSize)], (err, result) => {
      if (err) return console.log(err.message)
      res.send({
        code: 200,
        data: {
          totalCount:num,
          list: result
        },
        message: "查询成功",
      })
    })
  })
}

/**
 * 查询某个项目信息
 * @param req
 * @param res
 */
export const getOneAPI = (req, res) => {
  if (!req.query.id) {
    res.send({
      code: 99,
      message: '请携带正确的项目编号：id',
    })
    return
  }
  db.query('SELECT * FROM sys_cicd WHERE id =?', req.query.id, (err, result) => {
    if (err) return console.log(err.message)
    if (result.length > 0) {
      res.send({
        code: 200,
        data: result[0],
        message: "查询成功",
      })
    }
  })
}

/**
 * 更新单个项目代码
 * @param req
 * @param res
 */
export const cloneGitAPI = (req, res) => {
  if (!req.query.id) {
    res.send({
      code: 99,
      message: '请携带正确的项目编号：id',
    })
    return
  }
  // 获取 项目的详细信息
  db.query('SELECT * FROM sys_cicd WHERE id = ?', req.query.id, (err, result) => {
    if (err) return console.log(err.message)
    if (result.length > 0) {
      // 调用cloneGit函数进行代码克隆，并传入相应参数 (项目名称，分支，git地址)
      cloneGit(result[0].name, result[0].branch, result[0].git).then(cloneRes => {
        res.send({
          code: 200,
          message: cloneRes,
        })
        updateState(result[0].id, 2 , '代码更新完成')
      }).catch(cloneErr => {
        res.send({
          code: 99,
          message: cloneErr
        })
        updateState(result[0].id, 1 ,  '代码更新失败')
      })
    }
  })
}

/**
 * 打包 某个项目
 * @param req
 * @param res
 */
export const buildCodeAPI = (req, res) => {
  if (!req.query.name) {
    res.send({
      code: 99,
      message: '请携带正确的项目名称：name',
    })
  }
  if (!req.query.type) {
    res.send({
      code: 99,
      message: '请携带正确的项目类型：type',
    })
  }
  updateBuildState(req.query.id, 3, '代码构建中')
  res.send({
    code: 200,
    message: "代码构建中...",
  })
  // 调用 代码构建 方法
  buildCode(req.query.name, req.query.type).then(buildRes => {
    updateBuildState(req.query.id, 4, '代码构建完成')
  }).catch(buildErr => {
    updateBuildState(req.query.id, 2, '代码构建失败')
  })
}

/**
 * 部署 项目
 * @param req
 * @param res
 */
export const deployFileAPI = (req, res) => {
  if (!req.query.id) {
    res.send({
      code: 99,
      message: '请携带正确的项目id',
    })
    return
  }
  // 读取数据库，获取项目详细信息
  db.query('SELECT * FROM sys_cicd WHERE id =?', req.query.id, async (err, result) => {
    if (err) return console.log(err.message)
    if (result.length > 0) {
      await sshConnect({
        host: result[0].host,
        port: result[0].port,
        username: result[0].username,
        password: result[0].password,
      })
      // 调用ssh 上传文件的方法， 上传代码
      sshUploadFile(ssh, result[0]).then(sshRes => {
        res.send({
          code: 200,
          message: sshRes,
        })
        // 上传成功更改 表中项目的状态
        updateDeployState(req.query.id, 6, '代码部署完成' , Number(result[0].num) + 1)
      }).catch(sshErr => {
        res.send({
          code: 99,
          message: sshErr,
        })
        updateDeployState(req.query.id, 4, '代码部署失败' , Number(result[0].num))
      })
    }
  })
  
}