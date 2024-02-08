chatWindow = null;
msgmenu = null;
function viewinit() {
    chatWindow = document.getElementById("msgWindow");
    msgmenu = document.getElementById("msg-menu");
    chatBody = document.getElementById("chat-body");
    chatInput = document.getElementById("chatWindow-input");
    friendlist = document.getElementById("friend-list");
    viewedmsglist = {}
}

function strFormpt(str, len = 20) {
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
    var last = document.getElementById("Chatmsg-" + msgid)

    var msgbox = document.createElement("div");
    msgbox.id = "Chatmsg-" + msgid;
    msgbox.onclick = function () { openChatWindow(msgid); }
    if (last != null) {
        msgbox.className = last.className;
    } else {
        msgbox.className = "msg-chatmsg";
        if (msgconfig['new']) {
            msgbox.className += " msg-chatmsg-ring";
        }
    }

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
    var last = document.getElementById("Chatmsg-con-" + msgid)
    if (last != null) {
        last.remove()
    }
    return menuitem;
}
function addMsgbox(msgid, msgnew) {
    if (msgnew.time == null || msgnew.time == undefined) {
        //赋值当前时分
        var hour = new Date().getHours();
        var minute = new Date().getMinutes();
        var other = ""
        //如果msgnew.timestamp已设置
    }
    if (msgnew.timestamp) {
        var d = new Date(msgnew.timestamp * 1000);
        hour = d.getHours();
        minute = d.getMinutes();
        //如果相隔时间超过一天就显示月+日
        if (Math.abs(new Date().getTime() / 1000 - msgnew.timestamp) > 24 * 60 * 60 * 1000) {
            other = d.getMonth() + 1 + "-" + d.getDate();
        }
        //如果超过一年就只显示年
        if (Math.abs(new Date().getFullYear() - d.getFullYear()) > 1) {
            other = d.getFullYear();
        }
    }
    //自动补零
    if (hour < 10) {
        hour = "0" + hour;
    }
    if (minute < 10) {
        minute = "0" + minute;
    }
    msgnew.time = hour + ":" + minute;
    if (other != "") {
        msgnew.time = other;
    }
    var newmsgbox = createMsgBox(msgid, msgnew);
    var msgbox = document.getElementById("msgbox");
    if (msgbox !== null) {
        msgbox.insertBefore(newmsgbox, msgbox.firstChild);
    } else {
        ShowMessage(strFormpt(msgnew['name']), strFormpt(msgnew['recent']['sender'] + ":" + msgnew['recent']['content']), msgnew['time'])
    }

}
function viewChatWindow(id, cfg) {
    if (nowChatingId != -1)
        document.getElementById("Chatmsg-" + nowChatingId).className = "msg-chatmsg";
    chatWindow.className = "ChatWindow ChatWindow-show";
    msgmenu.className = "msg-menu menu-notshow";
    document.getElementById("chatWindow-name").innerHTML = strFormpt(cfg['name']);
    chatInput.focus();
    document.getElementById("Chatmsg-" + id).className += " active";
    chatBody.innerHTML = ""
}
function disViewChatWindow(id) {
    console.log("disViewChatWindow", id);
    chatWindow.className = "ChatWindow ChatWindow-notshow";
    msgmenu.className = "msg-menu menu-show";
    document.getElementById("Chatmsg-" + id).className = "msg-chatmsg"
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
    if (cfg['sid'] === userid) {
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
    chatInput.focus();
    return msg;
}
function createFriend(cfg) {
    var newitem = document.createElement("div");
    newitem.className = "msg-menu-item";
    var nameline = document.createElement("div");
    nameline.className = "friendnameline";
    var left = document.createElement("div");
    left.className = "left";
    left.innerHTML = strFormpt(cfg['name']);
    var right = document.createElement("div");
    right.className = "right";
    if (cfg['online']) {
        right.innerHTML = "在线";
        right.className += " text-success";
    } else {
        right.innerHTML = "离线";
        right.className += " text-danger";
    }
    nameline.appendChild(left);
    nameline.appendChild(right);
    newitem.appendChild(nameline);
    var controlline = document.createElement("div");
    controlline.className = "friendcontrolline";
    delbtn = document.createElement("button");
    if (cfg['addable']) {
        delbtn.className += "btn-danger";
        delbtn.innerHTML = "添加";
        delbtn.onclick = function () {
            addFriend(cfg['id']);
        }
    } else {
        delbtn.className += "btn-danger";
        delbtn.innerHTML = "删除";
        delbtn.onclick = function () {
            delFriend(cfg['id']);
        }
    }
    controlline.appendChild(delbtn);
    newitem.appendChild(controlline);
    return newitem;
}
function viewnewfriend(cfg) {
    friendlist.appendChild(createFriend(cfg));
}
function reviewAllFirends(listdata) {
    if (friendlist == null) return 0;
    //清空列表
    friendlist.innerHTML = "";
    for (i in listdata) {
        if (listdata[i] == undefined) {
            continue;
        }
        viewnewfriend(listdata[i]);
    }
    return 1;
}
function reviewMsgList(inlistdata) {
    var listdata = JSON.parse(JSON.stringify(inlistdata)); // 创建对象副本
    if (listdata == null) return 0;
    //将listdata按照cfg.timestamp降序排序
    for (i in listdata) {
        if (listdata[i] == undefined) {
            continue;
        }
        listdata[i]['cfg']['timestamp'] = parseInt(listdata[i]['cfg']['timestamp']);
        for (j in listdata) {
            if (listdata[j] == undefined || i == j) {
                continue;
            }
            listdata[j]['cfg']['timestamp'] = parseInt(listdata[j]['cfg']['timestamp']);
            if (listdata[i]['cfg']['timestamp'] < listdata[j]['cfg']['timestamp']) {
                var temp = listdata[i];
                listdata[i] = listdata[j];
                listdata[j] = temp;
            }
        }
    }
    var msgbox = document.getElementById("msgbox");
    if (msgbox == null) {
        return 0;
    }
    for (i in listdata) {
        if (listdata[i] == undefined) {
            continue;
        }
        addMsgbox(listdata[i]['id'], listdata[i]['cfg']);
        viewedmsglist[listdata['id']] = listdata[i]
    }
}
function disRing(id) {
    document.getElementById("Chatmsg-" + id).className = "msg-chatmsg";
}
function ring(id) {
    document.getElementById("Chatmsg-" + id).className += "msg-chatmsg-ring";
}