import { NodeSSH } from 'node-ssh'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const folderPath = path.resolve(__dirname, '../project')
export const ssh = new NodeSSH()

export function sshConnect(config) {
  return new Promise((resolve, reject) => {
    ssh.connect({ ...config }).then(() => {
      resolve(config.host + ' 连接成功')
    }).catch(err => {
      reject(err)
    })
  })
}

export function runCommand(ssh, command, path) {
  return new Promise((resolve, reject) => {
    ssh.execCommand(command, {
      cwd: path
    }).then((res) => {
      if (res.stderr) {
        reject('命令执行发生错误:' + res.stderr)
        process.exit()
      } else {
        resolve(command + ' 执行完成！')
      }
    })
  })
}

export function sshUploadFile(ssh, data) {
  return new Promise( async (resolve, reject) => {
    console.log('开始文件上传')
    // 暂时不做 项目备份处理
    // handleSourceFile(ssh, config)
    // 0 上传前端文件
    let localFile = ''
    if (data.type.toString() === '0') {
      localFile = folderPath + '\\' + data.name + '\\' + 'dist'
      const stdoutRes = await ssh.execCommand('if [ -d "$HOME/' + data.deploy + '" ]; then echo "true"; else echo "false"; fi');
      if(!stdoutRes.stdout) {
        await ssh.execCommand(`mkdir -p $HOME/${data.deploy}`);
      }
      const  putRes = await ssh.putDirectory(localFile, data.deploy)
      if(putRes) {
        resolve('文件上传完成')
      } else {
        reject('上传失败:' + putRes.toString())
      }
      await ssh.dispose();
    } else if (data.type.toString() === '1') {
      localFile = folderPath + '\\' + data.name + '\\' + 'target' + '\\' + data.name + '.jar'
      await ssh.execCommand(`mkdir -p $HOME/${data.deploy};cd $HOME/${data.deploy};touch ${data.name}.jar`);
      ssh.putFile(localFile, `${data.deploy}/${data.name}.jar`).then(() => {
        resolve('文件上传完成')
        ssh.dispose();
      }).catch(err => {
        console.log(err)
        reject('上传失败:' + err.toString())
        ssh.dispose();
      })
    }
  })
}


// 处理源文件(ssh对象、配置信息)
async function handleSourceFile(ssh, config) {
  if (config.openBackUp) {
    console.log('已开启远端备份!')
    await runCommand(
      ssh,
      `
      if [ -d ${config.releaseDir} ];
      then mv ${config.releaseDir} ${config.releaseDir}_${getCurrentTime()}
      fi
      `,
      config.deployDir)
  } else {
    console.log('提醒：未开启远端备份!')
    await runCommand(
      ssh,
      `
      if [ -d ${config.releaseDir} ];
      then mv ${config.releaseDir} /tmp/${config.releaseDir}_${getCurrentTime()}
      fi
      `,
      config.deployDir)
  }
}


