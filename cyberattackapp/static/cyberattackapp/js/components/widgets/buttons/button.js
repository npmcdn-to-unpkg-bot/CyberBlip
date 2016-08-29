function Button(selector) {
    /*
     * A Base Button widget.
     *
     * Use this widget for DOM elements that act as buttons.
     *
     * @param selector: The DOM element selector this widget represents.
     */
    Component.call(this, selector);
}
Button.prototype = Object.create(Component.prototype); /* A Button is a Component */
Button.prototype.__super__button__ = Component;
Button.prototype.init = function () {
    /*
     * Initialize this Button.
     *
     * Sets up a click event to call this Buttons 'execute' method.
     */
    this.__super__button__.prototype.init.call(this);
    (function (instance) {
        instance.selector.click(function () {
            instance.execute();
        });
    })(this);
};
Button.prototype.execute = function () {
    /*
     * The function that is called when this button is clicked.
     * By default does nothing, override this to implement custom behaviour on button click.
     */
};
Button.prototype.set_hover = function (hover_in, hover_out) {
    /*
     * Set functions to be called when this button is hovered over.
     *
     * @param hover_in: The function to be called when the mouse enters this button element.
     * @param hover_out: The function to be called when the mouse leaves this button element.
     */
    this.selector.hover(hover_in, hover_out);
};

