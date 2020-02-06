const OSS = require('ali-oss').Wrapper;
const { execSync } = require('child_process');
const { download: fetch } = require('./download.js/index.js');

const binPath = '/mnt/auto/instdir/program/soffice';
const defaultArgs = ["--headless", "--invisible", "--nodefault", "--view", "--nolockcheck", "--nologo", "--norestore"];

const defaultDoc = '/tmp/example.docx';
execSync(`cp -f /code/example.docx ${defaultDoc}`);

module.exports.handler = (sourceFileUrl, context, callback) => {
  if (sourceFileUrl) {
    return fetch(sourceFileUrl, filePath => {
      convertFile(filePath, context, callback);
    })
  }

  convertFile(defaultDoc, context, callback);
};

function convertFile(filePath, context, callback) {
  const logsForCheck = execSync(`pwd&&ls -all&&ls -all /tmp`);
  console.log('checking...', logsForCheck.toString('utf8'));

  const logs = execSync(`cd /tmp && ${binPath} ${defaultArgs.join(' ')} --convert-to pdf --outdir /tmp ${filePath}`);

  if (logs.indexOf('Error: source file could not be loaded') >= 0) {
    return callback(logs);
  }

  execSync(`cd /tmp && rm ${filePath}`);
  console.log(logs.toString('utf8'));
  uploadToOss(context, '/tmp/example.pdf').then((url) => {
    callback(null, url);
  }).catch((e) => {
    callback(e);
  });
}

async function uploadToOss(context, file) {
  let client = new OSS({
    region: `oss-${process.env.OSS_REGION || context.region}`,
    accessKeyId: process.env.OSS_ACCESS_KEY_ID || context.credentials.accessKeyId,
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET || context.credentials.accessKeySecret,
    stsToken: process.env.OSS_STS_TOKEN || context.credentials.securityToken,
    bucket: process.env.OSS_BUCKET
  });

  let result = await client.put('example.pdf', file);
  await client.putACL('example.pdf', 'public-read');

  return result.url.replace('-internal.aliyuncs.com/', '.aliyuncs.com/');
}