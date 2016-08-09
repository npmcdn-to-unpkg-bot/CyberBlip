function Component(selector) {
    this.selector = selector;
    this.parent = null;
}
Component.prototype.init = function () {
    /* do nothing */
};
Component.prototype.show = function () {
    this.selector.removeClass('hidden');
};
Component.prototype.hide = function () {
    this.selector.addClass('hidden');
};
Component.prototype.enable = function () {
    this.selector.prop('disabled', false);
};
Component.prototype.disable = function () {
    this.selector.prop('disabled', true);
};
Component.prototype.resize = function (width, height, speed) {
    var args = {};
    if (width){
        args['width'] = width;
    }
    if (height){
        args['height'] = height;
    }
    if (speed){
        args[speed] = speed;
    }
    this.selector.stop(true).animate(args, speed);

 };
Component.prototype.handle = function (event, data) {
    if (this.parent){
        this.parent.handle(event, data);
    }
};
Component.prototype.set_parent = function (parent) {
    this.parent = parent;
};
