import path from 'path';
const OSS = require('ali-oss');
const { execSync } = require('child_process');
const { download } = require('./download');
const { changeExtToPDF } = require('./paths.ts');

const binPath = '/mnt/auto/instdir/program/soffice';
const defaultArgs = ["--headless", "--invisible", "--nodefault", "--view", "--nolockcheck", "--nologo", "--norestore"];

const defaultDoc = '/tmp/example.docx';
execSync(`cp -f /code/example.docx ${defaultDoc}`);

module.exports.handler = (sourceFileUrl, context, callback) => {
  if (sourceFileUrl) {
    return download(sourceFileUrl, (err, filePath) => {
      if (err) {
        return callback(err);
      }

      console.log('downloaded to ', filePath);

      if (!filePath) {
        return callback('downloaded file path is empty! ' + JSON.stringify(filePath));
      }

      convertFile(filePath, context, callback);
    })
  }

  convertFile(defaultDoc, context, callback);
};

function convertFile(filePath, context, callback) {
  const logsForCheck = execSync(`pwd&&ls -all&&ls -all /tmp`);
  console.log('checking...', logsForCheck.toString('utf8'));

  const command = `cd /tmp && ${binPath} ${defaultArgs.join(' ')} --convert-to pdf --outdir /tmp ${filePath}`;

  console.log('will execute : ', command)
  const logs = execSync(command);

  if (logs.indexOf('Error: source file could not be loaded') >= 0) {
    return callback(logs);
  }

  execSync(`cd /tmp && rm ${filePath}&&ls /tmp`);
  console.log(logs.toString('utf8'));

  if (logs.indexOf('Error: source file could not be loaded') >= 0) {
    return callback(logs);
  }

  uploadToOss(context, changeExtToPDF(filePath)).then((url) => {
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

  const filename = path.basename(file);
  let result = await client.put(filename, file);
  await client.putACL(filename, 'public-read');

  return result.url.replace('-internal.aliyuncs.com/', '.aliyuncs.com/');
}