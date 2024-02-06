<?php view::header("好友/群管理") ?>
<div class="mmain">
    <div class="msg-menu menu-show" id="msg-menu">
        <div class="headbar">
            好友/群管理
        </div>
        <div class="msg-menu-body" id="msgbox">
            <div class="searchbox">
                <input placeholder="搜索..." oninput="activeSearch(document.getElementById('searcher').value)" id="searcher">
            </div>
        </div>
    </div>
</div>
<?php view::foot() ?>