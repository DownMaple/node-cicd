import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from "node:url"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const folderPath = path.resolve(__dirname, '../project')
import buildUtils from './buildUtils.js'

/**
 * 构建代码  请在代码构建前，对当前项目运行环境 是否存在 node、npm、maven 等做检查
 * @param name
 * @param type
 * @returns {Promise<unknown>}
 */
export default function (name,type) {
  return new Promise((resolve, reject) => {
    // 判断项目目录是否存在
    if (!fs.existsSync(folderPath + '/' + name)) {
      reject('项目不存在')
    } else {
      const codeBuildCmd = new buildUtils(folderPath + '/' + name)
      // 前端项目 npm 构建
      if(type.toString() === '0') {
        codeBuildCmd.npmInstall().then(() => {
          // console.log('项目：' + name +'初始化成功')
          codeBuildCmd.npmBuild().then(() => {
            resolve('项目：' + name +',构建成功')
          }).catch((err) => {
            reject(`项目：${name}，构建失败，错误信息：${err.toString()}`)
          })
        }).catch(initErr => {
          reject(`项目：${name}，构建失败，错误信息：${initErr.toString()}`)
        })
      } else if(type.toString() === '1') {    // java项目 maven 构建
        codeBuildCmd.mavenInstall().then(() => {
          // console.log('项目：' + name +'初始化成功')
          codeBuildCmd.mavenPackage().then(() => {
            resolve('项目：' + name +',构建成功')
          }).catch((err) => {
            reject(`项目：${name}，构建失败，错误信息：${err.toString()}`)
          })
        }).catch(initErr => {
          reject(`项目：${name}，构建失败，错误信息：${initErr.toString()}`)
        })
      }
    }
  })
}