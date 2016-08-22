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


