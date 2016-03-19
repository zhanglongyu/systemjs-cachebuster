var crypto = require('crypto');
var fs = require('fs');
var path = require("path");
var upath = require("upath");
var stream = require("stream");

function FileHashIndex (options) {
    options = options || {};
    
    this.outputFileName = options.output || "system.hash.js";
    this.baseDir = options.baseDir || process.cwd();
    this.hashes = {};
}

FileHashIndex.prototype.onInit = function() {
    var me = this;
    
    var writable = new FileHashTransform(me);
    writable.on("finish", function() {
        me._flushIndex();
    });

    return writable;
}

FileHashIndex.prototype.onChange = function() {
    var me = this;

    var writable = new FileHashTransform(me, true);

    return writable;
}

FileHashIndex.prototype._processFile = function (file) {
    var hash = crypto.createHash('sha1').update(file._contents).digest('hex');

    var relFilePath = upath.normalize(path.relative(this.baseDir, file.path));
    this.hashes[relFilePath] = {
        path: relFilePath,
        hash: hash,
    };

    console.log("Updating hash: " + relFilePath + " --> " + hash);
}

FileHashIndex.prototype._flushIndex = function() {
    console.log("Writing summary file: " + this.outputFileName);

    var templateFileNPath = path.normalize(path.join(__dirname, "./hash.js.template"));
    var template = fs.readFileSync(templateFileNPath, "utf8");
    var content = template.replace("##hashes##",JSON.stringify(this.hashes));

    fs.writeFileSync(this.outputFileName, content);
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

module.exports = FileHashIndex;