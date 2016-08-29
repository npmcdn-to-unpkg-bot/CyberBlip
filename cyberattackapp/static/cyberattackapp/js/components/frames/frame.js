function Frame(selector) {
    /*
     * A Base Frame Component.
     *
     * A Frame is a Component which contains other Components.
     *
     * @param selector: The DOM element selector this Frame represents.
     */
    Component.call(this);
    this.selector = selector;
    this.components = {};
    this.opened_components = {};
}
Frame.prototype = Object.create(Component.prototype); /* A Frame is a Component */
Frame.prototype.__super__frame__ = Component;
Frame.prototype.init = function () {
    /*
     * Initialize this Frame.
     *
     * Concrete Frames should override this function and add all child components to the frame.
     * After adding the child components call this function to init each of the child components.
     */
    this.__super__frame__.prototype.init.call(this);
    for (var component_name in this.components) {
        if (this.components.hasOwnProperty(component_name)) {
            this.components[component_name].set_parent(this);
            this.components[component_name].init();
        }
    }
};
Frame.prototype.show_components = function () {
    /*
     * Show all child components that are currently set as opened.
     */
    for (var component_name in this.opened_components) {
        if (this.opened_components.hasOwnProperty(component_name)) {
            this.opened_components[component_name].show();
        }
    }
};
Frame.prototype.hide_components = function () {
    /*
     * Hide all child components.
     */
    for (var component_name in this.components) {
        if (this.components.hasOwnProperty(component_name)){
            this.components[component_name].hide();
        }
    }
};
Frame.prototype.open = function (width, height, speed) {
    /*
     * Open this frame.
     *
     * Resize's this frame and shows all child components that are set to open.
     *
     * @param width: The width to resize the frame to in pixels or percent.
     * @param height: The height to resize the frame to in pixels or percent.
     * @param speed: The speed of the resizing animation in ms.
     */
    this.resize(width, height, speed);
    this.show();
    this.show_components();
};
Frame.prototype.close = function (width, height, speed) {
    /*
     * Close this frame.
     *
     * Resize's this frame and hides all child components.
     *
     * @param width: The width to resize the frame to in pixels or percent.
     * @param height: The height to resize the frame to in pixels or percent.
     * @param speed: The speed of the resizing animation in ms.
     */
    this.resize(width, height, speed);
    this.hide();
    this.hide_components();
};
Frame.prototype.add_component = function (component_name, component, default_open) {
    /*
     * Add a child component to this frame.
     *
     * All child components are accessible via this objects 'components' attribute.
     *
     * @param component_name: A string representing the name of the component being added.
     * @param component: The component to add to this frame.
     * @param default_open: If true then when this frame is open this component will be visible by default.
     */
    component.set_parent(this);
    this.components[component_name] = component;
    if (default_open){
        this.opened_components[component_name] = component;
    }
    else {
        this.components[component_name].hide()
    }
};
Frame.prototype.remove_component = function (component_name) {
    /*
     * Remove a child component from this frame.
     *
     * @param component_name: The name of the component to remove.
     * This is the same name that was given to the component when it was first added.
     */
    delete this.components[component_name];
    delete this.opened_components[component_name];
};
Frame.prototype.enable_components = function () {
    /*
     * Enables all child components of this frame.
     */
    for (var component_name in this.components){
        if (this.components.hasOwnProperty(component_name)){
            this.components[component_name].enable();
        }
    }
};
Frame.prototype.disable_components = function () {
    /*
     * Disables all child components of this frame.
     */
    for (var component_name in this.components) {
        if (this.components.hasOwnProperty(component_name)) {
            this.components[component_name].disable();
        }
    }
};
Frame.prototype.enable = function () {
    /*
     * Enables all child components of this frame.
     */
    this.enable_components();
};
Frame.prototype.disable = function () {
    /*
     * Disables all child components of this frame.
     */
    this.disable_components();
};
Frame.prototype.set_default_open = function (component_name) {
    /*
     * Set a component to be visible when this frame is opened.
     *
     * @param component_name: The name of the component to set visible by default.
     * This is the same name that was given to the component when it was first added.
     */
    this.opened_components[component_name] = this.components[component_name];
};
Frame.prototype.unset_default_open = function (component_name) {
    /*
     * Set a component to be hidden when this frame is opened.
     *
     * @param component_name: The name of the component to set hidden by default.
     * This is the same name that was given to the component when it was first added.
     */
    delete this.opened_components[component_name];
};

