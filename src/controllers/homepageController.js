require("dotenv").config();
import request from "request";
const MY_VERIFY_TOKEN = process.env.MY_VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
var User = require('./../DB/User');

//co
let getSpinWheel = (req, res) => {
   return res.render("spinwheel.ejs");
}
//co
let postSpinWheel = async (req, res) => {

   let response = {
      "text": `Chúc mừng bạn đã nhận được ${req.body.display_value_spin} khi trúng tuyển vào trường! Nhà trường sẽ liên hệ lại tư vấn thêm cho bạn và lưu lại thông tin học bổng của bạn nhé!`
   };
   callSendAPI(req.body.psid, response);

   await User.updateMany({ psid: req.body.psid }, {
      $set: {
         prize: req.body.display_value_spin,
         checkPrize: 1
      }
   });
   console.log("update thanh cong");
   return res.redirect("/");
}
//co
let getWebViewRegister2 = (req, res) => {
   return res.render("register2.ejs");
}
//co
let postWebViewRegister2 = (req, res) => {
   let response = {
      "text": `Bạn đã đăng ký thành công,Bộ phận tuyển sinh của Phòng Đào Tạo sẽ liên hệ lại với bạn, bạn nhớ để ý điện thoại nhé!Chúc bạn sớm trở thành Sinh viên của Trường Đại Học Kinh Bắc!`
   };
   let prize = {
      "attachment": {
         "type": "template",
         "payload": {
            "template_type": "button",
            "text": "Em nhấn vào đây để đăng ký nhé.",
            "buttons": [
               {
                  "type": "web_url",
                  "url": "https://webview-chatbot.herokuapp.com/spin",
                  "title": "Quay thưởng",
                  "messenger_extensions": "true",
                  "webview_height_ratio": "tall"
               }
            ]
         }
      }
   }

   callSendAPI(req.body.psid, response);
   callSendAPI(req.body.psid, prize);
   var newUser = new User();
   newUser.psid = req.body.psid;
   newUser.name = req.body.name;
   newUser.number = req.body.number;
   newUser.email = req.body.email;
   newUser.txtDate = req.body.txtDate;
   newUser.major = req.body.major;
   newUser.address = req.body.address;
   newUser.prize = "";
   newUser.checkPrize = 0;
   newUser.save().then(function (err) {
      if (err) { console.log(err) }
      else {
         console.log("them thanh cong");
      }
   });
   console.log('update thanh cong');
   return res.redirect("/");
}

//true
let getSpinWheel2 = (req, res) => {
   return res.render("spinwheel2.ejs");
}
//true
let postSpinWheel2 = (req, res) => {
   let response = {
      "text": `Chúc mừng bạn đã nhận được ${req.body.display_value_spin} khi trúng tuyển vào trường, chúc bạn sớm trở thành tân sinh viên của Trường Đại học Kinh Bắc nhé!`
   };
   let register = {
      "attachment": {
         "type": "template",
         "payload": {
            "template_type": "button",
            "text": "Em nhấn vào đây để đăng ký nhé.",
            "buttons": [
               {
                  "type": "web_url",
                  "url": "https://webview-chatbot.herokuapp.com/register",
                  "title": "ĐĂNG KÝ ",
                  "messenger_extensions": "true",
                  "webview_height_ratio": "tall"
               }
            ]
         }
      }
   }
   callSendAPI(req.body.psid, response);
   callSendAPI(req.body.psid, register);
   var newUser = new User();
   newUser.psid = req.body.psid;
   newUser.name = "";
   newUser.number = "";
   newUser.email = "";
   newUser.txtDate = "";
   newUser.major = "";
   newUser.address = "";
   newUser.prize = req.body.display_value_spin;
   newUser.checkPrize = 1;
   newUser.save().then(function (err) {
      if (err) { console.log(err) }
      else {
         console.log("them thanh cong");
      }
   });
   return res.redirect("/");
}
//true
let getWebViewRegister = (req, res) => {
   return res.render("register.ejs");
}
//true
let postWebViewRegister = async (req, res) => {

   let response = {
      "text": `Bạn đã đăng ký thành công,Bộ phận tuyển sinh của Phòng Đào Tạo sẽ liên hệ lại với bạn, bạn nhớ để ý điện thoại nhé ! Chúc bạn sớm trở thành Sinh viên của Trường Đại Học Kinh Bắc!`
   };
   callSendAPI(req.body.psid, response);

   await User.updateMany({ psid: req.body.psid }, {
      $set: {
         name: req.body.name,
         number: req.body.number,
         email: req.body.email,
         txtDate: req.body.txtDate,
         major: req.body.major,
         address: req.body.address
      }
   });
   console.log('update thanh cong');
   return res.redirect("/");
}

let getHomepage = (req, res) => {

   return res.render("homepage.ejs");
};
let getWebhook = (req, res) => {
   let VERIFY_TOKEN = MY_VERIFY_TOKEN;
   let mode = req.query['hub.mode'];
   let token = req.query['hub.verify_token'];
   let challenge = req.query['hub.challenge'];
   if (mode && token) {
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
         console.log('WEBHOOK_VERIFIED');
         res.status(200).send(challenge);
      } else {
         res.sendStatus(403);
      }
   }
};
let postWebhook = (req, res) => {
   let body = req.body;
   if (body.object === 'page') {
      body.entry.forEach(function (entry) {
         let webhook_event = entry.messaging[0];
         console.log(webhook_event);
         let sender_psid = webhook_event.sender.id;
         console.log('Sender PSID: ' + sender_psid);
         if (webhook_event.message) {
            handleMessage(sender_psid, webhook_event.message);
         } else if (webhook_event.postback) {
            handlePostback(sender_psid, webhook_event.postback);
         }
      });
      res.status(200).send('EVENT_RECEIVED');
   } else {
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

   getWebViewRegister: getWebViewRegister,
   postWebViewRegister: postWebViewRegister,

   getWebViewRegister2: getWebViewRegister2,
   postWebViewRegister2: postWebViewRegister2,

   getSpinWheel: getSpinWheel,
   postSpinWheel: postSpinWheel,

   getSpinWheel2: getSpinWheel2,
   postSpinWheel2: postSpinWheel2
};

