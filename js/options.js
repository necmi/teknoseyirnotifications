$(function() {
    $("#exit").click(function() {
        chrome.storage.local.clear();
        $(this).removeClass("btn-danger").addClass('btn-success').text("Done");
    });

    Storage.get('interval', function(item) {
        if (item.interval) {
            $(".min").html(item.interval / 1000 / 60);

            $(".slider").slider('setValue', item.interval / 1000 / 60).on('slideStop', function(ev) {
                Storage.set('interval', ev.value * 1000 * 60);
                $(".min").html(ev.value)

            });

        } else {
            $(".min").html(1);
            $(".slider").slider('setValue', 1).on('slideStop', function(ev) {
                Storage.set('interval', ev.value * 1000 * 60);
                $(".min").html(ev.value)

            });
        }
    });


});