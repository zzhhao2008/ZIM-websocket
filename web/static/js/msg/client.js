var nowChatingId = -1;
function openChatWindow(id) {
    nowChatingId = id;
    viewChatWindow({ 'name': id })
}
function closeChatWindow() {
    nowChatingId = -1;
    disViewChatWindow()
}
window.onload = function () {
    for (i = 1; i < 50; i++) {
        addMsgbox(i, { "name": "114514", "recent": { "sender": "zzh", "content": "content" } })
    }
    openChatWindow(49)
}
