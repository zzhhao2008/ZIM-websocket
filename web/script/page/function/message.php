<?php view::header("消息首页") ?>
<div class="msg-menu menu-show" id="msg-menu">
    <div class="headbar">
        消息列表
    </div>
    <div class="msg-menu-body" id="msgbox">

    </div>
</div>
<div class="ChatWindow ChatWindow-notshow" id="msgWindow">
    <div class="headbar">
        <button class="closeWindow" onclick="closeChatWindow()"><?= view::icon("chevron-left") ?></button>
        <span id="chatWindow-name"></span>
    </div>
    <div class="chatWindow-body" id="chat-body">        
    </div>
    <div class="chatWindow-inputarea">
        <div class="function-area">
            <span><?= view::icon("emoji-smile") ?></span>
            <span><?= view::icon("image") ?></span>
        </div>
        <textarea id="chatWindow-input" onkeydown="if(event.ctrlKey&&event.keyCode==13){sendMsg()}" maxlength="1000"></textarea>
        <button class="send" onclick="sendMsg()">发送</button>
    </div>
</div>
<?php view::foot() ?>