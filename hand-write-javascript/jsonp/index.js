const jsonp = ({ url, params, cb }) => {
  const generateURL = () => {
    let dataSrc = "";
    for (const key in params) {
      if (Object.hasOwnProperty.call(params, key)) {
        dataSrc += `${key}=${params[key]}&`;
      }
    }
    dataSrc += `callback=${cb}`;
    return `${url}?${dataSrc}`;
  };

  return new Promise((resolve, reject) => {
    const scriptEle = document.createElement("script");
    scriptEle.src = generateURL();
    document.body.appendChild(scriptEle);
    window[cb] = (data) => {
      resolve(data);
      document.removeChild(scriptEle);
    };
  });
};
