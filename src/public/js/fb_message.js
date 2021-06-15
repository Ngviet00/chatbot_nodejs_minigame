(function (d, s, id) {
   var js,
      fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {
      return;
   }
   js = d.createElement(s);
   js.id = id;
   js.src = "//connect.facebook.net/en_US/messenger.Extensions.js";
   fjs.parentNode.insertBefore(js, fjs);
})(document, "script", "Messenger");

window.extAsyncInit = function () {
   MessengerExtensions.getContext(
      "197041085597301",
      //208033644177404 cua thiep ml
      function success(thread_context) {
         document.getElementById("psid").value = thread_context.psid;

         var flag = false;
         ("<% for(let i=0; i < myDoc.length; i++) { %>");
         if (thread_context.psid == "<%= myDoc[i].psid %>") {
            if ("<%= myDoc[i].checkPrize %>" == "0") {
               flag = true;
            } else {
               flag = false;
            }
         } else {
            flag = true;
         }

         ("<% } %>");

         if (flag == true) {
            var get_btn_play_spin = document.getElementById("btn_play");
            get_btn_play_spin.style.backgroundColor = "blue";
            get_btn_play_spin.innerText = "Play";
            get_btn_play_spin.style.cursor = "pointer";
            get_btn_play_spin.addEventListener("click", startSpin);
            get_btn_play_spin.addEventListener("touchstart", startSpin);
         }
      },
      function error(err) {
         console.log(err);
      }
   );
};

function handleSaveBtn() {
   document.getElementById("verify").style.display = "none";
   MessengerExtensions.requestCloseBrowser(
      function success() { },
      function error(err) {
         console.log(err);
      }
   );
}