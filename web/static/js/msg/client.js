var userid=``;
var nowChatingId = -1;
token = ""
function openChatWindow(id) {
    viewChatWindow(id,{ 'name': id });
    nowChatingId = id;
}
function closeChatWindow() {
    nowChatingId = -1;
    disViewChatWindow(nowChatingId)
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
}
function activeSearch(txt){
    txt=strFormpt(txt,100);
    //console.log(txt);
}