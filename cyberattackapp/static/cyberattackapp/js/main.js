$(document).ready(function () {
    $.get('configuration/', function (data) {
        window.configs = JSON.parse(data);
    }).done(
        function () {
            var root_frame = new FrameRoot($("body"));
            root_frame.init();
            $.get('', function (data) {
                var attacks = JSON.parse(data);
                for (var i = 0; i < attacks.length; i++){
                    var attack = attacks[i];
                    var timestamp = attack['timestamp'];
                    root_frame.handle('attack', attack);
                }
            });
        }
    );
});
