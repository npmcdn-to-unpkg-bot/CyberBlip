$(document).ready(function () {
    $.get('configuration/', function (data) {
        window.configs = JSON.parse(data);
    }).done(
        function () {
            var root_frame = new FrameRoot($("body"));
            root_frame.init();
            var start_time = null;
            $.get('', function (data) {
                var attacks = JSON.parse(data);
                for (var i = 0; i < attacks.length; i++){
                    var attack = attacks[i];
                    var timestamp = String(attack['timestamp']).split(':');
                    var this_time = new Date();
                    this_time.setHours(timestamp[0]);
                    this_time.setMinutes(timestamp[1]);
                    this_time.setSeconds(timestamp[2]);
                    this_time = this_time.getTime();
                    if (start_time === null){
                        root_frame.handle('attack', attack);
                        start_time = this_time
                    }
                    else {
                        (function(curr_attack){
                            setTimeout(function(){
                                root_frame.handle('attack', curr_attack);
                            }, (this_time - start_time));
                        })(attack);
                    }
                }
            });
        }
    );
});
