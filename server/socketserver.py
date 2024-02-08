import asyncio
import websockets
import json
import requests
import time
import datacommd as db
import glm3 as ai
clients = {}
users = {}
databseurl = "https://chat.zsvstudio.top/api/"
chatdataU2U = {}  # 用户和用户对话
friends = {}
recents={}

chatdataU2U = db.read_data("chatdataU2U")
friends = db.read_data("friends")
recents = db.read_data("recents")

# 异步函数，接收客户端连接
async def main(nowcli):
    # 接收客户端发送的数据
    init_data = await nowcli.recv()
    # 将接收到的数据转换成json格式
    userinfo = json.loads(init_data)
    # 调用接口，验证用户名和密码
    usertext = requests.get(databseurl+"userAuth?id=" +
                            userinfo['id']+"&pas="+userinfo['pas']).text
    # 如果验证失败，则返回错误信息
    if (usertext == "No"):
        print("Auth Failed", userinfo['id'])
        await nowcli.send(json.dumps({"status": "AuthFailed", "type": "error"}))
        await nowcli.close()
        return
    # 将验证成功后的数据转换成json格式
    print("Auth Success", usertext)
    userinfo = json.loads(usertext)
    # 获取token和uid
    token = userinfo['token']
    uid = userinfo['id']
    # 将客户端和uid对应起来
    clients[uid] = nowcli
    # 从服务器获取全部用户信息
    alltext = requests.get(databseurl+"userAll").text
    users = json.loads(alltext)
    # 简略我的信息
    userinfo = users[uid]
    userinfo['token'] = token
    # 记录客户端的登录时间
    userinfo['clitime'] = time.time()
    # 将用户信息存入users中
    users[uid] = userinfo
    print(userinfo)
    # 返回登录成功的信息
    if uid not in friends:
        friends[uid] = []
    await nowcli.send(json.dumps({"token": token, "status": "ok", "type": "auth"}))
    myaimes=[]
    try:
        # 循环接收客户端发送的消息
        while 1:
            message = await nowcli.recv()
            mes = json.loads(message)
            print("Received message:", mes)
            # 如果token不正确，则返回错误信息
            if ("token" not in  mes or mes['token'] != token):
                print("Token Auth Failed:", userinfo)
                await nowcli.send(json.dumps({"status": "AuthFailed", "type": "error"}))
                await nowcli.close()
                return
            # 如果登录时间超过7天，则返回超时信息
            if (time.time()-userinfo['clitime'] > 3600*24*7):
                print("Timeout:", userinfo)
                await nowcli.send(json.dumps({"status": "Timeout", "type": "error"}))
                await nowcli.close()
                return
            if("type" not in mes):
                continue
            # 根据消息类型，执行不同的操作
            match(mes['type']):
                case 'getRecent':
                    # 获取最近消息
                    friendList = {}
                    msglist = {}
                    for findex in friends[uid]:
                        thisone = {}
                        fid = findex["uid"]
                        cid = findex["cid"]
                        if (fid in users):
                            thisone['id'] = fid
                            thisone['name'] = users[fid]['name']
                            if (fid in clients):
                                thisone['online'] = 1
                            else:
                                thisone['online'] = 0
                            friendList[fid] = thisone
                            # 获取与朋友的最后一次聊天记录
                            tcd = chatdataU2U[cid]
                            recent_temp = tcd['msgs'][-1]
                            recent_temp2 = {}
                            # recent_temp2['timestamp'] = recent_temp['time']
                            recent_temp2['content'] = recent_temp['content']
                            recent_temp2['sender'] = users[recent_temp['sid']]['name']
                            msglist[cid] =  {
                                            "id": cid,
                                            "cfg": {
                                                    "name": thisone['name'], 
                                                    "recent": recent_temp2,
                                                    "timestamp": recent_temp['time'],
                                                }
                                            }
                    # 将AI对话记录插入
                    msglist['ai'] = {
                        "id": "ai",
                        "cfg": {
                            "name":"AI小助手",
                            "recent": {
                                "content": "欢迎使用AI小助手",
                                "sender": "AI小助手",
                                'timestamp': time.time()
                            }
                        }
                    }

                    if (uid in recents):
                        rcr=recents[uid]
                        recents['uid']={}
                        db.write_data(recents,"recents")
                    else:
                        rcr={}
                    rdata = {"fri": friendList, "msg": msglist,"read":rcr,"status": "ok", "type": "getRecent"}
                    await nowcli.send(json.dumps(rdata))
                    continue
                case "sendMsg":
                    # 发送消息
                    cid = mes["cid"]
                    content = mes["content"]
                    if len(content) > 1000:
                        rdata = {"status": "消息太长", "type": "sendMsg","code":403}
                        await nowcli.send(json.dumps(rdata))
                    elif cid not in chatdataU2U or uid not in chatdataU2U[cid]["member"]:
                        rdata = {"status": "对方还不是你的好友", "type": "sendMsg","code":404}
                        await nowcli.send(json.dumps(rdata))
                    else:
                        chatdataU2U[cid]["msgs"].append({"sid": uid, "content": content, "time": time.time()})
                        rdata = {"status": "ok", "type": "sendMsg","code":200}
                        await nowcli.send(json.dumps(rdata))
                        # 群发消息
                        onames={}
                        for i in chatdataU2U[cid]['member']:
                            onames[i]=users[i]['name']
                        mesdata={"sid":uid,"sname":userinfo['name'],"content":content,"time":time.time(),"onames":onames}
                        for uidn in chatdataU2U[cid]["member"]:
                            print("sendTo",uidn)
                            if uidn in clients and clients[uidn].open:
                                rdata = {"status": "ok", "type": "syncMsg","code":200,"cid":cid,"data":mesdata}
                                await clients[uidn].send(json.dumps(rdata))
                            else:
                                if uidn not in recents:
                                    recents[uidn]={}
                                recents[uidn][cid]=mesdata
                                db.write_data(recents,"recents")
                case "getMsg":
                    #获取全部消息
                    cid = mes["cid"]
                    if cid == "ai":
                        onames={uid:userinfo['name'],"ai":'AI小助手'}
                        msgb=[]
                        for hist in myaimes:
                            sid="ai"
                            if hist['role']=='user':
                                sid=uid
                            msgb.append({"sid":sid,"content":hist['content'],"time":time.time()})
                        rdata = {"status": "ok", "type": "getMsg","code":200,"msg":{"msgs":msgb,"member":[uid,"ai"]},"cid":cid,"onames":onames}
                        await nowcli.send(json.dumps(rdata))
                        continue
                    if cid not in chatdataU2U:
                        rdata = {"status": "error", "type": "getMsg","code":404}
                        await nowcli.send(json.dumps(rdata))
                        continue
                    onames={}
                    for i in chatdataU2U[cid]['member']:
                        onames[i]=users[i]['name']
                    rdata = {"status": "ok", "type": "getMsg","code":200,"msg":chatdataU2U[cid],"cid":cid,"onames":onames}
                    await nowcli.send(json.dumps(rdata))
                    continue
                case "delFriend":
                    #删除好友操作
                    fid = mes["id"]
                    for friendinfo in friends[uid]:
                        if friendinfo['uid']==fid:
                            chatdataU2U.pop(friendinfo['cid'])
                            friends[uid].remove(friendinfo)
                            rdata={"status":"已成功将"+fid+"从好友中移除","type":"delFriend","code":200}
                            await nowcli.send(json.dumps(rdata))
                            break
                    for friendinfo in friends[fid]:
                        if friendinfo['uid']==uid:
                            #chatdataU2U.pop(friendinfo['cid'])
                            friends[fid].remove(friendinfo)
                            rdata={"status":"已被"+uid+"从好友中移除","type":"delFriend","code":200}
                            if fid in clients:
                                await clients[fid].send(json.dumps(rdata))
                            break
                    db.write_data(friends,"friends")
                case "addFriend":
                    fid=mes["id"]
                    alltext = requests.get(databseurl+"userAll").text
                    users = json.loads(alltext)
                    if fid not in users:
                        rdata={"status":"该用户不存在","type":"addFriend","code":404}
                        await nowcli.send(json.dumps(rdata))
                        continue
                    if users[fid]['addable'] != True:
                        rdata={"status":"该用户无法添加为好友","type":"addFriend","code":403}
                        await nowcli.send(json.dumps(rdata))
                        continue
                    #如果我的好友数量超过300个
                    if len(friends[uid])>=300:
                        rdata={"status":"您的好友数量已达上限","type":"addFriend","code":403}
                        await nowcli.send(json.dumps(rdata))
                        continue
                    #如果对方的好友数量超过300个
                    if fid in friends and len(friends[fid])>=300 or fid=="ai" :
                        rdata={"status":"对方的好友数量已达上限","type":"addFriend","code":403}
                        await nowcli.send(json.dumps(rdata))
                        continue
                    notExi=True
                    for friendinfo in friends[uid]:
                        if friendinfo['uid']==fid:
                            rdata={"status":"该用户已是您的好友","type":"addFriend","code":409}
                            await nowcli.send(json.dumps(rdata))
                            notExi=False
                            break
                    if notExi :
                        cid=str(len(chatdataU2U)+1)
                        myinfo={"uid":fid,"cid":cid,"time":time.time()}
                        friends[uid].append(myinfo)
                        finfo={"uid":uid,"cid":cid,"time":time.time()}
                        if fid not in friends:
                            friends[fid]=[]
                        friends[fid].append(finfo)
                        #{'id': 1, "member": ['zzh', 'test'], "msgs": [{"sid": "zzh", "content": "114514", "time": 123}}
                        msginfo={'id':cid,"member":[uid,fid],"msgs":[{"sid":uid,"content":"我已成功添加你为好友！","time":time.time()}]}
                        chatdataU2U[cid]=msginfo
                        rdata={"status":"添加成功","type":"addFriend","code":200,"cid":cid}
                        await nowcli.send(json.dumps(rdata))
                        rdata={"status":uid+"将你添加到好友","type":"addFriend","code":200,"cid":cid}
                        if fid in clients:
                            await clients[fid].send(json.dumps(rdata))
                        db.write_data(friends,"friends")
                case "ai":
                    newmess=mes['content']
                    this,myaimes=ai.quest(myaimes,newmess)
                    rdata={"status":"ai回答","type":"ai","code":200,"content":this}
                    await nowcli.send(json.dumps(rdata))
                case "useAiChat":
                    tempaimes=[]
                    cutmes=[]
                    cid=mes['cid']
                    if(cid not in chatdataU2U):
                        continue
                    msgs=chatdataU2U[cid]['msgs']
                    if(len(msgs)>20):
                        #截取后20条到倒数第二条
                        cutmes=msgs[-20:]
                    else:
                        cutmes=msgs
                    for i in cutmes:
                        role="assistant"
                        if(i['sid']!=uid):
                            role="user"
                        content=i['content']
                        tempaimes.append({"role":role,"content":content})
                    aicontent,_t=ai.quest(tempaimes,msgs[-1]['content'])
                    rdata={"status":"ai建议","type":"useAiChat","code":200,"content":aicontent}
                    await nowcli.send(json.dumps(rdata))
            #把数据保存
            db.write_data(chatdataU2U,"chatdataU2U")
    # 如果客户端断开连接，则从clients中删除该客户端，并从users中删除该用户的登录信息
    except websockets.exceptions.ConnectionClosedOK:
        print("Connection closed", nowcli)
        del clients[uid]


# 异步函数，启动服务器
async def start_server():
    server = await websockets.serve(
        main,
        "localhost", 85)  # replace with your desired host and port
    await server.wait_closed()

if __name__ == "__main__":
    # 启动服务器
    asyncio.run(start_server())
