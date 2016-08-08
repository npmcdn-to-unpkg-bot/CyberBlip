function Map(selector) {
    Component.call(this, selector);
}
Map.prototype = Object.create(Component.prototype);
Map.prototype.disable = function () {
    /* do nothing */
};
Map.prototype.enable = function () {
    /* do nothing */
};
Map.prototype.set_boundaries = function (south_west_lat, south_west_lon, north_east_lat, north_east_lon) {
    /* do nothing */
};
Map.prototype.remove_marker = function (marker) {
    /* do nothing */
};
Map.prototype.add_marker = function (latitude, longitude, info, icon) {
    /* do nothing */
};
Map.prototype.draw_circle = function (center_x, center_y, radius) {
    /* do nothing */
};
Map.prototype.clear_circles = function () {
    /* do nothing */
};