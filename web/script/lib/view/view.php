<?php
$viewimport = [];
class view
{
    // 定义一个静态函数，用于生成HTML的头部
    public static function header($title = "", $oh = "")
    {
        global $config;
        global $navitems;
        global $comname;
        $title = $title . $comname;
        // 输出HTML的头部
        echo "<!DOCTYPE html>\n";
        echo "<head>\n";
        // 引入头部文件
        include includeViewer("header");
        // 输出标题
        echo "\n<title>", $title . "</title>\n";
        // 输出oh变量
        echo $oh;

        echo "</head>\n";
        // 引入导航文件
        include includeViewer("nav");
        // 输出容器
        echo "<div class='main'>";
    }
    // 定义一个静态函数，用于生成HTML的尾部
    public static function foot()
    {
        // 输出容器结束
        echo "</div>";
        // 引入尾部文件
        include includeViewer("foot");
        view::import();
    }
    // 定义一个静态函数，用于生成图标
    public static function icon($name)
    {
        // 返回图标
        return "<i class='bi bi-$name'></i>";
    }
    // 定义一个静态函数，用于生成jsMdLt
    public static function jsMdLt($id = "pFace", $text)
    {
        // 输出JSMarkdown解析器
        echo "
        <script>
        document.getElementById('$id').innerHTML = marked.parse(`" . str_replace("`", "\`", addslashes($text)) . "`);
        </script>";
    }
    public static function jsMdLt_GetOnly($id = "pFace", $noecho = 0)
    {
        // 输出JSMarkdown解析器
        $s = "
        <script>
        document.getElementById('$id').innerHTML = marked.parse(document.getElementById('$id').innerHTML);
        </script>";
        if ($noecho) {
            return $s;
        } else {
            echo $s;
        }
    }
    public static function alert($text, $type = "info", $currenttime = 5000)
    {
        global $viewimport;
        $id = "alert" . time() . rand(1000, 9999) . rand(1000, 9999);
        $viewimport['alert'] = "<div class='alert alert-$type' role='alert' id='$id'>
        $text" .
            //五秒后使用JS删除这个元素
            "<script>setTimeout(function(){document.getElementById('$id').remove();},$currenttime);</script></div>"
            . $viewimport['alert'];
    }
    public static function message($text, $title = '消息', $icon = "bell", $time = "刚刚")
    {
        global $viewimport;
        $icon = view::icon($icon);
        $id = "message" . time() . rand(1000, 9999) . rand(1000, 9999);
        $viewimport['messagebox'] =  <<<EOF
        <div class="toast fade show" role="alert" aria-live="assertive" aria-atomic="true" id="$id">
            <div class="toast-header">
            $icon
            <strong class="me-auto">$title</strong>
            <small class="text-muted">$time</small>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            $text
        </div>
        </div>
        EOF . $viewimport['messagebox'];
    }
    public static function import()
    {
        global $viewimport;
        if ($viewimport['messagebox']) {
            echo "<div class=\"toast-container messagebox\" id='messageboxbox'>" . $viewimport['messagebox'] . "</div>";
            $viewimport['messagebox'] = "";
        } else {
            echo "<div class=\"toast-container messagebox\" id='messageboxbox'></div>";
        }
        if ($viewimport['alert']) {
            echo "<div class=\"top-pos\" id='alertboxbox'>" . $viewimport['alert'] . "</div>";
            $viewimport['alert'] = "";
        } else {
            echo "<div class=\"top-pos\" id='alertboxbox'></div>";
        }
        if ($viewimport['js']) {
            echo "<script>" . $viewimport['js'] . "</script>";
            $viewimport['js'] = "";
        }
        if ($viewimport['css']) {
            echo "<script>" . $viewimport['css'] . "</script>";
            $viewimport['css'] = "";
        }
    }
    public static function B404()
    {
        include includePage("error/404");
        view::import();
        exit;
    }
    public static function B403()
    {
        include includePage("error/403");
        view::import();
        exit;
    }

    public static function aceeditor($code = "", $language = "c_cpp", $rl = 0, $outname = "")
    {
        global $editorthemeid;
        $code = str_replace("`", "\`", $code);
        global $viewimport;
        $id = 0;
        if (!$viewimport['temp']['acecnt']) $viewimport['temp']['acecnt'] = 1;
        else $id = $viewimport['temp']['acecnt']++;
        if ($outname == "") {
            $outname = "ace-$id";
        }
        echo <<<HTML
        <input id="ace-$id" name="$outname" type="hidden">
        <pre id='codeEditor{$id}' class="ace_editor" style="min-height:320px"><s:textarea class="ace_text-input"   cssStyle="width:97.5%;height:320px;"/></pre>
        <script>
        initEditor($id,'$language',$rl);
        editors[$id].insert(`$code`);
        editors[$id].setTheme("ace/theme/$editorthemeid");
        </script>
HTML;
        return $id;
    }
    public static function chart($vals)
    {
        echo "<canvas id=\"chart-" . ($vals['id'] ? $vals['id'] : "") . "\"></canvas>";
        echo "<script>showChart(`" . json_encode($vals) . "`)</script>";
    }
}
$myThemeCfg = [];
$myThemeID = 'light';
$editorthemeid = "tomorrow";
class theme
{
    static public function getCfg_user($userid)
    {
        return DB::getdata("theme/user/$userid");
    }
    static public function getCfg_Common($id)
    {
        return DB::getdata("theme/common/$id");
    }
    static public function solveid($id)
    {
        return explode("/", $id);
    }
    static public function changemy($newid)
    {
        global $myThemeID;
        if ($newid !== 'self' && theme::getCfg_Common($newid) === []) return false;
        $myThemeID = $newid;
        return theme::saveChange();
    }
    static public function changeid($neweid)
    {
        global $editorthemeid;
        $editorthemeid = $neweid; //编辑器主题
        return theme::saveChange();
    }

    static public function saveChange()
    {
        global $myThemeCfg, $myThemeID, $editorthemeid;
        $cfgU = array(
            "theme" => $myThemeID,
            "selfset" => $myThemeID === 'self' ? $myThemeCfg : [],
            "editortheme" => $editorthemeid,
        );
        return DB::putdata("theme/user/" . user::read()['name'], $cfgU);
    }
    static public function init()
    {
        global $mypower, $myThemeCfg, $myThemeID, $editorthemeid;
        if ($mypower <= 0) {
            $myThemeCfg = theme::getCfg_Common("light");
        } else {
            $mycfg = theme::getCfg_user(user::read()['name']);
            if (empty($mycfg)) {
                $myThemeCfg = theme::getCfg_Common("light");
                $myThemeID = 'light';
            } else {
                if ($mycfg['theme'] === 'self') {
                    $myThemeCfg = $mycfg['selfset'];
                    $myThemeID = 'self';
                } else {
                    $myThemeCfg = theme::getCfg_Common($mycfg['theme']);
                    $myThemeID = $mycfg['theme'];
                }
            }
            if ($mycfg['editortheme']) {
                $editorthemeid = $mycfg['editortheme'];
            }
        }
        return 1;
    }
    static public function css($mycfg = [])
    {
        if ($mycfg === []) {
            global $myThemeCfg;
            $mycfg = $myThemeCfg;
        }
        $frontcolor = $mycfg['frontcolor'];
        $backcolor = $mycfg['backcolor'];
        $subbackcolor = $mycfg['subbackcolor'] ?? 'rgba(255, 255, 255, 0.9)';
        $activecolor = $mycfg['activecolor'];
        $barcolor = $mycfg['barcolor'];
        $barfcolor = $mycfg['barfcolor'];
        return <<<CSS
:root{
    --frontcolor: $frontcolor;
    --backcolor: $backcolor;
    --subbackcolor: $subbackcolor;
    --activecolor: $activecolor;
    --barcolor: $barcolor;
    --barfcolor: $barfcolor
}
body{
    overflow-x: hidden;
    color: $frontcolor;
    background:none;
    padding-left:60px;
}
body::before{
    content: "";
    position: fixed;
    top:0;
    left:0;
    height: 100vh;
    width: 100vw;
    z-index: -1;
    background: $backcolor;
    background-size:cover;
    opacity:0.8;
}

.navtopc{
    background: $barcolor;
    color: $barfcolor;
}

.navmainc{
    background: $backcolor;
    color:$frontcolor;
}

CSS;
    }
}
