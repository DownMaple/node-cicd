import { db } from '../../db/db.js'
import sqlDeal from '../../public/sqlDeal.js'

/**
 * 获取 可操作项目列表
 * @param req
 * @param res
 */
export const getListAPI = (req, res) => {
  db.query('SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ?', req.query.sql, (allErr, allResult) => {
    if (allErr) return console.log(allErr.message)
    if (allResult.length === 0) {
      res.send({
        code: 500,
        message: '数据库查询失败，请检查是否存在该数据库',
      })
    } else {
      res.send({
        code: 200,
        data: {
          totalCount: allResult.length,
          list: allResult
        },
        message: '查询成功',
      })
    }
 
  })
  
}

/**
 * 生成代码
 * @param req
 * @param res
 */
export const getCodeAPI = (req, res) => {
  // 连接数据库
  if (req.query.surface) {
    // 数据库查询
    db.query(`select COLUMN_NAME,DATA_TYPE,COLUMN_COMMENT from information_schema.columns where TABLE_NAME='${req.query.surface}' AND TABLE_SCHEMA = '${req.query.sql}'`, (err, data) => {
      if (err) {
        console.log(err)
      } else {
        sqlDeal(data, req.query.surface).then(sqlRes => {
          res.send({
            code: 200,
            message: '创建成功',
          })
        }).catch(err => {
          res.send({
            code: 500,
            message:err,
          })
        })
      }
    })
  } else {
    // 数据库插入
    res.send('请通过get请求携带 surface 键名作为 菜单表名请求')
  }
}
