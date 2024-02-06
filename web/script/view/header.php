<meta charset="UTF-8">
<link rel="shortcut icon" href="/icon.jpg">
<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=0.5, maximum-scale=2.0, user-scalable=yes" />

<style>
    <?=theme::css();?>
</style>

<link rel="stylesheet" href="/static/bootstrap/5.3.2/css/bootstrap.min.css">
<link rel="stylesheet" href="/static/css/public.css">
<link rel="stylesheet" href="/static/css/tool.css">
<link rel="stylesheet" href="/static/css/nav.css">
<link rel="stylesheet" href="/static/css/msg-main.css">
<link rel="stylesheet" href="/static/bootstrap/icons/bootstrap-icons.css">

<script src="/static/bootstrap/5.3.2/js/bootstrap.bundle.js"></script>
<script src="/static/js/view/view.js"></script>
<script src="/static/js/ace/src-min/ace.js"></script>
<script src="/static/js/ace/aceinit.js"></script>
<script src='/static/js/md/markedjs.js'></script>
<script>import('/static/js/md/mathtex.js');</script>
<script src="http://116.62.220.226/static/js/chart.js"></script>
<script src="/static/js/view/chart-require.js"></script>
<?php
if(user::read()['name']){
    echo '<script src="/static/js/msg/client.js"></script>
<script src="/static/js/msg/view.js"></script>';
    echo "<script>var userid=`".user::read()['name']."`</script>";
}
;

