function FrameMapContainer(selector){
    /*
     * A Concrete Frame Component that acts as a container for the map components.
     *
     * @param selector: The DOM element selector representing this Frame.
     */
    Frame.call(this, selector);
}
FrameMapContainer.prototype = Object.create(Frame.prototype); /* This is a Frame */
FrameMapContainer.prototype.__super__frame__map__container__ = Frame;
FrameMapContainer.prototype.init = function () {
    /*
     * Initialize this FrameMapContainer instance.
     *
     * Adds all the components of the cyber attack map to this Frame.
     */
    this.add_component('map', new MapLeaflet($('#map'), 45.320313, -69.049089, 7, true), true);
    this.__super__frame__map__container__.prototype.init.call(this);
};
FrameMapContainer.prototype.handle = function (event, data) {
    /*
    * Handle some event.
    *
    * Valid events:
    *     - 'attack': Display an attack on the cyber attack map.
    *
    * @param event: The event to handle. (str)
    * @param data: The data corresponding to the event.
    */
    if (event === 'attack') {
        this.components['map'].add_attack(
            data['attacker_latitude'], data['attacker_longitude'],
            data['target_latitude'], data['target_longitude'], data['info']
        );
    }
};
