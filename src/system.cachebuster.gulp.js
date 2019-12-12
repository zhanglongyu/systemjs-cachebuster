var crypto = require('crypto');
var fs = require('fs');
var path = require("path");
var upath = require("upath");
var stream = require("stream");

function SystemJSCacheBuster (options) {
    options = options || {};

    var outputFileName = options.output || "system.cachebuster.json";
    this.outputFilePath = path.join(process.cwd(), outputFileName);
    this.baseDir = options.baseDir || process.cwd();
    this.hashes = {};
}

SystemJSCacheBuster.prototype.full = function() {
    var me = this;
    
    var writable = new FileHashTransform(me);
    writable.on("finish", function() {
        me._flushIndex();
    });

    return writable;
}

SystemJSCacheBuster.prototype.incremental = function() {
    var me = this;

    var writable = new FileHashTransform(me, true);

    return writable;
}

SystemJSCacheBuster.prototype._processFile = function (file) {
    var hash = crypto.createHash('sha1').update(file._contents).digest('hex');

    var relFilePath = upath.normalize(path.relative(this.baseDir, file.path));
    this.hashes[relFilePath] = {
        path: relFilePath,
        hash: hash,
    };

    console.log("Updating hash: " + relFilePath + " --> " + hash);
}

SystemJSCacheBuster.prototype._flushIndex = function() {
    console.log("Writing summary file: " + this.outputFilePath);
    this.hashes = sortObject(this.hashes);

    fs.writeFileSync(this.outputFilePath, JSON.stringify(this.hashes, undefined, 2).replace(/\n/g, '\r\n'));
    // fs.writeFileSync(this.outputFilePath, JSON.stringify(this.hashes));
}

function sortObject(obj) {
    return Object.keys(obj).sort().reduce(function (result, key) {
        result[key] = obj[key];
        return result;
    }, {});
}

function FileHashTransform (index, flushIndex) {
    this.index = index;
    this.flushIndex = flushIndex;
    
    stream.Transform.call(this, {objectMode: true});
}

FileHashTransform.prototype = Object.create(stream.Transform.prototype);

FileHashTransform.prototype.write = function (file) {
    this.index._processFile(file);

    if(this.flushIndex) {
        this.index._flushIndex();
    }
}

FileHashTransform.prototype._transform  = function (file, encoding, callback) {
    this.index._processFile(file);

    this.push(file);
    
    callback();
}

module.exports = SystemJSCacheBuster;