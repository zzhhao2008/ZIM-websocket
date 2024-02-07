<?php
$usernames=DB::scanName("user/");
$rdata=array();
foreach($usernames as $username){
    $thisup=user::queryUser($username);
    $rdata[$username]=array(
        "id"=>$username,
        "name"=>$thisup['nick'],
    );
}
echo json_encode($rdata,JSON_UNESCAPED_UNICODE);