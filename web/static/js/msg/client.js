var userid=``;
var nowChatingId = -1;
token = ""
friendList = {
    1:{ 'id': 1, 'name': '张三', 'online': true },
    2:{ 'id': 2, 'name': '李四', 'online': false },
    3:{ 'id': 3, 'name': '王五', 'online': true },
    4:{ 'id': 4, 'name': '赵六', 'online': false },
    5:{ 'id': 5, 'name': '钱七', 'online': true },
    6:{ 'id': 6, 'name': '孙八', 'online': false },
}
msglist ={
    1:{'id':1,'cfg':{"name":"张三","recent":{"sender":"张三","content":"你好。我是张三"},"timestamp":123458,"new":1}},
    2:{'id':2,'cfg':{"name":"李四","recent":{"sender":"李四","content":"你好。我是李四"},"timestamp":123456}},
    3:{'id':3,'cfg':{"name":"王五","recent":{"sender":"王五","content":"你好。我是王五"},"timestamp":123455}},
    4:{'id':4,'cfg':{"name":"赵六","recent":{"sender":"赵六","content":"你好。我是赵六"},"timestamp":123455}},
    5:{'id':5,'cfg':{"name":"钱七","recent":{"sender":"钱七","content":"你好。我是钱七"},"timestamp":123455}},
    6:{'id':6,'cfg':{"name":"孙八","recent":{"sender":"孙八","content":"你好。我是孙八"},"timestamp":123454}},
}

function openChatWindow(id) {
    disRing(id);
    viewChatWindow(id,msglist[id].cfg);
    nowChatingId = id;
    msglist[id].cfg.new=0;
}
function closeChatWindow() {
    disViewChatWindow(nowChatingId)
    nowChatingId = -1;
}
function sendMsg() {
    var msgcontent=getInputMsg();
    if(msgcontent==""){
        return;
    }
    if(token==""||nowChatingId==-1){
        ShowMessage("错误","发送失败","None")
    }
}
function connectWebSocket() {
    
}
function init(){
    viewinit();
    connectWebSocket();
    reviewAllFirends(friendList);
    reviewMsgList(msglist);
}
function activeSearch(txt){
    txt=strFormpt(txt,100);
    if(txt==""){
        reviewAllFirends(friendList);
    }else{
        temp={};
        for(i in friendList){
            //如果id或name部分匹配就加到temp中
            if(friendList[i].name.indexOf(txt)!=-1||friendList[i].id==parseInt(txt)){
                temp[i]=friendList[i];
            }
        }
        if(Object.keys(temp).length==0&&!isNaN(txt)){
            temp[0]={'id':parseInt(txt),'name':'尝试添加'+txt+'为好友','online':false,'addable':1};
        }
        reviewAllFirends(temp);
    }
    //console.log(txt);
}
function delFriend(id){
    if(1){
        friendList[id]=undefined;
        ShowMessage("成功","删除成功！","")
        reviewAllFirends(friendList);
    }else{
        ShowMessage("错误","删除失败！","")
    }
}