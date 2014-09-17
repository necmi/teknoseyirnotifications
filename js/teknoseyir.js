window.Teknoseyir = {
    url: "http://teknoseyir.com/wp-admin/admin-ajax.php",
    interval: 60000,
    objectID: null,
    isAuth: false,
    nonce: null
};

Teknoseyir.init = function(name) {
    var that = this;

    Storage.set('user', name);

    this.updateParams(name).done(function() {
        that.login();
        that.hideForm();
    });
};

Teknoseyir.updateParams = function(name) {
    var that = this;
    this.loader('start');

    return $.ajax({
        url: 'http://teknoseyir.com/u/' + name,
        type: 'GET'
    }).done(function(res) {

        var obj = that.getUser(res, name);
        that.nonce = that.getNonce(res);

        that.objectID = obj.objectID;
        that.isAuth = obj.isExist;

        Storage.set("isAuth", obj.isExist);
        Storage.set("objectID", obj.objectID);
        Storage.set("nonce", that.nonce);

    }).fail(function() {
        Storage.set("isAuth", false);
        that.showForm();
        $(".status").append("<div class='alert alert-warning'>Kullanici ismini kontrol edin.</div>");

        setTimeout(function() {
            $(".status").empty();
        }, 3000);

    }).always(function() {
        $(".login").button('reset');
        that.loader('stop');
    });
};


Teknoseyir.login = function() {
    return this.get();
};

Teknoseyir.get = function() {
    var that = this;

    return $.ajax({
            url: this.url,
            type: 'POST',
            dataType: 'json',
            data: {
                action: "bildirim_btn",
                object_id: that.objectID
            },
        })
        .done(function(response) {

            $(".notification-list").empty();

            if (response) {

                $(".notification-list").append(response.data);

                that.enableTooltips();
            }

            that.fixLinks();

        }).fail(function() {
            $(".status").append("<div class='alert alert-warning'>Hata.</div>");
        });
};

Teknoseyir.fixLinks = function() {
    $("a").click(function() {
        var url = $(this).attr("href");
        if (url != "#")
            chrome.tabs.create({
                url: url
            });
    });
};

Teknoseyir.enableTooltips = function() {

    var length = $("[data-toggle]").length;
    var i = 0;

    $(".bildirim_sil").remove();

    while (length > i) {
        $($("[data-toggle]").get(i)).tooltip();
        i = i + 1;
    }

    $(".bildirim_tumu a").addClass('btn btn-default btn-sm btn-block');
    $(".notification-list").find("li.bildirim").last().css("border", "0");
};


Teknoseyir.getNonce = function(res) {
    var str = res;
    var patt = new RegExp('heartbeatSettings.+\;');
    var ress = patt.exec(str);

    ress = ress[0].split("nonce\":")[1];

    var patt2 = new RegExp('\".+\"');
    var ress2 = patt2.exec(ress)[0];
    ress2 = ress2.replace('\"', "").replace('\"', "");

    return ress2;
};

Teknoseyir.getUser = function(res, name) {
    var str = res;
    var patt = new RegExp("author-[0-9]+");
    var ress = patt.exec(str);
    ress = ress[0].split("-")[1];

    var checkName = function(name) {
        var patt = new RegExp("author-[a-z]+");
        var ress = patt.exec(str);
        ress = ress[0].split("-")[1];

        if (ress == name)
            var isExist = true;
        else
            var isExist = false;
        return isExist;
    }

    var isExist = checkName(name);

    return {
        isExist: isExist,
        objectID: ress
    }
};

Teknoseyir.loader = function(command){
    var loader = "<i class='fa fa-gear fa-spin fa-2x'></i>";

    if (command == "start")
        $(".statusL").empty().append(loader);
    else if(command == "stop")
        $(".statusL").empty();
};

Teknoseyir.hideForm = function() {
    $(".loginForm").addClass("hidden");
    $(".notifications").removeClass('hidden');
};

Teknoseyir.showForm = function() {
    $(".loginForm").removeClass("hidden");
    $(".notifications").addClass('hidden');
};