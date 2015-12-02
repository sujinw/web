/// <reference path="../common/paging.js" />
var mutiAlbum = {
    paging: null,
    Init: function () {
        var $page = $("#page");
        var category = $page.attr("category");
        var tag = $page.attr("tag");

        this.paging = new Paging("mobile_category_album_list_more");
        this.paging.Init($(".get-more"), $("ul.tagAlbum_bd"), {
            page: 2,
            per_page: 10,
            category: category,
            tag: tag
        });
        this.BindEvent();
    },
    BindEvent: function () {
        $(".tagAlbum_bd").on("click", ".albumWorks", function () {
            var url = this.attributes["data_url"];

            if (url) {
                location.href = url.nodeValue;
            }
        });
    }
};

mutiAlbum.Init();
