#!/usr/bin/env node

const fs = require('fs');
const chalk = require('chalk');
const inquirer = require("inquirer");
const { exec } = require('child_process');
const path =  require('../config/path.js');
const { DEVTOOL_CLI_PATH } = path;

try {
  const isProject = fs.existsSync(`${process.cwd()}/package.json`);
  if (!isProject) throw new Error('请在项目根目录使用该命令');
  const isHasDistDic = fs.existsSync(`${process.cwd()}/dist/`);
  if (!isHasDistDic) throw new Error('当前项目 dist 目录不存在');
  const compileDicList = [];
  const files = fs.readdirSync('./dist');
  files.forEach((item) => {
    const stat = fs.statSync(`./dist/${item}`);
    if (stat.isDirectory() === true) {
      compileDicList.push(item);
    }
  });
  if (!compileDicList.length) throw new Error('dist目录为空，请先打包');

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const isConfigExit = (dic, fileName = 'project.config.json') => {
    try {
      fs.statSync(`./dist/${dic}/${fileName}`);
      return true;
    } catch (error) {
      return false;
    }
  };

  const question = [
    {
      type: "list",
      name: "dic",
      message: "选择要创建的编译目录",
      choices: compileDicList,
    },
  ];

  inquirer.prompt(question).then(answer => {
    const { dic } = answer;
    const isExit = isConfigExit(dic);
    if (!isExit) throw new Error('文件不存在');
    console.log(chalk.yellow('项目打开中'));
    exec(`${DEVTOOL_CLI_PATH} open --project "${process.cwd()}/dist/${dic}"`, (err) => {
      if (err) return;
      console.log(chalk.yellow('命令已执行'), `${DEVTOOL_CLI_PATH} open --project "${process.cwd()}/dist/${dic}"`);
      console.log(chalk.green('执行结束'));
    });
  }).catch(err => {
    console.log('err', err);
  });
} catch (error) {
  console.log(chalk.red(error.message));
}