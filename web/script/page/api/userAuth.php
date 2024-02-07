<?php
if($_GET['id']&&$_GET['pas']){
    $thisup=user::queryUser($_GET['id']);
    if(md5($thisup['llt'] . $thisup['password'])==$_GET['pas']){
        $token=md5($thisup['llt'] . $thisup['password'].time());
        $thisup['token']=$token;
        $thisup['id']=$_GET['id'];
        echo json_encode($thisup,JSON_UNESCAPED_UNICODE);
        exit;
    }

}
echo "No";