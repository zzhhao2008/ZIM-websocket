var userid = ``;
var nowChatingId = -1;
token = ""
friendList = {}
msglist = {}
tcm = null
function openChatWindow(id) {
    socket.send(JSON.stringify({
        "type": "getMsg",
        "cid": id,
        "token": token
    }));
    disRing(id);
    viewChatWindow(id, msglist[id].cfg);
    nowChatingId = id;
    msglist[id].cfg.new = 0;
}
function closeChatWindow() {
    disViewChatWindow(nowChatingId)
    nowChatingId = -1;
}
function sendMsg() {
    var msgcontent = getInputMsg();
    if (msgcontent == "" || nowChatingId==-1) {
        return;
    }
    if(nowChatingId=="ai"){
        var msg = {
            "type": "ai",
            "content": msgcontent,
            "token": token
        }
        socket.send(JSON.stringify(msg));
        return;
    }
    var msg = {
        "type": "sendMsg",
        "cid": nowChatingId,
        "content": msgcontent,
        "token": token
    }
    socket.send(JSON.stringify(msg));
}
function connectWebSocket() {
    socket = new WebSocket("wss://chat.zsvstudio.top:85/");//创建websocket连接
    var initData = {
        "id": userid,
        "pas": pas
    };//初始化用户信息
    socket.onopen = function () {//连接成功回调函数
        socket.send(JSON.stringify(initData));//发送初始化信息
    }
    socket.onmessage = function (e) {//收到消息
        recvdata = JSON.parse(e.data);//解析JSON
        console.log(recvdata)
        switch (recvdata.type) { //根据指令执行操作
            case "auth":
                if (recvdata.status == "ok") {
                    token = recvdata.token;
                    socket.send(JSON.stringify({ "type": "getRecent", "token": token }));
                }
                break;
            case "error":
                ShowMessage("出错了！", recvdata.status, recvdata.code)
                if (recvdata.data.code <= -1) socket.close();
                break;
            case "timeout":
                location.reload();
                break;
            case "getRecent":
                friendList = recvdata.fri;
                reviewAllFirends(friendList);
                msglist = recvdata.msg;
                reviewMsgList(msglist);
                if(recvdata.read){
                    for(i in recvdata.read) {
                        ring(i)
                    }
                }
                break;
            case "getMsg":
                if (recvdata.code != 200) {
                    ShowMessage("出错了！", "获取聊天记录失败", recvdata.code)
                    closeChatWindow();
                }
                if (recvdata.cid == nowChatingId) {
                    for (i in recvdata.msg.msgs) {
                        cfg = recvdata.msg.msgs[i];
                        cfg.name = recvdata.onames[cfg['sid']]
                        cfg.timestamp = cfg.time
                        viewNewMsg(cfg)
                    }
                }
                chatBody.scrollTo(0, chatBody.scrollHeight)
                break;
            case "sendMsg":
                if (recvdata.code != 200) {
                    ShowMessage("出错了！", recvdata.status, recvdata.code)
                }
                break;
            case "syncMsg":
                var tdata = recvdata.data
                var onames=tdata.onames;
                var oname=""
                for (id in onames){
                    if (id!=userid){
                        oname=onames[id];
                        break;
                    }
                }
                var fmb = {
                    recent: {
                        "sender": tdata.sname,
                        "content": tdata.content
                    },
                    "timestamp":tdata.time,
                    "name":oname,
                    "content": tdata.content,
                    "sid":tdata.sid,
                }
                addMsgbox(recvdata.cid,fmb)
                if(recvdata.cid==nowChatingId){
                    fmb['name']=tdata.sname;
                    viewNewMsg(fmb)
                    chatBody.scrollTo(0, chatBody.scrollHeight)
                }
                tcm.currentTime = 0;
                tcm.play()
                break;
            case "dataChanged":
                socket.send(JSON.stringify({ "type": "getRecent", "token": token }));
                break; 
            case "delFriend":
                ShowMessage("好友已被删除", recvdata.status, recvdata.code)
                socket.send(JSON.stringify({ "type": "getRecent", "token": token }));
                break;
            case "addFriend":
                ShowMessage("好友已添加", recvdata.status, recvdata.code)
                socket.send(JSON.stringify({ "type": "getRecent", "token": token }));
                break;
            case "ai":
                if (nowChatingId == "ai"){
                    openChatWindow("ai")
                }
                break;
            case "useAiChat":
                chatInput.value=recvdata.content
                break;
        }
    }
    socket.onclose = function () {//连接断开
        ShowMessage("错误", "无法连接到服务器", "-1")
        console.error("Socket Disc:UD")
    }
}
function init() {
    tcm=document.getElementById("tcm");
    viewinit();
    connectWebSocket();
}
function activeSearch(txt) {
    txt = strFormpt(txt, 100);
    if (txt == "") {
        reviewAllFirends(friendList);
    } else {
        temp = {};
        for (i in friendList) {
            //如果id或name部分匹配就加到temp中
            if (friendList[i].name.indexOf(txt) != -1 || friendList[i].id == txt) {
                temp[i] = friendList[i];
            }
        }
        if (Object.keys(temp).length == 0) {
            temp[0] = { 'id': txt, 'name': '尝试添加' + txt + '为好友', 'online': false, 'addable': 1 };
        }
        reviewAllFirends(temp);
    }
}
function delFriend(id) {
    if (confirm("确定删除好友？确定后您与好友的消息记录等数据都将被清空")) {
        socket.send(JSON.stringify({ 'type': 'delFriend', 'id': id ,"token":token}));
    }
}
function addFriend(id) {
    if (confirm("确定添加好友？")) {
        socket.send(JSON.stringify({ 'type': 'addFriend', 'id': id ,"token":token}));
    }
}
function useAIChat(){
    if(nowChatingId==-1) return;
    socket.send(JSON.stringify({ 'type': 'useAiChat', 'cid': nowChatingId ,"token":token}));
}