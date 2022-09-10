const fs = require("fs");
const crypto = require("crypto");
const buffer = require("buffer")

console.log('MAX_LENGTH', buffer.constants.MAX_LENGTH)

fs.readFile("./4gb_file", (readErr, data) => {
	if (readErr) return console.log(readErr);
	const hash = crypto.createHash("sha256").update(data).digest("base64");
	fs.writeFile("./checksum.txt", hash, (writeErr) => {
		writeErr && console.error(err);
	});
});