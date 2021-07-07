/*
 * @Author: Tao Yang | Email:tao.yang@verystar.cn
 * @Date: 2021-07-07 16:23:16
 * @LastEditors: Tao Yang | Email:tao.yang@verystar.cn
 * @LastEditTime: 2021-07-07 16:33:14
 * @Description: 
 */

const fs = require('fs');
const { FILE_MUST_OWN_IN_PROJECT } = require('../config/content.js');

// 微信开发者工具打开的项目需要的必要配置文件
function isConfigExit(dic, fileName = FILE_MUST_OWN_IN_PROJECT) {
  try {
    fs.statSync(`./dist/${dic}/${fileName}`);
    return true;
  } catch (error) {
    return false;
  }
};

// 是否是一个脚手架项目
function isProject(cwd) {
  return fs.existsSync(`${cwd}/package.json`);
}

// 是否有编译目录
function isHasDistDic(cwd) {
  return fs.existsSync(`${cwd}/dist/`);
}

module.exports = {
  isConfigExit,
  isProject,
  isHasDistDic,
}