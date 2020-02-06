const path = require('path');
const url = require('url');
const fs = require('fs');
const request = require('request');
const { compose, prop } = require('ramda');

const invoke = (method, ...args) => self => self[method].bind(self)(...args);
const invokeBy = (self, method) => (...args) => self[method].bind(self)(...args);
const getFilename = compose(path.basename, prop('pathname'), url.parse, invoke('toString'))
const getTempPath = filename => path.join('/tmp', filename);

const download = (fileUrl, callback) => {
    const downloadedPath = compose(getTempPath, getFilename)(fileUrl);

    const req = compose(request, invoke('toString'))(fileUrl);

    const pipeTo = compose(invokeBy(req, 'pipe'), invokeBy(fs, 'createWriteStream'));

    console.log('downloadedPath = ', downloadedPath);
    pipeTo(downloadedPath);

    req.on('error', err => callback(err));
    req.on('end', () => callback(null, downloadedPath))

    return req;
}

module.exports.download = download;