function Frame(selector) {
    Component.call(this);
    this.selector = selector;
    this.components = {};
    this.opened_components = {};
}
Frame.prototype = Object.create(Component.prototype);
Frame.prototype.__super__frame__ = Component;
Frame.prototype.init = function () {
    this.__super__frame__.prototype.init.call(this);
    for (var component_name in this.components) {
        if (this.components.hasOwnProperty(component_name)) {
            this.components[component_name].set_parent(this);
            this.components[component_name].init();
        }
    }
};
Frame.prototype.show_components = function () {
    for (var component_name in this.opened_components) {
        if (this.opened_components.hasOwnProperty(component_name)) {
            this.opened_components[component_name].show();
        }
    }
};
Frame.prototype.hide_components = function () {
    for (var component_name in this.components) {
        if (this.components.hasOwnProperty(component_name)){
            this.components[component_name].hide();
        }
    }
};
Frame.prototype.open = function (width, height, speed) {
    this.resize(width, height, speed);
    this.show();
    this.show_components();
};
Frame.prototype.close = function (width, height, speed) {
    this.resize(width, height, speed);
    this.hide();
    this.hide_components();
};
Frame.prototype.add_component = function (component_name, component, default_open) {
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
    delete this.components[component_name];
    delete this.opened_components[component_name];
};
Frame.prototype.enable_components = function () {
    for (var component_name in this.components){
        if (this.components.hasOwnProperty(component_name)){
            this.components[component_name].enable();
        }
    }
};
Frame.prototype.disable_components = function () {
    for (var component_name in this.components) {
        if (this.components.hasOwnProperty(component_name)) {
            this.components[component_name].disable();
        }
    }
};
Frame.prototype.disable = function () {
    this.disable_components();
};
Frame.prototype.enable = function () {
    this.enable_components();
};
Frame.prototype.set_default_open = function (component_name) {
    this.opened_components[component_name] = this.components[component_name];
};
Frame.prototype.unset_default_open = function (component_name) {
    delete this.opened_components[component_name];
};

