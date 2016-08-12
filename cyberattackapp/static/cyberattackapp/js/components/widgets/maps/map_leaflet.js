function MapLeaflet(selector, center_lat, center_lon, center_zoom){
    Map.call(this, selector);
    this.center_lat = center_lat;
    this.center_lon = center_lon;
    this.center_zoom = center_zoom;
    this.next_blip_id = 0;
    this.next_stream_bit_id = 0;
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
MapLeaflet.prototype.add_attack = function (attacker_lat, attacker_lon, target_lat, target_lon, info) {
    this.add_pulsing_blip(attacker_lat, attacker_lon, info, 'attack', 300, 5000);
    this.add_pulsing_blip(target_lat, target_lon, info, 'target', 300, 5000);
    this.add_streaming_bits(attacker_lat, attacker_lon, target_lat, target_lon, 150, 5000);
};
MapLeaflet.prototype.add_pulsing_blip = function(lat, lon, info, type, pulse_speed, time){
    var blips = [];
    var stream_bit_count = time/pulse_speed;
    for (var i = 0; i < stream_bit_count; i++) {
        (function (instance) {
            setTimeout(function () {
                var blip = instance.add_blip(lat, lon, info, type);
                blips.push(blip);
            }, i * pulse_speed);
        })(this);
    }
    (function (instance) {
        setTimeout(function () {
           for (var i = 0; i < blips.length; i++){
               instance.remove_layer(blips[i]);
           }
        }, time * 2);
    })(this);
};
MapLeaflet.prototype.add_streaming_bits = function (start_lat, start_lon, end_lat, end_lon, stream_speed, time) {
    var stream_bit_count = time/stream_speed;
    for (var i = 0; i < stream_bit_count; i++) {
        (function (instance) {
            setTimeout(function(){
                instance.add_stream_bit(start_lat, start_lon, end_lat, end_lon);
            }, i * stream_speed);
        })(this);
    }
};
MapLeaflet.prototype.add_blip = function (lat, lon, info, type) {
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
MapLeaflet.prototype.add_stream_bit = function (start_lat, start_lon, end_lat, end_lon) {
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
        'width': '100px',
        'margin-left': '-50px',
        'margin-right': '-50px',
        'borderColor': '#87cefa'
    }, 2000);

};