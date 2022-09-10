const ws = require('ws');

const wss = new ws.Server({ port: 8080 });

// http://localhost:3000/devtools_app?ws=localhost:8080
wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    console.log('received %s', data);
    const { method, id } = JSON.parse(data);

    if (method === 'DOM.getDocument') {
      ws.send(
        JSON.stringify({
          id,
          result: {
            root: {
              nodeId: 1,
              backendNodeId: 1,
              nodeType: 9,
              nodeName: '#document',
              localName: '',
              nodeValue: '',
              childNodeCount: 2,
              children: [
                {
                  nodeId: 2,
                  parentId: 1,
                  backendNodeId: 2,
                  nodeType: 10,
                  nodeName: 'html',
                  localName: '',
                  nodeValue: '',
                  publicId: '',
                  systemId: '',
                },
                {
                  nodeId: 3,
                  parentId: 1,
                  backendNodeId: 3,
                  nodeType: 1,
                  nodeName: 'HTML',
                  localName: 'html',
                  nodeValue: '',
                  childNodeCount: 2,
                  children: [
                    {
                      nodeId: 4,
                      parentId: 3,
                      backendNodeId: 4,
                      nodeType: 1,
                      nodeName: 'HEAD',
                      localName: 'head',
                      nodeValue: '',
                      childNodeCount: 5,
                      attributes: [],
                    },
                    {
                      nodeId: 5,
                      parentId: 3,
                      backendNodeId: 5,
                      nodeType: 1,
                      nodeName: 'BODY',
                      localName: 'body',
                      nodeValue: '',
                      childNodeCount: 1,
                      attributes: [],
                    },
                  ],
                  attributes: ['lang', 'en'],
                  frameId: 'E82AE391F90AA922AFB3480180643592',
                },
              ],
              documentURL: 'http://127.0.0.1:8085/',
              baseURL: 'http://127.0.0.1:8085/',
              xmlVersion: '',
              compatibilityMode: 'NoQuirksMode',
            },
          },
        })
      );
      ws.send(
        JSON.stringify({
          method: 'DOM.setChildNodes',
          params: {
            nodes: [
              {
                attributes: ['class', 'title'],
                backendNodeId: 6,
                childNodeCount: 0,
                children: [
                  {
                    backendNodeId: 6,
                    localName: '',
                    nodeId: 7,
                    nodeName: '#text',
                    nodeType: 3,
                    nodeValue: 'Hello World',
                    parentId: 6,
                  },
                ],
                localName: 'h1',
                nodeId: 6,
                nodeName: 'h1',
                nodeType: 1,
                nodeValue: '',
                parentId: 5,
              },
            ],
            parentId: 5,
          },
        })
      );
    } else if (method === 'DOM.requestChildNodes') {
      ws.send(
        JSON.stringify({
          id,
          result: {},
        })
      );
    }
  });

  ws.send(
    JSON.stringify({
      method: 'Network.requestWillBeSent',
      params: {
        requestId: '999',
        frameId: '123.1',
        loaderId: '123.2',
        request: {
          url: 'www.baidu.com',
          method: 'post',
          headers: {
            'Content-Type': 'text/html',
          },
          initialPriority: 'High',
          mixedContentType: 'none',
          postData: {
            hello: 'world',
          },
        },
        timestamp: Date.now(),
        wallTime: Date.now() - 10000,
        initiator: {
          type: 'other',
        },
        type: 'Document',
      },
    })
  );
});
