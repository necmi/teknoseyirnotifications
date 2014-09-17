var Storage = {

}

Storage.get = function(key, callback) {
    chrome.storage.local.get(key, function(item) {
        callback(item)
    });
}

Storage.set = function(key, value) {
    var obj = {};
    obj[key] = value;
    chrome.storage.local.set(obj, function() {
    	if(arguments[2])
    		arguments[2](obj);
    });
}