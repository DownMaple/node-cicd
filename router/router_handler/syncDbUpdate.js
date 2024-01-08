import { db } from '../../db/db.js'
import { getNowDate } from '../../public/getNowDate.js'

/**
 * 修改 git 操作 所对应的表的状态修改
 * @param id
 * @param state
 * @param state_str
 */
export const updateState = (id, state, state_str) => {
  db.query('update sys_cicd set state =?, state_str =? ,git_time = ? where id =?', [state, state_str ,getNowDate(),id], (err, result) => {
    if (err) return console.log(err.message)
  })
}

/**
 * 修改构建操作所对应的表的状态修改
 * @param id
 * @param state
 * @param state_str
 */
export const updateBuildState = (id, state, state_str) => {
  db.query('update sys_cicd set state =?, state_str =?,build_time =? where id =?', [state, state_str,getNowDate(),id], (err, result) => {
    if (err) return console.log(err.message)
  })
}

/**
 * 修改 部署操作，所对应的表的状态修改
 * @param id
 * @param state
 * @param state_str
 * @param num
 */
export const updateDeployState = (id, state, state_str , num) => {
  db.query('update sys_cicd set state =?, state_str =?,deploy_time =? , num = ? where id =?', [state, state_str,getNowDate(),num,id], (err, result) => {
    if (err) return console.log(err.message)
  })
}