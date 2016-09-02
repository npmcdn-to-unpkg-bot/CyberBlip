function MapLeaflet(selector, center_lat, center_lon, zoom, fixed){
    /*
     * A Map widget using the Leaflet API.
     *
     * @param selector: The DOM element selector representing this Map widget.
     * @param center_lat: The default center latitude to display this map at. (float)
     * @param center_lon: The default center longitude to display this map at. (float)
     * @param zoom: The default zoom level for this map. (int)
     * @param fixed: A flag for if this map should be fixed in position or not. (bool)
     */
    Map.call(this, selector);
    this.center_lat = center_lat;
    this.center_lon = center_lon;
    this.zoom = zoom;
    this.next_blip_id = 0;
    this.next_stream_bit_id = 0;
    this.locked = fixed
}
MapLeaflet.prototype = Object.create(Map.prototype); /* This is a Map widget */
MapLeaflet.prototype.__super__map__leaflet__ = Map;
MapLeaflet.prototype.init = function () {
    /*
     * Initialize this MapLeaflet instance.
     *
     * Creates a LeafLet Map object to display within this objects selector.
     * Sets up the TileLayer, zoom, lat/lon, etc. for the map.
     */
    this.__super__map__leaflet__.prototype.init.call(this);
    var myLatLng = L.latLng(this.center_lat, this.center_lon);
    var myTileLayer = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
        "access_token=" + configs['ACCESS_TOKEN']);

    var options;
    if (this.locked) {
        options = {
            zoom: this.zoom,
            minZoom: this.zoom,
            maxZoom: this.zoom,
            center: myLatLng,
            dragging: false,
            touchZoom: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            boxZoom: false,
            bounceAtZoomLimits: false,
            zoomControl: false,
            attributionControl: false
        }
    }
    else {
        options = {
            zoom: this.zoom,
            center: myLatLng
        }
    }
    this.map = L.map(this.selector[0], options);
    this.map.addLayer(myTileLayer);
};
MapLeaflet.prototype.remove_layer = function(layer) {
    /*
     * Remove a layer from the map.
     *
     * Assumes the API that was used to create this objects map attribute has a 'removeLayer' method.
     */
    if(this.map){
        this.map.removeLayer(layer);
    }
};
MapLeaflet.prototype.add_attack = function (attacker_lat, attacker_lon, target_lat, target_lon, info) {
    /*
     * Add a Cyber Attack visualization to this map.
     *
     * @param attacker_lat: The latitude of the attacker. (float)
     * @param attacker_lon: The longitude of the attacker. (float)
     * @param target_lat: The latitude of the target. (float)
     * @param target_lon: The longitude of the target. (float)
     * @param info: The data corresponding to the Cyber Attack. (dict)
     */
    this.add_pulsing_blip(attacker_lat, attacker_lon, info, 'attack', 300, 5000);
    this.add_pulsing_blip(target_lat, target_lon, info, 'target', 300, 5000);
    this.add_streaming_bits(attacker_lat, attacker_lon, target_lat, target_lon, 150, 5000);
};
MapLeaflet.prototype.add_pulsing_blip = function(lat, lon, info, type, pulse_speed, time){
    /*
     * Add a pulsing blip to this map.
     *
     * @param lat: The latitude for the blip. (float)
     * @param lon: The longitude for the blip. (float)
     * @param info: The data corresponding to the Cyber Attack. (dict)
     * @param type: the type of blip to add, 'attacker or 'target'. (str)
     * @param pulse_speed: The speed at which the blip should pulse in ms. (int)
     * @param time: The amount of time this blip should pulse for in ms. (int)
     */
    var blips = [];
    (function (instance){
        var pulse_interval = setInterval(function(){
            var blip = instance.add_blip(lat, lon, info, type);
            blips.push(blip)
        }, pulse_speed);
        setTimeout(function(){
            clearInterval(pulse_interval);
            setTimeout(function(){
                for (var i = 0; i < blips.length; i++){
                    instance.remove_layer(blips[i]);
                }
            }, time);
        }, time);
    })(this);
};
MapLeaflet.prototype.add_streaming_bits = function (start_lat, start_lon, end_lat, end_lon, stream_speed, time) {
    /*
     * Add a stream of bits to this map.
     *
     * @param start_lat: The latitude the stream should start at. (float)
     * @param start_lon: The longitude the stream should start at. (float)
     * @param end_lat: The latitude the stream should end at. (float)
     * @param end_lon: The longitude the stream should end at. (float)
     * @param stream_speed: The speed of the stream in ms. (int)
     * @param time: The amount of time the stream should stream for. (int)
     */
    (function (instance){
        var stream_interval = setInterval(function(){
            instance.add_stream_bit(start_lat, start_lon, end_lat, end_lon);
        }, stream_speed);
        setTimeout(function(){
            clearInterval(stream_interval);
        }, time)
    })(this);
};
MapLeaflet.prototype.add_blip = function (lat, lon, info, type) {
    /*
     * Add a blip to this map.
     *
     * @param lat: The latitude of the blip. (float)
     * @param lon: The longitude of the blip. (float)
     * @param info: The data to display when the blip is clicked. (dict)
     * @param type: The type of blip this is, 'attacker' or 'target'. (str)
     */
    var icon_id = this.next_blip_id;
    this.next_blip_id++;
    var class_type = 'attacker_blip';
    if (type === 'target'){
        class_type = 'target_blip';
    }
    var icon = L.divIcon({
        iconSize: [0, 0],
        iconAnchor: [0, 0],
        popupAnchor: [0, 0],
        shadowSize: [0, 0],
        className: String.format('blip {0} blipid{1}', class_type, String(icon_id))
    });

    //marker latlng
    var ll = L.latLng(lat, lon);

    // create marker
    var blip = L.marker(ll, {icon: icon});
    blip.on('add', function(){
        var selector = String.format('.blipid{0}', String(icon_id));
        var myIcon = document.querySelector(selector);
        setTimeout(function(){
            myIcon.style.width = '50px';
            myIcon.style.height = '50px';
            myIcon.style.marginLeft = '-25px';
            myIcon.style.marginTop = '-25px';
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
MapLeaflet.prototype.add_stream_bit = function (start_lat, start_lon, end_lat, end_lon) {
    /*
     * Add a single stream bit to the map.
     *
     * @param start_lat: The latitude the stream bit should start at. (float)
     * @param start_lon: The longitude the stream bit should start at. (float)
     * @param end_lat: The latitude the stream bit should end at. (float)
     * @param end_lon: The longitude the stream bit should end at. (float)
     */
    var bit_id = this.next_stream_bit_id++;
    this.next_stream_bit_id++;
    var stream_bit_icon = L.divIcon({
        iconSize: [0, 0],
        iconAnchor: [0, 0],
        popupAnchor: [0, 0],
        shadowSize: [0, 0],
        className: String.format('stream_bit bitid{0}', String(bit_id))
    });
    var stream_bit_marker = L.Marker.movingMarker(
        [[start_lat, start_lon], [end_lat, end_lon]],
        2000,
        {
            autostart: true,
            icon: stream_bit_icon
        }
    );
    (function(instance){
        stream_bit_marker.on('end', function () {
            instance.remove_layer(stream_bit_marker);
        });
    })(this);
    stream_bit_marker.addTo(this.map);
    var selector = String.format('.bitid{0}', String(bit_id));
    var myIcon = $(selector);
    myIcon.animate({
        'opacity': .10,
        'width': '50px',
        'margin-left': '-25px',
        'margin-right': '-25px',
        'borderColor': '#87cefa'
    }, 2000);

};