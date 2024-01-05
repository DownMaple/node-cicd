
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from "node:url"
import GitUtils from './gitUtils.js'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const folderPath = path.resolve(__dirname, '../project')

/**
 * 克隆或更新代码
 * @param title  项目名称
 * @param branch  git 分支
 * @param url     git 地址
 * @returns {Promise<unknown>}
 */
export default function (title,branch,url) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(folderPath + '/' + title)) {
      // 因为 git 克隆会创建 对应名称文件夹， 所以这里直接克隆就可以了
      // fs.mkdirSync(folderPath + '/' + title);
      const git = new GitUtils(folderPath)
      git.clone(url,branch).then(() => {
        resolve("克隆完成:" + title)
      }).catch((err) => {
        console.log(err)
        reject("克隆失败:" + err.toString())
      })
    } else {
      const git = new GitUtils(folderPath + '/' + title)
      git.pull(branch).then(() => {
        resolve("已拉取：" + title)
      }).catch((err) => {
        console.log(err)
        reject("拉取代码失败：" + err.toString())
      })
    }
  })
}