export default [
  {
    name: '项目A-dev',
    ssh: {
      host: '192.168.0.110',
      port: 22,
      username: 'root',
      password: 'root',
      // privateKey: 'E:/id_rsa', // ssh私钥(不使用此方法时请勿填写， 注释即可)
      passphrase: '123456' // ssh私钥对应解密密码(不存在设为''即可)
    },
    targetDir: 'E:/private/my-vue-cli/dist', // 目标压缩目录(可使用相对地址)
    targetFile: 'dist.zip', // 目标文件
    openCompress: true, // 是否开启本地压缩
    openBackUp: true, // 是否开启远端备份
    deployDir: '/home/node_test' + '/', // 远端目录
    releaseDir: 'web' // 发布目录
  },
  {
    name: '项目A-prod',
    ssh: {
      host: '192.168.0.110',
      port: 22,
      username: 'root',
      password: 'root',
      privateKey: 'E:/id_rsa', // ssh私钥(不使用此方法时请勿填写， 注释即可)
      passphrase: '123456' // ssh私钥对应解密密码(不存在设为''即可)
    },
    targetDir: 'E:/private/my-vue-cli/dist', // 目标压缩目录(可使用相对地址)
    targetFile: 'dist.zip', // 目标文件
    openCompress: true, // 是否开启本地压缩
    openBackUp: true, // 是否开启远端备份
    deployDir: '/home/node_test' + '/', // 远端目录
    releaseDir: 'web2' // 发布目录
  }
]
