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
MapLeaflet.prototype.add_blip = function (lat, lon, type) {
    var blip_class = 'attacker-blip';
    if (type === 'target') {
        blip_class = 'target-blip';
    }
    var icon_id = this.next_blip_id;
    this.next_blip_id++;
    var icon = L.divIcon({
        iconSize: [0, 0],
        iconAnchor: [10, 10],
        popupAnchor: [10, 0],
        shadowSize: [0, 0],
        className: String.format('blip {0} uniquename{1}', blip_class, String(icon_id))
    });

    //marker latlng
    var ll = L.latLng(lat, lon);

    // create marker
    var marker = L.marker(ll, {
        icon: icon,
        title: 'look at me!'
    });
    marker.on('add', function(){
        var selector = String.format('.uniquename{0}', String(icon_id));
        var myIcon = document.querySelector(selector);
        setTimeout(function(){
            myIcon.style.width = '100px';
            myIcon.style.height = '100px';
            myIcon.style.marginLeft = '-50px';
            myIcon.style.marginTop = '-50px';
            myIcon.style.opacity = '0';
        }, 1);
    });
    marker.addTo(this.map);
};