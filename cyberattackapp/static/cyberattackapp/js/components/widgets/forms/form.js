function Form(selector, url, method, callback) {
    /*
     * A Base Form widget.
     *
     * Use this widget for DOM elements that act as a form.
     *
     * @param selector: The DOM element selector this Form represents.
     * @param url: The url that is used on form submit.
     * @param method: The http method to use with this form. (Only supports GET right now.)
     * @param callback: The function to call with the response from the server after the form submission.
     */
    Component.call(this, selector);
    this.url = url;
    this.method = method;
    this.callback = callback;
}
Form.prototype = Object.create(Component.prototype); /* A Form is a Component */
Form.prototype.submit_form = function () {
    /*
     * Submit this form to the server.
     *
     * Only supports GET requests for now.
     */
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
    /*
     * Serialize the form input field data to a String.
     *
     * @returns: The Serialized form data as a String.
     */
    return this.selector.formSerialize();
};
Form.prototype.parse_serialized_form = function (serialized_form) {
    /*
     * Parse serialized form data into a dictionary.
     *
     * @param serialized_form: The serialized_form data retrieved from the serialize_form method.
     * @return: A Dictionary containing the serialized form data.
     */
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
    /*
     * Get an input selector of this Form by the input's name attribute.
     *
     * @param name: The name attribute of an input field that is part of this form as a String.
     * @return: The DOM element selector of the input tag with the given name.
     */
    return this.selector.find(':input[name="' + String(name) + '"]');
};


