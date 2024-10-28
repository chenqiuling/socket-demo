const fs = require('fs');
const WebSocket = require('ws');

// 创建 WebSocket 服务器
const wss = new WebSocket.Server({ port: 3006 });

fs.readFile('./text.md', 'utf8', (err, data) => {
  if (err) {
    console.error(err, '内容获取失败');
    return;
  }
  const text = data;

  wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
      try {
        let index = 0;
        const reqParams = JSON.parse(message);
        console.log('接收参数:', reqParams);

        const sendNextChar = () => {
          if (index < text.length) {
            console.log('打印数据:', text[index])
            ws.send(`id: ${reqParams.req_id}\ndata: ${encodeURIComponent(text[index])}\n\n`);
            index++;
            setTimeout(sendNextChar, 10); // 每隔10毫秒发送下一个字
          } else {
            ws.send(`id: ${reqParams.req_id}\ndata: [DONE]\n\n`);
          }
        };
        sendNextChar()
      } catch (error) {
        console.error('解析参数失败:', error);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });
});

console.log('WebSocket server is running on ws://127.0.0.1:3006');
