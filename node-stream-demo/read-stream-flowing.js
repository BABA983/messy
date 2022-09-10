const fs = require("fs");
const readable = fs.createReadStream("./myfile", { highWaterMark: 20 });

let bytesRead = 0;

console.log(
	`before attaching 'data' handler. is flowing: ${readable.readableFlowing}`
);
readable.on("data", (chunk) => {
	console.log(`Read ${chunk.length} bytes`);
	bytesRead += chunk.length;

	// Pause the readable stream after reading 60 bytes from it.
	if (bytesRead === 60) {
		readable.pause();
		console.log(`after pause() call. is flowing: ${readable.readableFlowing}`);

		// resume the stream after waiting for 1s.
		setTimeout(() => {
			readable.resume();
			console.log(
				`after resume() call. is flowing: ${readable.readableFlowing}`
			);
		}, 1000);
	}
});
console.log(
	`after attaching 'data' handler. is flowing: ${readable.readableFlowing}`
);