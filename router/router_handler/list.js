import { db } from '../../db/db.js'
import cloneGit from '../../public/cloneGit.js'
import buildCode from '../../public/buildCode.js'
import { ssh, sshConnect, sshUploadFile } from '../../public/sshUtils.js'

/**
 * 获取 可操作项目列表
 * @param req
 * @param res
 */
export const getListAPI = (req, res) => {
  db.query('SELECT * FROM sys_cicd WHERE del = 0', (err, result) => {
    if (err) return console.log(err.message)
    res.send({
      status: 200,
      message: result,
    })
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
      status: 99,
      message: '请携带正确的项目编号：id',
    })
    return
  }
  db.query('SELECT * FROM sys_cicd WHERE id = ?', req.query.id, (err, result) => {
    if (err) return console.log(err.message)
    if (result.length > 0) {
      cloneGit(result[0].name, result[0].branch, result[0].git).then(result => {
        res.send({
          status: 200,
          message: result,
        })
      }).catch(err => {
        res.send({
          status: 99,
          message: err
        })
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
      status: 99,
      message: '请携带正确的项目名称：name',
    })
  }
  if (!req.query.type) {
    res.send({
      status: 99,
      message: '请携带正确的项目类型：type',
    })
  }
  buildCode(req.query.name, req.query.type).then(buildRes => {
    res.send({
      status: 200,
      message: buildRes,
    })
  }).catch(buildErr => {
    res.send({
      status: 99,
      message: buildErr
    })
  })
}

export const deployFileAPI = (req, res) => {
  if (!req.query.id) {
    res.send({
      status: 99,
      message: '请携带正确的项目id',
    })
    return
  }
  db.query('SELECT * FROM sys_cicd WHERE id =?', req.query.id, async (err, result) => {
    if (err) return console.log(err.message)
    if (result.length > 0) {
      await sshConnect({
        host: result[0].host,
        port: result[0].port,
        username: result[0].username,
        password: result[0].password,
      })
      sshUploadFile(ssh, result[0]).then(sshRes => {
        console.log(sshRes)
        res.send({
          status: 200,
          message: sshRes,
        })
      }).catch(sshErr => {
        res.send({
          status: 99,
          message: sshErr,
        })
      })
    }
  })
  
}