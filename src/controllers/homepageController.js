require("dotenv").config();
import request from "request";
const MY_VERIFY_TOKEN = process.env.MY_VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
var User = require('./../DB/User');

let getWebViewPage = (req, res) => {
    return res.render("register.ejs");
}

let getSpinWheel = async (req, res) => {
    try {
        var myDoc = await User.findOne({ psid: req.body.psid }).count() > 0;
        console.log(myDoc);
        return res.render("spinwheel.ejs", { myDoc: myDoc });
    } catch (err) {
        console.log(err);
    }
}

let handleWebView = (req, res) => {
    try {
        var newUser = new User();
        newUser.psid = req.body.psid;
        newUser.name = req.body.name;
        newUser.number = req.body.number;
        newUser.email = req.body.email;
        newUser.txtDate = req.body.txtDate;
        newUser.major = req.body.major;
        newUser.address = req.body.address;
        newUser.prize = "";
        newUser.checkPrize = 0
        newUser.save().then(function (err) {
            if (err) { console.log(err) }
        })
        let response = {
            "text": `Bộ phận tuyển sinh của Phòng Đào Tạo sẽ liên hệ lại với em, em nhớ để ý điện thoại em nhé!
                      \nChúc em sớm trở thành Sinh viên của Trường Đại Học Kinh Bắc!`
        };
        let prize = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": "Để chào mừng tân sinh viên, Trường gửi tới các bạn 1 suất học bổng,Tổng giá trị học bổng lên đến 100 triệu đồng, bạn hãy nhấn vào đường dẫn bên dưới để lấy học bổng nhé!",
                    "buttons": [
                        {
                            "type": "web_url",
                            "url": "https://webview-chatbot.herokuapp.com/spin",
                            "title": "QUAY THƯỞNG",
                            "messenger_extensions": "true",
                            "webview_height_ratio": "tall"
                        }
                    ]
                }
            }
        }
        callSendAPI(req.body.psid, response);
        callSendAPI(req.body.psid, prize);
        return res.redirect("/webview");

    } catch (err) {
        console.log(err);
    }
}

let handSpinWheel = (req, res) => {
    let response = {
        "text": `Chúc mừng em nhận đã được ${req.body.display_value_spin} khi trúng tuyển vào trường! Nhà trường sẽ liên hệ lại tư vấn thêm cho em và lưu lại thông tin học bổng của em nhé!`
    };
    callSendAPI(req.body.psid, response);
    User.update(
        { psid: req.body.psid },
        { $set: { prize: req.body.display_value_spin, checkPrize: 1 } });
    console.log("Update success");
    return res.redirect("/");
}

let getHomepage = (req, res) => {
    return res.render("homepage.ejs");
};

let getWebhook = (req, res) => {

    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = MY_VERIFY_TOKEN;

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
};

// rất cần thiết
let postWebhook = (req, res) => {
    // Parse the request body from the POST
    let body = req.body;

    // Check the webhook event is from a Page subscription
    if (body.object === 'page') {

        // Iterate over each entry - there may be multiple if batched
        body.entry.forEach(function (entry) {

            // Gets the body of the webhook event
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);

            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }
        });

        // Return a '200 OK' response to all events
        res.status(200).send('EVENT_RECEIVED');

    } else {
        // Return a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
};

let callSendAPI = (sender_psid, response) => {

    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    };

    request({
        "uri": "https://graph.facebook.com/v6.0/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
};

module.exports = {
    getHomepage: getHomepage,
    getWebhook: getWebhook,
    postWebhook: postWebhook,
    getWebViewPage: getWebViewPage,
    handleWebView: handleWebView,
    getSpinWheel: getSpinWheel,
    handSpinWheel: handSpinWheel
};