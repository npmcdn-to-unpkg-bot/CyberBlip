function Map(selector) {
    /*
     * A Base Map widget.
     *
     * Use this widget for DOM elements that act as Maps.
     *
     * Concrete Map widgets should implement an init method that uses an API (Google maps, Leaflet, etc.)
     * to set the map attribute of this Component as well as any other map initialization requirements.
     *
     * @param selector: The DOM element selector this widget represents.
     */
    Component.call(this, selector);
    this.map = null;
}
Map.prototype = Object.create(Component.prototype); /* A Map is a Component */
Map.prototype.disable = function () {
    /* do nothing */
};
Map.prototype.enable = function () {
    /* do nothing */
};
