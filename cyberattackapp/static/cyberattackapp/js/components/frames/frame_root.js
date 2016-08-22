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
        }, 60000);
    })(this);
};
FrameRoot.prototype.handle = function (event, data) {
    if (event === 'update_attacks') {
        (function(instance){
            $.get('cyberattacks', instance.filter, function (attack_data) {
                var start_time = new Date();
                start_time.setMinutes(start_time.getMinutes() - 1);
                attack_data = JSON.parse(attack_data);
                for (var i = 0; i < attack_data.length; i++){
                    var attack = attack_data[i];
                    var timestamp = String(attack['timestamp']).split(':');
                    timestamp.splice(0, 1, timestamp[0].split('T'));
                    timestamp.splice(-1, 1, timestamp[timestamp.length - 1].split('Z'));
                    timestamp[0] = timestamp[0][1];
                    timestamp[2] = timestamp[2][0];
                    var this_time = new Date();
                    this_time.setHours(start_time.getHours());
                    this_time.setMinutes(timestamp[1]);
                    this_time.setSeconds(timestamp[2]);
                    attack['timestamp'] = this_time;
                    (function(curr_attack){
                        if ((this_time.getTime() - start_time.getTime()) >= 0){
                            var timeout = setTimeout(function(){
                                instance.handle('attack', curr_attack);
                            }, (this_time.getTime() - start_time.getTime()));
                            instance.timeouts.push(timeout);
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
                'target_latitude': data['target_latitude'],
                'target_longitude': data['target_longitude'],
                'info': data})
    }
    else if (event === 'apply_filter') {
        for (var i = 0; i < this.timeouts.length; i++){
            clearTimeout(this.timeouts[i]);
        }
        this.timeouts = [];
        this.filter = data;
    }
};