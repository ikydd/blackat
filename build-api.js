const fs = require('fs');
const path = require('path');

const mkdir = (dir) => {
	// making directory without exception if exists
	try {
		fs.mkdirSync(dir, 755);
	} catch(e) {
		if(e.code != "EEXIST") {
			throw e;
		}
	}
};

const copy = (src, dest) => {
	const srcFile = fs.createReadStream(src);
	const destFile = fs.createWriteStream(dest);
	srcFile.pipe(destFile);
};

const copyDir = (src, dest) => {
	mkdir(dest);
	fs.readdirSync(src).map((file) => {
        copy(path.join(src, file), path.join(dest, file));
    });
};

copyDir(`${__dirname}/data`, `${__dirname}/build/api`);