<?php
//用户系统
Router::login("goodspeak", "api/goodspeak");
Router::login("visituser", "user/visit");
Router::login("profile", "user/profile");//只有登陆后才能访问
Router::login("logup", "profile");
Router::login("change", "user/change");
Router::login("themeset", "user/themeset");

//主要用户界面
Router::login("/", "function/message");
Router::login("fmanage", "function/fmanage");

Router::guest("logup", "user/logup");//默认注册页

Router::admin("user_manage", "admin/user/manage");
Router::admin("user_edit", "admin/user/edit");
Router::admin("user_cr_rm", "admin/user/crm");
