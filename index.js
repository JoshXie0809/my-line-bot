const express = require('express');
const { Client, middleware } = require('@line/bot-sdk');

const app = express();

const config = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new Client(config);

function handleEvent(event) {
    if(event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }

    return client.replyMessage(event.replyToken, {
        type: 'text',
        text: `你說了: ${event.message.text}`
    });
}

// 伺服器啟動邏輯包裝成 function
function startServer() {
    app.post('/webhook', middleware(config), (req, res) => {
        Promise.all(req.body.events.map(handleEvent))
            .then( result => res.json(result) )
            .catch(err => {
                console.error(err);
                res.status(500).end();
            });
    });

    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}

// 判斷是否直接執行檔案
if (require.main === module) {
    startServer();
}

// 匯出
module.exports = { handleEvent };
