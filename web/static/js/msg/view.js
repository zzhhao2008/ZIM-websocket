function strFormpt(str,len){
    //如果长度超出，则截断
    //如果为null，则赋值""
    //如果为undefined，则赋值""
    if(str==null) str="";
    if(str==undefined) str="";
    if(str.length>len) str=str.substring(0,len);
    return str;
}
function createMsgBox(msgid,msgconfig){
    //将msgconfig中各项的文本长度控制在24字符以内
    var msgbox=document.createElement("div");
    msgbox.id="Chatmsg-"+msgid;
    msgbox.className="msg-chatmsg";
    var firstrow=document.createElement("div");
    firstrow.className="firstrow";
    var left=document.createElement("span");
    left.className="left";
    left.innerHTML=strFormpt(msgconfig['name']);
    firstrow.appendChild(left);
    var right=document.createElement("span");
    right.className="right";
    right.innerHTML=strFormpt(msgconfig['time']);
    firstrow.appendChild(right);
    msgbox.appendChild(firstrow);
    var detial=document.createElement("span");
    detial.className="msgh-chatmsg-detial";
    detial.innerHTML=strFormpt(msgconfig['recent']['sender']+":"+msgconfig['recent']['content']);
    msgbox.appendChild(detial);
    return msgbox;
}