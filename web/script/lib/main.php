<?php
function includeLib($libname)
{
    return "./script/lib/$libname.php";
}
function includePage($pagename)
{
    return "./script/page/$pagename.php";
}
function includeViewer($name)
{
    return "./script/view/$name.php";
}
function includeC($name)
{
    return "./script/$name.php";
}
function arrayDecode($array,$llimit=8128)
{
    $req = [];
    $safeneedle = ["answer", "face"];
    foreach ($array as $k => $v) {
        if (is_array($v)) {
            $req[$k] = arrayDecode($v);
        } else {
            if(strlen($v)>$llimit){
                $v=substr($v,0,$llimit)."...";
            }
            $v = htmlspecialchars($v);
            if (!in_array($k, $safeneedle)) $req[$k] = addslashes($v);
            else $req[$k] = $array[$k];
        }
    }
    return $req;
}
function requestDecode()
{
    $req_all = [];
    $_GET=arrayDecode($_GET,2560);
    $_POST=arrayDecode($_POST,1024*10);
    foreach ($_COOKIE as $k => $v) {
        $v = htmlspecialchars($v);
        $_COOKIE[$k] = addslashes($v);
    }
    return $req_all;
}
function alert($msg)
{
    echo "<script>alert('$msg')</script>";
}
function jsjump($u)
{
    echo "<script>window.location='$u'</script>";
}
function jump_JS($u) {
    return "window.location='$u'";
}
function jsreload()
{
    echo "<script>window.location.reload()</script>";
}

function getstatic($name)
{
    return file_get_contents("static/$name");
}
function nav_icon($id, $id2)
{
	if ($id2 === Router::getUri()) {
		return view::icon($id . "-fill");
	} else {
		return view::icon($id);
	}
}
$navitems=array("help");//设置导航栏的内容
$comname="ZIM-Polling";//设置网站名称
if ($comname === '') $comname = 'default';
include includeLib("basic/data");
include includeLib("basic/time");
include includeLib("basic/router");
include includeLib("basic/user");
include includeLib("view/view");