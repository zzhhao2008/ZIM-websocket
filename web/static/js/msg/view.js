function strFormpt(str,len=25){
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
    var last=document.getElementById("Chatmsg-con-"+msgid)
    if(last!=null){
        last.remove();
    }
    var msgbox=document.createElement("div");
    msgbox.id="Chatmsg-"+msgid;
    msgbox.onclick="openChatWindow(`"+msgid+"`)"
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
    detial.className="msg-chatmsg-detial";
    detial.innerHTML=strFormpt(msgconfig['recent']['sender']+":"+msgconfig['recent']['content']);
    msgbox.appendChild(detial);

    var menuitem=document.createElement("div");
    menuitem.className="msg-menu-item";
    menuitem.id="Chatmsg-con-"+msgid;
    menuitem.appendChild(msgbox)
    return menuitem;
}
function addMsgbox(msgid,msgnew){
    if(msgnew.time==null||msgnew.time==undefined){
        //赋值当前时分
        hour=new Date().getHours();
        minute=new Date().getMinutes();
        msgnew.time=hour+":"+minute;
    }
    var newmsgbox=createMsgBox(msgid,msgnew);
    var msgbox=document.getElementById("msgbox");
    if(msgbox!==null){
        msgbox.insertBefore(newmsgbox,msgbox.firstChild);
    }else{
        ShowMessage(strFormpt(msgnew['name']),strFormpt(msgnew['recent']['sender']+":"+msgnew['recent']['content']),msgnew['time'])
    }

}