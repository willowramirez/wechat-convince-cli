#!/usr/bin/env node

const fs = require('fs');
const { exec } = require('child_process');
const chalk = require('chalk');
var inquirer = require('inquirer');
const { DEVTOOL_CLI_PATH } = require('../config/path.js');
const {
  isConfigExit,
  isProject,
  isHasDistDic,
} = require('../utils/util');

const COMMAND = {
  qrFormat: '-f',
  qrOutput: '-o',
  infoOutput: '-i',
  project: '--project',
}

const FILE_MAPPING = {
  terminal: '',
  image: 'qr-code.jpg',
  base64: 'qr-code-base64.txt',
  infoOutput: 'qr-code-log.json',
}

const QR_FORMAT_LIST = ['terminal', 'image', 'base64'];

const question = [
  {
    type: "list",
    name: "project",
    message: "选择要创建的编译目录",
    choices: [],
  },
  {
    type: 'rawlist',
    name: 'qrFormat',
    message: '二维码格式(资源将保存到当前项目根目录)',
    choices: QR_FORMAT_LIST,
    default: 'terminal',
  },
  {
    type: 'confirm',
    name: 'infoOutput',
    message: '相关信息会被输出到给定路径（可以不填）',
    default: 'y',
  },
]

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
  if (
    !compileDicList.length
  ) throw new Error('dist目录为空，请先打包');

  question[0].choices = compileDicList;

  inquirer
    .prompt([...question])
    .then(answers => {
      const { project } = answers;
      const isExit = isConfigExit(project);
      if (
        !isExit
      ) throw new Error('文件不存在');

      let commandStr = `${DEVTOOL_CLI_PATH} preview`;
      const keys = Object.keys(answers);
      for (let i of keys) {
        if (!answers[i]) continue;
        if (i === 'project') commandStr += ` ${COMMAND[i]} '${process.cwd()}/dist/${answers[i]}'`;
        else if (i === 'infoOutput') commandStr += answers[i] ? ` ${COMMAND['infoOutput']} '${process.cwd()}/${FILE_MAPPING['infoOutput']}'` : '';
        else commandStr += ` ${COMMAND[i]} '${answers[i]}'`;
      }
      if (
        answers['qrFormat'] !== 'terminal'
      ) commandStr += ` ${COMMAND['qrOutput']} '${process.cwd()}/${FILE_MAPPING[answers['qrFormat']]}'`;
      
      exec(commandStr, (error, stdout, stderr) => {
        if (error) {
          console.log(chalk.red('exec', error));;
          return;
        };
        console.log(chalk.yellow('命令已执行'));
        console.log(stdout.slice(0, 7) === '[error]' ? chalk.red('执行错误\n', stdout) : chalk.yellow('请扫码\n', stdout));
        console.log(stderr);

        console.log(chalk.bold.underline.yellow('Tips：'));
        console.log(chalk.yellow('1. 如若出现二维码不完整，请重新执行一次命令。'));
        console.log(chalk.yellow('2. 如弱出现非常规问题，请执行原始命令：', commandStr));
      });
    }).catch(err => {
      console.log(chalk.red('inquirer', err));
    });
} catch (error) {
  console.log(error);
}