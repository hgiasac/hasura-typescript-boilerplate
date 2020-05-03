/* eslint-disable */
const fs = require('fs');
const dotenv = require('dotenv');
const path = require('path');

module.exports.dev = () => {
  const envFile = '.env.dev';
  try {
    const envFile = path.resolve(__dirname, '../../', envFile);
    return dotenv.parse(fs.readFileSync(envFile));
  } catch (err) {
    console.error(err);
    console.log(`cannot find ${envFile} config, fallback to process.env`);
    return process.env;
  }
};

module.exports.staging = () => {
  const envFile = '.env.staging';
  try {
    const envFile = path.resolve(__dirname, '../../', envFile);
    return dotenv.parse(fs.readFileSync(envFile));
  } catch (err) {
    console.error(err);
    console.log(`cannot find ${envFile} config, fallback to process.env`);
    return process.env;
  }
};

module.exports.prod = () => {
  const envFile = '.env.prod';
  try {
    const envFile = path.resolve(__dirname, '../../', envFile);
    return dotenv.parse(fs.readFileSync(envFile));
  } catch (err) {
    console.error(err);
    console.log(`cannot find ${envFile} config, fallback to process.env`);
    return process.env;
  }
};
