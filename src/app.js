const fs = require('fs');
const url = require('url');
const path = require('path');
const axios = require('axios');

class UpdateIconfont {
  constructor (options = {}) {
    this.config = Object.assign({
      url: '',
      cookie: '',
      output: {
        path: '../font',
        fileName: 'iconfont.css'
      }
    }, options)
    this.init()
  }

  init () {
    let { url, cookie } = this.config
    if (!url) {
      throw new TypeError('url is be required')
    }
    if (!cookie) {
      throw new TypeError('cookie is be required')
    }
    if (!(/^EGG_SESS_ICONFONT=/.test(cookie))) {
      cookie = `EGG_SESS_ICONFONT=${cookie}`
    }
    axios.get(this.handleUrl(url), {
      headers: {
        Cookie: cookie
      }
    }).then(response => {
      let res = response.data;
      if (res.code === 200) {
        let data = res.data;
        let cssUrl = data.font.css_file;
        this.getFileContent(cssUrl);
        console.log('获取到css文件地址', cssUrl)
      }
    })
  }

  // 处理url
  handleUrl (oUrl) {
    if (!oUrl) return
    let urlObj = url.parse(oUrl);
    let query = this.url2json(urlObj.search.substring(1));
    query.t = Date.now();
    let newUrl = `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}?${this.json2url(query)}`;
    return newUrl
  }

  // 获取文件内容
  getFileContent (url) {
    if (!url) return
    axios.get(`http:${url}`).then(res => {
      this.createFile(res.data);
    })
  }

  // 生成文件
  createFile (text) {
    if (!text) return
    let {output} = this.config
    this.mkdir(output.path);
    fs.writeFile(path.resolve(__dirname, `${output.path}/${output.fileName}`), text, (err) => {
      if (err) {
        console.log('写入失败', err);
      } else {
        console.log('写入文件成功')
      }
    })
  }

  // 创建目录
  mkdir (folderPath) {
    const pathArr = folderPath.split('/');
    let _path = '';
    for (let i = 0; i < pathArr.length; i++) {
      if (pathArr[i]) {
        _path += `/${pathArr[i]}`;
        console.log('_path', _path)
        if (!fs.existsSync(path.resolve(__dirname, _path))) {
          fs.mkdirSync(path.resolve(__dirname, _path));
        }
      }
    }
  }

  // 把search转换成json
  url2json (str) {
    let arr = str.split('&');
    let json = {};
    for(let i = 0; i < arr.length; i++){
      let arr2 = arr[i].split('=');
      json[arr2[0]] = arr2[1];
    }
    return json;
  }
  
  // 把json转换成search
  json2url (json ){
    let arr = [];
    for(let name in json){
      arr.push(name+'='+encodeURIComponent(json[name]));
    }
    return arr.join('&');
  }
}

module.exports = UpdateIconfont