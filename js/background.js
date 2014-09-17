var BackgroundHandler = {
    isAuth: null,
    url: "http://teknoseyir.com/wp-admin/admin-ajax.php",
    objectID: null,
    nonce: null,
    interval: null,
    checkNotificationsInterval: null

}

BackgroundHandler.init = function() {
    Storage.set("isAuth", null);
    Storage.set("objectID", null);
    Storage.set("nonce", null);
    Storage.set("interval", 60000);

    this.extend();
};

BackgroundHandler.extend = function() {
    var that = this;

    chrome.storage.onChanged.addListener(function(changes, area) {

        for(var i in changes)
            that.setItem(changes, i);


        if (that.isAuth){
            that.stopCheckNotifications();
            that.startCheckNotifications();
        }
        if (that.interval == 0)
            that.stopCheckNotifications();
    });
};

BackgroundHandler.startCheckNotifications = function() {
    var that = this;
    this.checkNotificationsInterval = setInterval(function() {
        that.checkNotifications();
    }, that.interval);
};

BackgroundHandler.stopCheckNotifications = function() {
    var that = this;

    clearInterval(this.checkNotificationsInterval);
};

BackgroundHandler.setItem = function(obj, key) {
    if (obj[key].newValue)
        BackgroundHandler[key] = obj[key].newValue;
    else if (obj[key].oldValue)
        BackgroundHandler[key] = obj[key].oldValue;
};

BackgroundHandler.checkNotifications = function() {
    var that = this;

    $.ajax({
        url: this.url,
        type: 'POST',
        dataType: 'json',
        data: {
            data: {
                "bildirim-count": "bildirim_count"
            },
            action: "heartbeat",
            screen_id: "front",
            object_id: that.objectID,
            has_focus: true,
            _nonce: that.nonce,
            interval: "60"

        },
    })
        .done(function(response) {
            chrome.notifications.clear('1', function() {});

            if (response.bildirim) {
                if (response.bildirim.count) {

                    chrome.browserAction.setBadgeText({
                        text: response.bildirim.count.toString()
                    });
                }
            }else{
                //$(".status").append("<div class='alert alert-warning'>Hata.</div>");
            }
        });
};


BackgroundHandler.init();