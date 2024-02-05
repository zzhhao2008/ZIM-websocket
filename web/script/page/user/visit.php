<?php
$uid=$_GET['uid'];
$userconfig = user::queryUser($uid);
if(empty($uid)){
    view::B404();
    exit;
}
view::header($userconfig['nick']."的个人空间");

?>
<p>
<h2>Welcome,I'm <?= user::queryUserNick($uid,1) ?>!</h2>
<h5><?= user::queryUserNick($uid,1)?>的个人空间</h5>
</p>
<ul class="list-group">
    <li class="list-group-item list-group-item-info">Rating:<?= $userconfig['rating'] ?></li>
    <li class="list-group-item list-group-item-danger">ID:<?= $uid ?></li>
    <li class="list-group-item list-group-item-warning">
        <h5>个人介绍</h5><?= $userconfig['about'] ?>
    </li>
    <li class="list-group-item list-group-item-light">
        <h5>动态</h5>
        <div>
            <?php
            usort($userconfig['dt'], function ($a, $b) {
                //按时间从大到小
                return $b['time'] - $a['time'];
            });
            foreach ($userconfig['dt'] as $v) {
                $date = date("Y-m-d H:i:s", $v['time']);
                echo <<<HTML
<div class="card">
    <div class="card-body">
        <h5 class="card-title">{$date}</h5>
        <p class="card-text">{$v['art']}</p>
    </div>
</div>
HTML;
            } ?>
        </div>
    </li>
</ul>
<?php view::foot(); ?>