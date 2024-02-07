<?php view::header("好友/群管理") ?>
<div class="mmain">
    <div class="msg-menu menu-show" id="msg-menu">
        <div class="headbar">
            好友/群管理
        </div>
        <div class="msg-menu-body" id="friendbox">
            <div class="searchbox">
                <input placeholder="搜索..." oninput="activeSearch(document.getElementById('searcher').value)" id="searcher">
            </div>
            <div id="friend-list">
                <div class="msg-menu-item">
                    <div class="friendnameline">
                        <span class="left">好友一</span>
                        <span class="right text-success">在线</span>
                    </div>
                    <div class="friendcontrolline">
                        <button class="btn btn-default btn-sm">删除</button>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>
<?php view::foot() ?>