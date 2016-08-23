function Form(selector, url, method, callback) {
    Component.call(this, selector);
    this.url = url;
    this.method = method;
    this.callback = callback;
}
Form.prototype = Object.create(Component.prototype);
Form.prototype.submit_form = function () {
    var serialized_form = this.serialize_form();
    if (this.method === 'get') {
        (function(instance){
            $.get(instance.url, serialized_form, function (response) {
                instance.callback(response);
            });
        })(this);
    }
};
Form.prototype.serialize_form = function () {
    return this.selector.formSerialize();
};
Form.prototype.parse_serialized_form = function (serialized_form) {
    var parsed_data = {};
    var serialized_data = String(serialized_form).split('&');
    for (var i = 0; i < serialized_data.length; i++){
        var data = String(serialized_data[i]).split('=');
        if (data[1] != ''){
            parsed_data[data[0]] = data[1];
        }
    }
    return parsed_data;
};
Form.prototype.select_input_by_name = function (name) {
    return this.selector.find(':input[name="' + String(name) + '"]');
};


