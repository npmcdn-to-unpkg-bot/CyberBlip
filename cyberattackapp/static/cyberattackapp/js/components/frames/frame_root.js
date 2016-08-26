function FrameRoot(selector){
    Frame.call(this, selector);
    this.timeouts = [];
    this.filter = '';
}
FrameRoot.prototype = Object.create(Frame.prototype);
FrameRoot.prototype.__super__frame__root = Frame;
FrameRoot.prototype.init = function () {
    this.add_component('frame_map_container', new FrameMapContainer($('#frame_map_container')), true);
    this.add_component('frame_attack_table_container', new FrameAttackTableContainer($("#frame_attack_table_container")), true);
    this.__super__frame__root.prototype.init.call(this);
    this.handle('update_attacks');
    (function(instance){
        setInterval(function(){
            instance.handle('update_attacks')
        }, 300000);
    })(this);
};
FrameRoot.prototype.handle = function (event, data) {
    if (event === 'update_attacks') {
        for (var i = 0; i < this.timeouts.length; i++){
            clearTimeout(this.timeouts[i]);
        }
        this.timeouts = [];
        (function(instance){
            $.get('cyberattacks', instance.filter, function (attack_data) {
                var start_time = new Date();
                start_time = new Date(start_time.getTime() + start_time.getTimezoneOffset() * 60000);
                start_time.setMinutes(start_time.getMinutes() - 5);
                attack_data = JSON.parse(attack_data);
                for (var i = 0; i < attack_data.length; i++){
                    var attack = attack_data[i];
                    var timestamp = String(attack['timestamp']).split('T');
                    timestamp = timestamp[1].split(':');
                    timestamp.splice(-1, 1, timestamp[timestamp.length - 1].split('Z'));
                    timestamp = [timestamp[0], timestamp[1], String(timestamp[2]).split(',')[0]];
                    var this_time = new Date();
                    this_time = new Date(this_time.getTime() + this_time.getTimezoneOffset() * 60000);
                    this_time.setHours(start_time.getHours());
                    this_time.setMinutes(Number(String(timestamp[1])));
                    this_time.setSeconds(Number(String(timestamp[2])));
                    attack['timestamp'] = this_time;
                    (function(curr_attack){
                        if ((this_time.getTime() - start_time.getTime()) >= 0){
                            var timeout = setTimeout(function(){
                                instance.handle('attack', curr_attack);
                            }, (this_time.getTime() - start_time.getTime()));
                            instance.timeouts.push(timeout, curr_attack);
                        }
                    })(attack);
                }
            });
        })(this);
    }
    else if (event === 'attack') {
        this.components['frame_attack_table_container'].handle('add_attack_row', data);
        this.components['frame_map_container'].handle('attack',
            {
                'attacker_latitude': data['attacker_latitude'],
                'attacker_longitude': data['attacker_longitude'],
                'target_latitude': data['target']['latitude'],
                'target_longitude': data['target']['longitude'],
                'info': data
            });
    }
    else if (event === 'apply_filter') {
        this.filter = data;
        this.handle('update_attacks');
    }
};