function FrameMapContainer(selector){
    Frame.call(this, selector);
}
FrameMapContainer.prototype = Object.create(Frame.prototype);
FrameMapContainer.prototype.__super__frame__map__container__ = Frame;
FrameMapContainer.prototype.init = function () {
    this.add_component('map', new MapLeaflet($('#map'), 45.320313, -69.049089, 8), true);
    this.__super__frame__map__container__.prototype.init.call(this);
    this.components['map'].add_pulsing_blip(45.952129, -68.749712, 'test');
};
