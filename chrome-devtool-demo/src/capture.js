const CDP = require('chrome-remote-interface');
const fs = require('fs');
async function capture() {
  try {
    const { Page, DOM, Debugger } = await CDP();
    await Page.enable();
    await Page.navigate({ url: 'https://www.baidu.com' });
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const { data } = await Page.captureScreenshot();
    fs.writeFileSync('./screenshot.jpg', data, {
      encoding: 'base64',
    });

	await DOM.enable()
	const {root} = await DOM.getDocument({depth: -1})
	console.log(root)

	
  } catch (e) {
    console.log(e);
  }
}

capture()