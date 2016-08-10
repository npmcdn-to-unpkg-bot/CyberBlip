function MapLeaflet(selector, center_lat, center_lon, center_zoom){
    Map.call(this, selector);
    this.map = null;
    this.center_lat = center_lat;
    this.center_lon = center_lon;
    this.center_zoom = center_zoom;
    this.next_blip_id = 0;
}
MapLeaflet.prototype = Object.create(Map.prototype);
MapLeaflet.prototype.__super__map__leaflet__ = Map;
MapLeaflet.prototype.init = function () {
    this.__super__map__leaflet__.prototype.init.call(this);
    var myLatLng = L.latLng(this.center_lat, this.center_lon);
    var myTileLayer = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
        "access_token=" + configs['ACCESS_TOKEN']);

    this.map = L.map(this.selector[0],
    {
        zoom: this.center_zoom,
        center: myLatLng
    });
    this.map.addLayer(myTileLayer);
};
MapLeaflet.prototype.add_blip = function (lat, lon, info) {
    var icon_id = this.next_blip_id;
    this.next_blip_id++;
    var icon = L.divIcon({
        iconSize: [0, 0],
        iconAnchor: [0, 0],
        popupAnchor: [0, 0],
        shadowSize: [0, 0],
        className: String.format('blip uniquename{0}',  String(icon_id))
    });

    //marker latlng
    var ll = L.latLng(lat, lon);

    // create marker
    var blip = L.marker(ll, {icon: icon});
    blip.on('add', function(){
        var selector = String.format('.uniquename{0}', String(icon_id));
        var myIcon = document.querySelector(selector);
        setTimeout(function(){
            myIcon.style.width = '100px';
            myIcon.style.height = '100px';
            myIcon.style.marginLeft = '-50px';
            myIcon.style.marginTop = '-50px';
            myIcon.style.opacity = '0';

        }, 50);
    });
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
    var infowindow = L.popup({
            minHeight: 500,
            minWidth: 500
    }).setContent(description);
    blip.bindPopup(infowindow);
    blip.addTo(this.map);
    return blip
};
MapLeaflet.prototype.remove_blip = function (blip) {
    this.map.removeLayer(blip);
};
MapLeaflet.prototype.add_pulsing_blip = function(lat, lon, info){
    var blips = [];
    for (var j = 0; j < 50; j++){
        (function (instance) {
            setTimeout(function () {
                var blip = instance.add_blip(lat, lon, info);
                blips.push(blip);
            }, j * 300);
        })(this);
    }
    (function (instance) {
        setTimeout(function () {
           for (var i = 0; i < blips.length; i++){
               instance.remove_blip(blips[i]);
           }
        }, 16500);
    })(this);
};