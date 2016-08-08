function FrameRoot(selector){
    Frame.call(this, selector);
}
FrameRoot.prototype = Object.create(Frame.prototype);
FrameRoot.prototype.__super__frame__root = Frame;
FrameRoot.prototype.init = function () {
    this.add_component('map', new MapGoogle($('#map'), 45.320313, -69.049089, 8), true);
    this.__super__frame__root.prototype.init.call(this);


    this.components['map'].set_boundaries(42.987598, -71.026628, 47.657087, -66.807878);
};
