const fs = require("fs");
const readable = fs.createReadStream("./myfile", { highWaterMark: 20 });

// readable.on("data", (chunk) => {
// 	console.log(`Read ${chunk.length} bytes\n"${chunk.toString()}"\n`);
// });

(async () => {
	for await (const chunk of readable) {
		console.log(`Read ${chunk.length} bytes\n"${chunk.toString()}"\n`);
	}
})();