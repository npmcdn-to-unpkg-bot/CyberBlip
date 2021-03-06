function FormAttackFilter(selector) {
    /*
     * A Concrete Form widget for filtering Cyber Attacks.
     *
     * @param selector: The DOM element selector representing this form.
     */
    Form.call(this, selector, 'cyberattacks', 'get', this.response_success);
}
FormAttackFilter.prototype = Object.create(Form.prototype); /* This is a Form widget */
FormAttackFilter.prototype.__super__form__attack__filter__ = Form;
FormAttackFilter.prototype.init = function () {
    /*
     * Initialize this FormAttackFilter instance.
     *
     * Binds form submit to the enter key when a user is inputting filter data.
     * Sets up background highlight on form submission.
     */
    this.__super__form__attack__filter__.prototype.init.call(this);
    this.filtered_original_colors = {};
    (function(instance){
        instance.selector.find(':input').keypress(function (e) {
            if (e.which == 13) {
                var serialized_form = instance.serialize_form();
                instance.handle('apply_filter', serialized_form);
                var input_fields = instance.selector.find(':input');
                for (var key in instance.filtered_original_colors) {
                    if (instance.filtered_original_colors.hasOwnProperty(key)){
                        var input_field = instance.select_input_by_name(key);
                        input_field.css('backgroundColor', instance.filtered_original_colors[key]);
                        delete instance.filtered_original_colors[key];
                    }
                }
                input_fields.pulse({backgroundColor: 'white'}, {pulses: 1, duration: 500});
                var form_data = instance.parse_serialized_form(serialized_form);
                for (var key in form_data){
                    if (form_data.hasOwnProperty(key)){
                        var input_field = instance.select_input_by_name(key);
                        instance.filtered_original_colors[key] = input_field.css('backgroundColor');
                        input_field.stop().css('backgroundColor', 'white');
                    }
                }
            }
        });
    })(this);
};
FormAttackFilter.prototype.response_success = function (response) {
    /*
     * The callback function for form submission success.
     * Does nothing.
     */
};
