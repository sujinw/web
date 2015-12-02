/**
 * Created by slade on 2015/2/8.
 */
function slade_up(obj, liw, num, page){
    $(obj).swipeUp(function(){
        $(obj).animate( $(obj).addClass('pt-page-moveFromBottomFade'),500);
        $(obj).css('top',liw*num+'px');

        if(page){
            $(page).text('2/2')
        }
    })
}
function slade_down(obj, liw, num, page){
    $(obj).swipeDown(function(){
        $(obj).animate($(obj).addClass('pt-page-moveFromTopFade'),500);
        $(obj).css('top',liw*num+'px');
        if(page){
            $(page).text('1/2')
        }
    })
}
function tervalTop(obj, length, H){
    var nowTop = 0;
    var Obj = $(obj);
    var iCount = length*H;
    var oBtn = true;

    setInterval(function(){
        if(oBtn){
            nowTop -= H;
        }else{
            nowTop += H;
        }
        iCount++;
        Obj.animate(Obj.addClass('pt-page-moveFromBottomFade'),500);
        Obj.css('top',nowTop + 'px');
        if(((Obj.height()-H) + nowTop) == 0 || nowTop == 0){
            oBtn = !oBtn;
        }
    },3000);
}
function tj(){
    var Li = $('.tuijian li'), array = [], ul = $('.tuijian ul');
    for(var i=0; i< Li.length; i++){
        array[i] =  Li.eq(i).html();
        array[i] =  "<div class='li_warp'><li>" + array[i] +"</li></div>";
    }
    Li.remove();
    for(var k = 0; k < array.length; k++) {
        ul.append(array[k]);
    }
    var Li_warp = $('.li_warp');
    for(var n = 0; n <= Li_warp.length; n++){
        //Li_warp.eq(n).css({'bottom': n*3 + 'px','left':n*3 + 'px','z-index':n})
    }
    ul.attr('id','slade_pages')
}
function bbs_hotornew_active(){
    var tabs_li = $("#bbs_hotornew_title li"),hot_title = $("#bbs_hotornew_title"),bbs_hotornew_more = $("#bbs_hotornew_more a");

    if(tabs_li.eq(0).hasClass("ui-state-active")){
        hot_title.removeClass("bbs_new_active");
        hot_title.addClass("bbs_hot_active");
        bbs_hotornew_more.attr("href",tabs_li.eq(0).attr("data-url"));
        bbs_hotornew_more.html("查看更多热门帖子");
    }else if(tabs_li.eq(1).hasClass("ui-state-active")){
        hot_title.removeClass("bbs_hot_active");
        hot_title.addClass("bbs_new_active");
        bbs_hotornew_more.attr("href",tabs_li.eq(1).attr("data-url"));
        bbs_hotornew_more.html("查看更多新发帖子");
    }
}
function bbs_items_ul(){
    var ul = $(".bbs_items ul"),ul_p = ul.children("p"),ul_li  = $(".bbs_items ul li")

    for(var i=0; i<=ul.length; i++){
        $("#bbs_items_ul_"+i).css({"display":"block","height":(ul_li.height()*$("#bbs_items_ul_"+i+" li").length)+"px"})
        $("#bbs_items_ul_"+i).addClass("on");
    }
    ul_p.children("i").addClass("rotate_180");
    ul_p.tap(function(){
        var index = ul_p.index(this),box=$("#bbs_items_ul_"+(index+1));
        if(box.hasClass("on")){
            $(this).children("i").removeClass("rotate_90").removeClass("rotate_180");
            box.css("height","0").removeClass("on").addClass("off");
            $(this).children("i").addClass("rotate_90");
        }else if(box.hasClass("off")){
            box.css("height",(ul_li.height()*$("#bbs_items_ul_"+(index+1)+" li").length)+"px").removeClass("off").addClass("on");
            $(this).children("i").addClass("rotate_180");
        }
    })
}
$(document).ready(function(){

    var Li_w = $('.hot_contents li').height();
    $('.hot_contents_box').css('height',Li_w*6+"px");
    $('.hot_box').css('height',Li_w*6+70+"px");
    slade_up('.hot_contents',-Li_w,6, '.hot_pages');
    slade_down('.hot_contents',-Li_w,0, '.hot_pages');
    tervalTop('.gonggao_ul', 11, $('.gonggao_ul li').height());
    $("#pic_index ul").attr("id","slider");
    $('#slider').slider({loop:false, autoplay:false});
    tj();

    bbs_hotornew_active();
    bbs_items_ul();

    $(".icon-search").click(function(){
        if(document.getElementById("slade_search").style.display == "none"){
            $("#slade_search").css("display","block")
        }else{
            $("#slade_search").css("display","none")
        }
    });

    $("#bbs_tabs").on("swipe",function(e){
        bbs_hotornew_active();
    });
    $("#bbs_tabs").on("tap",function(e){
        bbs_hotornew_active();
    });


    $('#nav').navigator();
    $("#bbs_tabs").tabs();
    $('#gotop').gotop();
    $('body').addSearch({"formAction":"m.php","inputName" : "m","className" : "slade_search","name" : "m","display" : "none","page": true,"fix" : true,"history" : true})
    $("body").popover({"contents":["发帖子"]});
    $("#app_list").slider({autoplay:false,loop:true,arrow:false});
    $("#slade_pages").slider({autoplay:false,loop:true,dots:false,arrow:false});

    $(".icon-search").click(function(){
        if(document.getElementById("slade_search").style.display == "none"){
            $("#slade_search").css("display","block")
        }else{
            $("#slade_search").css("display","none")
        }
    });
});










