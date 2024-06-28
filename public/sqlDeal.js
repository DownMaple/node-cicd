import createVueFile from './createVueFIle.js'

export default function sqlDeal(sqlData, name) {
  return new Promise((resolve, reject) => {
    if(typeof sqlData !== 'object') {
      reject(`${name}表中暂无解构信息`)
    } else {
      createVueFile(sqlData, name).then(res => {
        resolve('创建vue文件成功')
      }).catch(err => {
        reject(err)
      })
    }
  })
}