chatWindow=null;
msgmenu=null;
function viewinit(){
    chatWindow = document.getElementById("msgWindow");
    msgmenu = document.getElementById("msg-menu");
    chatBody = document.getElementById("chat-body");
    chatInput = document.getElementById("chatWindow-input");
}

function strFormpt(str, len = 25) {
    //如果长度超出，则截断
    //如果为null，则赋值""
    //如果为undefined，则赋值""
    if (str == null) str = "";
    if (str == undefined) str = "";
    if (str.length > len) str = str.substring(0, len) + "...";
    return str;
}
function createMsgBox(msgid, msgconfig) {
    //将msgconfig中各项的文本长度控制在24字符以内
    var last = document.getElementById("Chatmsg-con-" + msgid)
    if (last != null) {
        last.remove();
    }
    var msgbox = document.createElement("div");
    msgbox.id = "Chatmsg-" + msgid;
    msgbox.onclick = function () { openChatWindow(msgid); }

    msgbox.className = "msg-chatmsg";
    var firstrow = document.createElement("div");
    firstrow.className = "firstrow";
    var left = document.createElement("span");
    left.className = "left";
    left.innerHTML = strFormpt(msgconfig['name']);
    firstrow.appendChild(left);
    var right = document.createElement("span");
    right.className = "right";
    right.innerHTML = strFormpt(msgconfig['time']);
    firstrow.appendChild(right);
    msgbox.appendChild(firstrow);
    var detial = document.createElement("span");
    detial.className = "msg-chatmsg-detial";
    detial.innerHTML = strFormpt(msgconfig['recent']['sender'] + ":" + msgconfig['recent']['content']);
    msgbox.appendChild(detial);

    var menuitem = document.createElement("div");
    menuitem.className = "msg-menu-item";
    menuitem.id = "Chatmsg-con-" + msgid;
    menuitem.appendChild(msgbox)
    return menuitem;
}
function addMsgbox(msgid, msgnew) {
    if (msgnew.time == null || msgnew.time == undefined) {
        //赋值当前时分
        hour = new Date().getHours();
        minute = new Date().getMinutes();
        //自动补零
        if (hour < 10) {
            hour = "0" + hour;
        }
        if (minute < 10) {
            minute = "0" + minute;
        }
        msgnew.time = hour + ":" + minute;
    }
    var newmsgbox = createMsgBox(msgid, msgnew);
    var msgbox = document.getElementById("msgbox");
    if (msgbox !== null) {
        msgbox.insertBefore(newmsgbox, msgbox.firstChild);
    } else {
        ShowMessage(strFormpt(msgnew['name']), strFormpt(msgnew['recent']['sender'] + ":" + msgnew['recent']['content']), msgnew['time'])
    }

}
function viewChatWindow(id,cfg) {
    chatWindow.className = "ChatWindow ChatWindow-show";
    msgmenu.className = "msg-menu menu-notshow";
    document.getElementById("chatWindow-name").innerHTML = strFormpt(cfg['name']);
    chatInput.focus();
    document.getElementById("Chatmsg-" +id).className += " active";
    if(nowChatingId!=-1)
    document.getElementById("Chatmsg-" +nowChatingId).className = "msg-chatmsg";
}
function disViewChatWindow(id) {
    chatWindow.className = "ChatWindow ChatWindow-notshow";
    msgmenu.className = "msg-menu menu-show";
    document.getElementById("Chatmsg-" +id).className = "msg-chatmsg"
}
function createNewMsg(cfg) {
    /*
    <div class="msg-line">
            <div class="nameline">ZZH</div>
            <div class="msgboubleline">
                <div class="msgbouble">1145145 1145145 1145145 1145145 1145145 1145145 1145145 1145145 1145145 1145145 1145145 1145145 1145145 1145145 1145145 1145145 1145145 1145145 </div>
            </div>
        </div>
    */
    var newline = document.createElement("div");
    newline.className = "msg-line";
    if(cfg['id']===userid){
        newline.className = " msg-line-mine";
    }
    var nameline = document.createElement("div");
    nameline.className = "nameline";
    nameline.innerHTML = strFormpt(cfg['name']);
    newline.appendChild(nameline);
    var msgboubleline = document.createElement("div");
    msgboubleline.className = "msgboubleline";
    var msgbouble = document.createElement("div");
    msgbouble.className = "msgbouble";
    msgbouble.innerHTML = strFormpt(cfg['content'], 1000);
    msgboubleline.appendChild(msgbouble);
    newline.appendChild(msgboubleline);
    return newline;
}
function viewNewMsg(cfg) {
    var newline = createNewMsg(cfg);
    chatBody.appendChild(newline);
}
function getInputMsg() {
    var msg = chatInput.value;
    chatInput.value = "";
    return msg;
}