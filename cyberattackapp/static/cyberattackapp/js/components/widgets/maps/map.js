function Map(selector, center_lat, center_lon, center_zoom) {
    Component.call(this);
    this.selector = selector;
    this.map = null;
    this.center_lat = center_lat;
    this.center_lon = center_lon;
    this.center_zoom = center_zoom;
    this.circles = [];
}
Map.prototype = Object.create(Component.prototype);
Map.prototype.__super__map__ = Component;
Map.prototype.init = function () {
    this.__super__map__.prototype.init.call(this);
    var myLatLng = {lat: this.center_lat, lng: this.center_lon};
    this.map = new google.maps.Map(document.getElementById(this.selector),
        {
            zoom: this.center_zoom,
            center: myLatLng
        });
};
Map.prototype.disable = function () {
    /* do nothing */
};
Map.prototype.enable = function () {
    /* do nothing */
};
Map.prototype.remove_marker = function (marker) {
    marker.setMap(null);
};
Map.prototype.add_marker = function (latitude, longitude, info, icon) {
    var instance = this;
    var description = [];
    for (var field in info) {
        if (info.hasOwnProperty(field)) {
            var field_value = String(info[field]);
            if (field_value.length > 0) {
                var s = String.format("<tr><td><em>{0}</em></td><td>{1}</td></tr>", String(field), String(field_value));
                description.push(s);
            }
        }
    }
    description = description.join("");
    description = '<table style="text-align:left;width:100%;">' + description + '</table>';
    var infowindow = new google.maps.InfoWindow({
        content: description
    });
    var markerlatlng = new google.maps.LatLng(latitude, longitude);
    var marker = new google.maps.Marker(
        {
            position: markerlatlng,
            map: instance.map,
            icon: icon
        });
    marker.addListener('click', function () {
        infowindow.open(instance.map, marker);
    });
    return marker;
};
Map.prototype.draw_circle = function (center_x, center_y, radius) {
    var center = new google.maps.LatLng(center_x, center_y);
    var circle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: this.map,
        center: center,
        radius: Number(radius)
    });
    this.circles.push(circle);
};
Map.prototype.clear_circles = function () {
    for (var i = 0; i < this.circles.length; i++) {
        var circle = this.circles[i];
        circle.setMap(null);
    }
    this.circles = [];
};