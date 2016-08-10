function FrameRoot(selector){
    Frame.call(this, selector);
}
FrameRoot.prototype = Object.create(Frame.prototype);
FrameRoot.prototype.__super__frame__root = Frame;
FrameRoot.prototype.init = function () {
    this.add_component('frame_map_container', new FrameMapContainer($('#frame_map_container')), true);
    this.add_component('frame_attack_table_container', new FrameAttackTableContainer($("#frame_attack_table_container")), true);
    this.__super__frame__root.prototype.init.call(this);

    var data = {
        'timestamp': '24:00:00',
        'organization': 'a really really loooooooooooooooooooooooooooooooooooooooooooong name',
        'attacker_location': 'japan',
        'ip': '192.168.56.104',
        'target_location': '45.952129, -68.749712',
        'service': 'SSH',
        'port': '42'
    };
    this.components['frame_attack_table_container'].handle('add_attack_row', data);
    this.components['frame_map_container'].handle('attack', {'latitude': 45.952129, 'longitude': -68.749712, 'info': data})
};