# update-iconfont

此项目适用于阿里的iconfont，并且只更新iconfont.css文件到本地

### 使用说明

1. npm install update-ali-iconfont -S
2. 在本地目录新建build(可自定义)目录，在build目录下新建updateIconfont.js, js内容如下
   
   ```
   const UpDateIconfont = require('update-ali-iconfont')
   new UpDateIconfont({
      url: '*****',
      cookie: '****',
      output: {
          path: '**/**',    // 输出文件的目录
          filenName: 'iconfont.css' // 输出文件名字   默认是iconfont.css
      }    
   })
   ```
3. 在package.json里面的script下新增脚本命令
   
   ```
   "script": {
       ...,    //其它脚本命令
       "update:iconfont": node build/updateIconfont.js
       
   }
   ```
4. 在终端命令行执行    npm run update:iconfont     就可以将iconfont的css文件更新到本地了

### 配置说明

###### url 是代表项目的接口地址，找项目所在人员的账号登录，进入项目所请求的接口地址，地址必须完整，如图中的完整地址

![](https://github.com/frxing/update-iconfont/blob/master/pic/url.png)

###### cookie是当前用户的cookie， 如果不填写，阿里会认为没有登录

![](https://github.com/frxing/update-iconfont/blob/master/pic/cookie.png)

###### output.path  生成文件所在的目录，绝对路径

###### output.filename   生成文件的名字，必须是css文件
