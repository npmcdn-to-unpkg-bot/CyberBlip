function Button(selector) {
    Component.call(this, selector);
}
Button.prototype = Object.create(Component.prototype);
Button.prototype.__super__button__ = Component;
Button.prototype.init = function () {
    this.__super__button__.prototype.init.call(this);
    (function (instance) {
        instance.selector.click(function () {
            instance.execute();
        });
    })(this);
};
Button.prototype.execute = function () {
    /* do something */
};
Button.prototype.set_hover = function (hover_in, hover_out) {
    this.selector.hover(hover_in, hover_out);
};

