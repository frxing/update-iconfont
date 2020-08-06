const fs = require('fs');
const url = require('url');
const path = require('path');
const axios = require('axios');

// let config = {
//   url: 'https://www.iconfont.cn/api/project/detail.json?pid=1819025&t=1596523610958&ctoken=fNxPgwQz5VzGvbRVwYoykzqn',
//   cookie: 'EGG_SESS_ICONFONT=U8AXvqwdm-42-umGXGwgKq_Emj2wuVCkA87TjZ3dn6xm2T4whio3sIKoy4kjkuBSusLMQ-0MhcjWBE1FwhfGmMbpO9xPCEANAHIhoET_7kJ_pbscGV6FmfCh8QTWcmCiTv5lhhXEW-AxLfe1otCy-b_Xu6bubgtR7jh7j4tyTxJ_XW7McfoOosNIBZqkfhF6OckVELaYsYoodJOOlKRp8eJY83tjjYVEurscncO4uYEk_mw1Sb4qLIh8DMdD1XG0lFN3X6trVyMIzJvczCR2A4nlTLnxai9pSRJ7-Gl53os6fci5p1tRMwBZUp0fsAZnGhtWgXCT4LrdSaagnXuBUChjSa6SnTBnAakCigP27vpZwfOTV5xDa3WzrQKvJ5-W1OxSCW8ugdgpwQA33VvFCIzY8zFyHP6Ai7GSuaeNb5IuVjBOWmTPJ6eQgVvcUllLHS0LBosQDoRzc1tUeFD-rLxtAfvxB3yUo-K7UOn8tNQW9AaVPlOqyysLGxZ_HickISiCyK_YzUs5i8qBQymtfNLAoIp9T3Ez9rpXgNtPD4owb4znYA-bya_7OQOWBmhhe9pbO6PifomOKXf-2RQc46gFwNGzhKfwWcS65Brb1mj2OPibCIM_O_83vHgryjp_DrO5o1E0aOeBjbwXDVHRgGjqzDWO_LYFPxC-lZt4wcBi534EtbTW-EkDTKm_dwLFzFJCVwklNCpvZHt6RVJLQdz0z0nbWspCEf64C5msyZea48AodqjdbG081uwtsR7TpZVTj1evX1tdhF-GxzBCa3I6hCfAukdWRLaX5KR6soZa207-R8jos4BXznDtgrwST64MeopPiddih6lFLQcB49Ly50dQdCm5QEs14ZN5UH3X_i0NdzdmEXxOl-cLA7mLFvQPeTcRQMq66dbh1Z3WER2o-kbF1x_UZYPjrDeKInLvyP4VediRBYdAr2ZVjCLHxzJAlxJZoRqKRMc9sBv6hFaZSzCRaEhS9DLEUnzrfnqAYy41j_zpQodNqTVvD9cep3FvP3pHS12yicTixXVm0HyEKALZYlmYdpLucub4XN9DWhpxEWGWbFFv9BjzusRUhvA3u4-DnDJP37IgFNts7Q==;',
//   output: {
//     path: path.resolve(__dirname, './aaa'),
//     fileName: 'iconfont.css'
//   }
// }

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
    let { config } = this
    if (!config.ur) {
      return new TypeError('url is be required')
    }
    if (!config.ur) {
      return new TypeError('cookie is be required')
    }
    axios.get(this.handleUrl(config.url), {
      headers: {
        Cookie: config.cookie
      }
    }).then(response => {
      let res = response.data;
      if (res.code === 200) {
        let data = res.data;
        let url = data.font.css_file;
        this.getFileContent(url);
        console.log('获取到css文件地址', url)
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