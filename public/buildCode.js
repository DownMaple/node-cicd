import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from "node:url"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const folderPath = path.resolve(__dirname, '../project')
import buildUtils from './buildUtils.js'

export default function (name,type) {
  return new Promise((resolve, reject) => {
    console.log(folderPath + '/' + name)
    console.log(fs.existsSync(folderPath + '/' + name))
    if (!fs.existsSync(folderPath + '/' + name)) {
      reject('项目不存在')
    } else {
      const codeBuildCmd = new buildUtils(folderPath + '/' + name)
      if(type.toString() === '0') {   // 前端项目 npm 构建
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