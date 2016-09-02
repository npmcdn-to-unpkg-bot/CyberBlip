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
Map.prototype.get_angle = function (lat1, lon1, lat2, lon2) {
    /*
     * Get the angle between two latitude/longitude points.
     *
     * @param lat1: The latitude of the first point as a float.
     * @param lon1: The longitude of the first point as a float.
     * @param lat2: The latitude of the second point as a float.
     * @param lon2: The longitude of the second point as a float.
     * @return: The Angle between the two points in degrees.
     */
    var dLon = (lon2 - lon1);

    var y = Math.sin(dLon) * Math.cos(lat2);
    var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

    var brng = Math.atan2(y, x);

    brng = Math.degrees(brng);
    brng = (brng + 360) % 360;
    brng = 360 - brng;

    return brng;
};
