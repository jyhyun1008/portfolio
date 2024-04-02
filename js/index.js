//마크다운 파싱
function parseMd(md){

    md = "\n"+md
    var md0 = md;
  
    //ul
    md = md.replace(/^\s*\n\*\s/gm, '<ul>\n* ');
    md = md.replace(/^(\*\s.+)\s*\n([^\*])/gm, '$1\n</ul>\n$2');
    md = md.replace(/^\*\s(.+)/gm, '<li class="before">$1</li>');
    
    //ul
    md = md.replace(/^\s*\n\-\s/gm, '<ul>\n- ');
    md = md.replace(/^(\-\s.+)\s*\n([^\-])/gm, '$1\n</ul>\n$2');
    md = md.replace(/^\-\s(.+)/gm, '<li class="before">$1</li>');
    
    //ol
    md = md.replace(/^\s*\n\d\.\s/gm, '<ol>\n1. ');
    md = md.replace(/^(\d\.\s.+)\s*\n([^\d\.])/gm, '$1\n</ol>\n$2');
    md = md.replace(/^\d\.\s(.+)/gm, '<li>$1</li>');
    
    //blockquote
    md = md.replace(/^\>\s(.+)/gm, '<blockquote>$1</blockquote>');
    md = md.replace(/\<\/blockquote\>\<blockquote\>/gm, '\n\n');
    md = md.replace(/\<\/blockquote>\n<blockquote\>/gm, '\n\n');

    md = md.replace(/\-\-\-/gm, 'ーーー')
    
    //h
    md = md.replace(/\n[\#]{6}(.+)/g, '<h6>$1</h6>');
    md = md.replace(/\n[\#]{5}(.+)/g, '<h5>$1</h5>');
    md = md.replace(/\n[\#]{4}(.+)/g, '<h4>$1</h4>');
    md = md.replace(/\n[\#]{3}(.+)/g, '<h3>$1</h3>');
    md = md.replace(/\n[\#]{2}\s([\s\S]+)[ー]{3}/g, '<div class="pflex">\n\#\# $1ーーー</div>');
    md = md.replace(/\n[\#]{2}(.+)[\:]{2}(.+)\n([^ー]+)[ー]{3}/g, '<div class="pgroup $2"><h2 class="pgroup-title">$1</h2><div class="pgroup-content">$3</div></div>');
    md = md.replace(/\n[\#]{2}(.+)\n([^ー]+)[ー]{3}/g, '<div class="pgroup"><h2 class="pgroup-title">$1</h2><div class="pgroup-content">$2</div></div>');
    md = md.replace(/\n[\#]{2}(.+)/g, '<h2>$1</h2>');
    md = md.replace(/\n[\#]{1}(.+)/g, '</div></div><div class="item_wrap"><div class="item"><h1 class="h1">$1</h1>');

    //hr
    md = md.replace(/[ー]{3}/g, '</div></div><div class="item_wrap"><div class="line">✿--✿--✿</div><div class="item">');
    
    //images with links
    md = md.replace(/\!\[([^\]]+)\]\(([^\)]+)\)[\(]{1}([^\)\"]+)(\"(.+)\")?[\)]{1}/g, '<div class="gallery"><a href="$3"><img src="$2" alt="$1" width="100%" /></a></div>');
    
    //images
    md = md.replace(/\!\[([^\]]+)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1" width="100%" />');
    
    //links
    md = md.replace(/[\[]{1}([^\]]+)[\]]{1}[\(]{1}([^\)\"]+)(\"(.+)\")?[\)]{1}/g, '<a href="$2" title="$4">$1</a>');
    
    //font styles
    md = md.replace(/[\*]{2}([^\*]+)[\*]{2}/g, '<strong>$1</strong>');
    md = md.replace(/[\*]{1}([^\*]+)[\*]{1}/g, '<i>$1</i>');
    md = md.replace(/[\~]{2}([^\~]+)[\~]{2}/g, '<del>$1</del>');

    //주석
    md = md.replace(/\n[\/]{2}(.+)/g, '');
    
    //pre
    
    var mdpos = [];
    var rawpos = [];
    let pos1 = -1;
    let k = 0;

    var diff = [0]

    while( (pos1 = md0.indexOf('\n```', pos1 + 1)) != -1 ) { 
        if (k % 2 == 0){
            rawpos[k] = pos1 + 4;
        } else {
            rawpos[k] = pos1;
        }
        k++;
    }

    let pos2 = -1;
    let l = 0;

    while( (pos2 = md.indexOf('\n```', pos2 + 1)) != -1 ) { 
        if (l % 2 == 0){
            mdpos[l] = pos2 - 1;
        } else {
            mdpos[l] = pos2 + 5;
        }
        l++;
    }

    for (var i = 0; i < mdpos.length; i++){
        if (i % 2 == 0){
            md = md.replace(md.substring(mdpos[i] - diff[i], mdpos[i+1] - diff[i]), '<pre class="code">'+md0.substring(rawpos[i], rawpos[i+1])+'</pre>');
            var mdSubStringLength = mdpos[i+1] - mdpos[i];
            var rawSubStringLength = rawpos[i+1] - rawpos[i] + '<pre class="code">'.length + '</pre>'.length;
            diff[i+2] = diff[i] + mdSubStringLength - rawSubStringLength;
        }
    }

    //code
    md = md.replace(/[\`]{1}([^\`]+)[\`]{1}/g, '<code>$1</code>');

    console.log(md)
    
    //br
    md = md.replace(/\n\n([^\n\n]+)/g, '\n<p>$1</p>');

    return md;
}

function getQueryStringObject() {
    var a = window.location.search.substr(1).split('&');
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i) {
        var p = a[i].split('=', 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
}

var qs = getQueryStringObject()
var page = parseInt(qs.p)
var article = qs.a

if (!page) {
    page = 0
}

addEventListener("DOMContentLoaded", (event) => {

if (!article) {
    if (localStorage.getItem('scroll') == 'up') {
        document.querySelector('#text-box').scrollTo(0, document.querySelector('#page-content').offsetHeight)
    }
    document.querySelector("#nav"+page).style = 'background: white;'

    if ( page < 3 ) {
        var url = "https://raw.githubusercontent.com/jyhyun1008/portfolio/main/md/"+page+'.md'
        fetch(url)
        .then(res => res.text())
        .then((out) => {
            document.querySelector("#page-content").innerHTML += parseMd(out)
        })
    } else if (page == 3) {
        var url = "https://raw.githubusercontent.com/jyhyun1008/portfolio/main/md/"+page+'.md'
        fetch(url)
        .then(res => res.text())
        .then((out) => {
            document.querySelector("#page-content").innerHTML += "<div class='tag-flex'><div class='tag social'>오픈소스 SNS</div><div class='tag ai'>딥러닝</div><div class='tag game'>Games</div><div class='tag blogging'>특수목적 블로깅</div><div class='tag template'>CSS 템플릿</div><div class='tag others'>기타</div><div>"

            document.querySelector("#page-content").innerHTML += parseMd(out)

            var projects = document.getElementsByClassName("pgroup")

            for (let i=0; i<projects.length; i++) {
                document.querySelector(".tag."+projects[i].classList[1]).innerHTML += "<div class='pgroup "+projects[i].classList[1]+"'>"+projects[i].innerHTML+"</div>"
            }
        })
    } else {
        document.querySelector("#page-content").innerHTML += "<div class='postContent'></div>"
        var url = "https://i.peacht.art/devlog?url="
        fetch(url)
        .then(res => res.text())
        .then((out) => {
            out = out.replace(/href\=\"\/jyhyun1008\//gm, 'href="./?a=wf/')
            document.querySelector(".postContent").innerHTML = out
        })
    }
} else if (article.split('/')[0] == 'wf') {
    document.querySelector("#nav4").style = 'background: white;'

    document.querySelector("#page-content").innerHTML += "<div class='postContent'></div>"
    var url = "https://i.peacht.art/devlog?url="+article.split('wf/')[1]
    fetch(url)
    .then(res => res.text())
    .then((out) => {
        document.querySelector(".postContent").innerHTML = out
    })
} else if (article.split('/')[0] == 'pj') {
    document.querySelector("#nav3").style = 'background: white;'
    var url = "https://raw.githubusercontent.com/jyhyun1008/portfolio/main/md/projects/"+article.split('pj/')[1]+'.md'
    fetch(url)
    .then(res => res.text())
    .then((out) => {
        document.querySelector("#page-content").innerHTML += parseMd(out)
    })
}
    
    // var scrollDone = false
    // var record = 0

    // window.addEventListener('wheel',(event) => {
    //     if (document.querySelector('body').offsetWidth >= 1000) {
    //         let wheel = event.wheelDeltaY;
    //         document.querySelector("#text-box").addEventListener("scrollend", (event) => {
                
    //             if (page < 4 && wheel < 0 && document.querySelector('#text-box').scrollTop >= ( document.querySelector('#page-content').offsetHeight - document.querySelector('#text-box').offsetHeight )) {
    //                 if (scrollDone && new Date() - record > 3) {
    //                     localStorage.setItem('scroll', 'down')
    //                     location.href = './?p='+(page+1)
    //                 } else if (!scrollDone) {
    //                     scrollDone = true
    //                     record = new Date()
    //                     document.querySelector('#scrollDown').style = "display: block;"
    //                 }
    //             } else if (page > 0 && wheel > 0 && document.querySelector('#text-box').scrollTop <= 0) {
    //                 if (scrollDone && new Date() - record > 3) {
    //                     localStorage.setItem('scroll', 'up')
    //                     location.href = './?p='+(page-1)
    //                 } else if (!scrollDone) {
    //                     scrollDone = true
    //                     record = new Date()
    //                     document.querySelector('#scrollUp').style = "display: block;"
    //                 }
    //             } else {
    //                 document.querySelector('#scrollUp').style = "display: none;"
    //                 document.querySelector('#scrollDown').style = "display: none;"
    //             }
    //         })
    //     }
    // })
})