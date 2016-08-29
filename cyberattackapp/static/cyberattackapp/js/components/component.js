function Component(selector) {
    /*
     * Base class of all frames and widgets.
     *
     * A Component contains methods common to all frames and widgets,
     * such as show, hide, resize, handle, and set_parent.
     *
     * All frame and widgets should prototype off the Component prototype.
     *
     * @param selector: The DOM element selector that this component represents.
     */
    this.selector = selector;
    this.parent = null;
}
Component.prototype.init = function () {
    /*
     * Do nothing by default.
     *
     * Override this to implement custom initialization.
     */
};
Component.prototype.show = function () {
    /*
     * Show this component.
     */
    this.selector.removeClass('hidden');
};
Component.prototype.hide = function () {
    /*
     * Hide this component.
     */
    this.selector.addClass('hidden');
};
Component.prototype.enable = function () {
    /*
     * Enable this component.
     */
    this.selector.prop('disabled', false);
};
Component.prototype.disable = function () {
    /*
     * Disable this component.
     */
    this.selector.prop('disabled', true);
};
Component.prototype.resize = function (width, height, speed) {
    /*
     * Resize this component.
     *
     * @param width: The width to resize to in pixels or percent.
     * @param height: The height to resize to in pixels or percent.
     * @param speed: The speed of the resizing animation in ms.
     */
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
    /*
     * Handle some event.
     *
     * By default if this component has a parent it will ask it's parent to handle the event.
     * Override this function to implement custom event handling.
     *
     * @param event: The event to handle as a String.
     * @param data: Any data involved with the event.
     */
    if (this.parent){
        this.parent.handle(event, data);
    }
};
Component.prototype.set_parent = function (parent) {
    /*
     * Set the parent of this Component.
     *
     * The parent should also be a Component.
     */
    this.parent = parent;
};
