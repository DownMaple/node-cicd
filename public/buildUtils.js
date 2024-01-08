import { spawn } from 'child_process'


export default class buildUtils {
  /**
   * 构造函数
   * @param cwd  工作目录
   */
  constructor(cwd) {
    this.cwd = cwd
  }
  
  // npm安装依赖
  npmInstall() {
    return this.startChildProcess(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['install'])
  }
  
  // 请在前端项目中 “package.json” 文件中， 定义 “empty-build” 脚本， 如：    "empty-build": "vite build",
  npmBuild() {
    return this.startChildProcess(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'empty-build'])
  }
  
  // maven 安装依赖， 等同 npm install
  mavenInstall() {
    return this.startChildProcess(process.platform === 'win32' ? 'mvn.cmd' : 'mvn', ['clean', 'install'])
  }
  
  // java 打jar包
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
      // 执行命令并返回一个进程对象
      const process = spawn(command, params, {
        // 设置工作目录为当前对象的cwd属性
        cwd: this.cwd,
      })
      // 初始化日志信息
      let logMessage = `${command} ${params[0]}`;
      let cmdMessage = '';
      // 监听进程对象的stdout事件，即标准输出
      process.stdout.on('data', (data) => {
        console.log(`${logMessage} start ---`);
        if (!data) {
          // 如果没有数据则 reject，并返回错误信息
          reject(`${logMessage} error1 : ${data}`);
        } else {
          // 将数据转换为字符串并赋值给 cmdMessage变量
          cmdMessage = data.toString();
        }
      })
      // 监听进程对象的close事件，即进程结束时
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