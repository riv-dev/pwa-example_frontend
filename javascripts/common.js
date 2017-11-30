$(function() {
    $.getJSON( "https://api.kenle.info/pwa-example/api/announcement", function(data) {
        $( "p.announcement" ).html(data.message);
    });
});