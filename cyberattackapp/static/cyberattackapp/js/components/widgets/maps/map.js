function Map(selector) {
    Component.call(this, selector);
    this.map = null;
}
Map.prototype = Object.create(Component.prototype);
Map.prototype.disable = function () {
    /* do nothing */
};
Map.prototype.enable = function () {
    /* do nothing */
};
Map.prototype.remove_layer = function(layer) {
    if(this.map){
        this.map.removeLayer(layer);
    }
};
Map.prototype.get_angle = function (lat1, lon1, lat2, lon2) {

    var dLon = (lon2 - lon1);

    var y = Math.sin(dLon) * Math.cos(lat2);
    var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

    var brng = Math.atan2(y, x);

    brng = Math.degrees(brng);
    brng = (brng + 360) % 360;
    brng = 360 - brng;

    return brng;
};
