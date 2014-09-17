var BackgroundHandler = {
    isAuth: null,
    objectID: null,
    nonce: null,
    interval: null,
    checkNotificationsInterval: null

}

BackgroundHandler.init = function() {
    Storage.set("isAuth", null);
    Storage.set("objectID", null);
    Storage.set("nonce", null);
    Storage.set("interval", 6000);

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
        Teknoseyir.checkNotifications();
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
}

BackgroundHandler.init();