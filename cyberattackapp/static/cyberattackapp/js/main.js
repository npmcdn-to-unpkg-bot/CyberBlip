$(document).ready(function () {
    $.get('configuration/', function (data) {
        window.configs = JSON.parse(data);
    }).done(
        function () {
            var root_frame = new FrameRoot($("body"));
            root_frame.init();
        }
    );
});
