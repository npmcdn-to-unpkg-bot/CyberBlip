function FrameRoot(selector){
    Frame.call(this, selector);
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
        var start_time = null;
        (function(instance){
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
                        instance.handle('attack', attack);
                        start_time = this_time
                    }
                    else {
                        (function(curr_attack){
                            setTimeout(function(){
                                instance.handle('attack', curr_attack);
                            }, (this_time - start_time));
                        })(attack);
                    }
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
};