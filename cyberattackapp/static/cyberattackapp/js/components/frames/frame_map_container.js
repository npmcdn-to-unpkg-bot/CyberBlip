function FrameMapContainer(selector){
    Frame.call(this, selector);
}
FrameMapContainer.prototype = Object.create(Frame.prototype);
FrameMapContainer.prototype.__super__frame__map__container__ = Frame;
FrameMapContainer.prototype.init = function () {
    this.add_component('map', new MapLeaflet($('#map'), 45.320313, -69.049089, 7, true), true);
    this.__super__frame__map__container__.prototype.init.call(this);
};
FrameMapContainer.prototype.handle = function (event, data) {
    if (event === 'attack') {
        this.components['map'].add_attack(
            data['attacker_latitude'], data['attacker_longitude'],
            data['target_latitude'], data['target_longitude'], data['info']
        );
    }
};
