function FormAttackFilter(selector) {
    Form.call(this, selector, 'cyberattacks', 'get', this.response_success);
}
FormAttackFilter.prototype = Object.create(Form.prototype);
FormAttackFilter.prototype.__super__form__attack__filter__ = Form;
FormAttackFilter.prototype.init = function () {
    this.__super__form__attack__filter__.prototype.init.call(this);
    (function(instance){
        instance.selector.find(':input').keypress(function (e) {
            if (e.which == 13) {
                instance.submit_form();
            }
        });
    })(this);
};
FormAttackFilter.prototype.response_success = function (response) {
    /* do something */
};
