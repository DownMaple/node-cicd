import { spawn } from 'child_process'


export default class buildUtils {
  /**
   * 构造函数
   * @param cwd  工作目录
   */
  constructor(cwd) {
    this.cwd = cwd
  }
  
  npmInstall() {
    return this.startChildProcess(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['install'])
  }
  
  npmBuild() {
    return this.startChildProcess(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'empty-build'])
  }
  
  mavenInstall() {
    return this.startChildProcess(process.platform === 'win32' ? 'mvn.cmd' : 'mvn', ['clean', 'install'])
  }
  
  mavenPackage() {
    return this.startChildProcess(process.platform === 'win32' ? 'mvn.cmd' : 'mvn', ['clean', 'package'])
  }
  
  /**
   * 开启 子进程
   * @param command
   * @param params
   * @returns {Promise<unknown>}
   */
  startChildProcess(command, params) {
    return new Promise((resolve, reject) => {
      const process = spawn(command, params, {
        cwd: this.cwd,
      })
      let logMessage = `${command} ${params[0]}`;
      let cmdMessage = '';
      
      process.stdout.on('data', (data) => {
        console.log(`${logMessage} start ---`);
        if (!data) {
          reject(`${logMessage} error1 : ${data}`);
        } else {
          cmdMessage = data.toString();
        }
      })
      process.on('close', (data, e1, e2, e3) => {
        console.log(`${logMessage} close ---`);
        if (data) {
          reject(`${logMessage} error2 ! ${data}`);
        } else {
          console.log(`${logMessage} success !`);
          resolve(cmdMessage);
        }
      });
    })
  }
}