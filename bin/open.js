#!/usr/bin/env node

const fs = require('fs');
const chalk = require('chalk');
const inquirer = require("inquirer");
const { exec } = require('child_process');
const {
  isConfigExit,
  isProject,
  isHasDistDic,
} = require('../utils/util');
const { DEVTOOL_CLI_PATH } =  require('../config/path.js');

const question = [
  {
    type: "list",
    name: "dic",
    message: "选择要创建的编译目录",
    choices: [],
  },
];

try {
  if (
    !isProject(process.cwd())
  ) throw new Error('请在项目根目录使用该命令');
  if (
    !isHasDistDic(process.cwd())
  ) throw new Error('当前项目 dist 目录不存在');
  // /dist 目录下文件夹列表
  const compileDicList = [];
  fs.readdirSync('./dist').forEach((item) => {
    if (!fs.statSync(`./dist/${item}`).isDirectory() === true) return;
    compileDicList.push(item);
  });
  if (!compileDicList.length) throw new Error('dist目录为空，请先打包');
  question[0].choices = compileDicList;

  inquirer.prompt(question).then(answer => {
    const { dic } = answer;
    if (
      !isConfigExit(dic)
    ) throw new Error('文件不存在');
    console.log(chalk.yellow('项目打开中'));
    const commandStr = `${DEVTOOL_CLI_PATH} open --project "${process.cwd()}/dist/${dic}"`;
    exec(commandStr, (error, stdout, stderr) => {
      if (error) {
        console.log(chalk.red('exec', error));;
        return;
      };
      console.log(chalk.yellow('命令已执行'));
      console.log(chalk.green(stderr));
    });
  }).catch(err => {
    console.log(chalk.red('inquirer', err));
  });
} catch (error) {
  console.log(chalk.red('open', error.message));
}