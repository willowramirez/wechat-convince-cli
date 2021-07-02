#!/usr/bin/env node

const { fork } = require('child_process');
const chalk = require('chalk');

const path = require('../config/path.js');
const { DEVTOOL_CLI_PATH } = path;

try {
  console.log(DEVTOOL_CLI_PATH);
  const cmd = process.argv[2];
  if (cmd === undefined) throw new Error('命令缺少参数');
  fork(`${__dirname}/${cmd}.js`);
} catch (error) {
  console.log(chalk.red(error.message));
}