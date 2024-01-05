import { spawn } from 'child_process'


export default class GitUtils {
  
  /**
   * 构造函数
   * @param cwd  工作目录
   */
  constructor(cwd) {
    this.cwd = cwd
  }
  
  /**
   * git add 暂存代码
   * @returns {*}
   */
  add() {
    let params = ['add', '.']
    return this.startChildProcess('git', params)
  }
  
  /**
   * git commit  提交代码
   * @param message
   * @returns {*}
   */
  commit(message = 'node js run git ： 默认消息') {
    let params = ['commit', '-m', message]
    return this.startChildProcess('git', params)
  }
  
  /**
   * git push  推送代码
   * @param branch
   * @returns {*}
   */
  push(branch) {
    if (!branch) {
      throw 'please input branch name !'
    }
    let params = ['push', 'origin', branch]
    return this.startChildProcess('git', params)
  }
  
  /**
   * git checkout  切换分支
   * @param branch
   * @returns {*}
   */
  checkout(branch) {
    if (!branch) {
      throw 'please input branch name!'
    }
    let params = ['checkout', branch]
    return this.startChildProcess('git', params)
  }
  
  /**
   * git pull   拉取代码
   * @param branch
   * @returns {*}
   */
  pull(branch  = 'master') {
    if (!branch) {
      throw 'please input branch name!'
    }
    let params = ['pull', 'origin', branch]
    return this.startChildProcess('git', params)
  }
  
  /**
   * git clone 克隆方法， 第二个参数是 分支， 默认克隆 master 分支
   * @param url
   * @param branch
   */
  clone(url, branch = 'master') {
    if (!url ||!branch) {
      throw 'please input url and branch name!'
    }
    let params = ['clone', '-b', branch, url]
    return this.startChildProcess('git', params)
  }
  
  /**
   * git status  是否存在修改
   * @returns {Promise<boolean>}
   */
  async status() {
    try {
      let params = [
        'status',
        '-s'
      ];
      let result = await this.startChildProcess('git', params);
      return !!result;
    } catch (err) {
      console.error(err);
    }
    
    return false;
  }
  
  /**
   * 开启 子进程
   * @param command
   * @param params
   * @returns {Promise<unknown>}
   */
  startChildProcess(command, params) {
    return new Promise((resolve, reject) => {
      let process = spawn(command, params, {
        cwd: this.cwd
      })
      let logMessage = `${command} ${params[0]}`;
      let cmdMessage = '';
      
      process.stdout.on('data', (data) => {
        console.log(`${logMessage} start ---`, data);
        if (!data) {
          reject(`${logMessage} error1 : ${data}`);
        } else {
          cmdMessage = data.toString();
        }
      })
      process.on('close', (data, e1, e2, e3) => {
        console.log(`${logMessage} close ---`, data);
        if (data) {
          reject(`${logMessage} error2 ! ${data}`);
        } else {
          console.log(`${logMessage} success !`);
          resolve(cmdMessage);
        }
      });
    })
  }
  
  /**
   * 自动上传
   * @param {String} remark 备注的信息
   * @param {String} branch 目标分支
   * */
  async autoUpload(remark, branch) {
    try {
      // git checkout branch
      await this.checkout(branch);
      
      // git pull branch
      await this.pull(branch);
      
      // git add .
      await this.add();
      
      // git status -s
      let isChange = await this.status();
      
      if (isChange) {
        // git commit -m remark
        await this.commit(remark);
        
        // git push branch
        await this.push(branch);
        
      } else {
        console.log('not have to upload');
      }
      
      console.log('auto upload success !');
      
      return true;
    } catch (err) {
      console.error(err);
    }
    
    console.log('auto upload error !');
    return false;
  }
}