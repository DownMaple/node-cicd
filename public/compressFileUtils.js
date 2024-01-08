import fs from 'node:fs'
import Archiver from 'archiver'
import path from 'node:path'
import { fileURLToPath } from "node:url"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const folderPath = path.resolve(__dirname, '../project')

/**
 * 压缩文件，暂时没使用
 * @param name
 * @returns {Promise<unknown>}
 */
export function compressVueFile(name) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(folderPath + '/' + name + '/dist')) {
      reject('可部署文件不存在')
    } else {
      console.log("开始压缩文件")
      const archive = new Archiver('zip', { zlib: { level: 9 } })
      const output = fs.createWriteStream(folderPath + '/' + name + '/dist.zip')
      
      archive.pipe(output)
      archive.directory(folderPath + '/' + name + '/dist', 'new-dist')
      // 完成文件追加 确保写入流完成
      archive.finalize().then(res => {
        resolve({
          status:200,
          message:"压缩完成: " +  + (archive.pointer() / 1024 /1024).toFixed(3) + 'MB'
        })
      }).catch(err => {
        reject('压缩失败：' + err.toString())
      })
    }
  })
}
