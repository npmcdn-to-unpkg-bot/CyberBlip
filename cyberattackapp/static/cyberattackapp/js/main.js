$(document).ready(function () {
    $.get('configuration/', function (data) {
        window.configs = JSON.parse(data);
    }).done(
        function () {
            new FrameRoot($("body")).init();
        }
    );
});
