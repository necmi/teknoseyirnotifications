$(function() {
    var loginOptions = {},
        $loginForm = $('loginForm'),
        $loginButton = $('.loginForm .login'),
        $userName = $('.userName');

    Storage.get('isAuth', function(item) {
        if (item.isAuth) {
            Teknoseyir.hideForm();
            Storage.get('user', function(item) {
                var name = item.user;
                Teknoseyir.init(name);
            });
        } else{
            Teknoseyir.showForm();
        }
    });

    $loginButton.click(function(event) {

        $(".login").button('loading');

        var userName = $userName.val();

        if (userName) {
            Teknoseyir.init(userName);
        }
    });

    chrome.browserAction.setBadgeText({
        text: ""
    });

    $("a").click(function() {
        var url = $(this).attr("href");
        if (url != "#")
            chrome.tabs.create({
                url: url
            });
    });
});