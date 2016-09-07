QUnit.module("test_button", function () {
    var $elem = $("<div></div>");
    var button = new Button($elem);
    button.execute = function () {
        this.executed = true;
    };
    QUnit.test("test_construct", function (assert) {
        assert.strictEqual($elem, button.selector);
    });
    QUnit.test("test_init", function (assert) {
        button.init();
        button.selector.click();
        assert.ok(button.executed);
    });
    QUnit.test("test_set_hover", function (assert) {
        var hover_in = function () {
            button.hovered = true;
        };
        var hover_out = function () {
            button.hovered = false;
        };
        button.set_hover(hover_in, hover_out);
        button.selector.mouseenter();
        assert.ok(button.hovered);
        button.selector.mouseleave();
        assert.notOk(button.hovered);
    });
});
QUnit.module("test_form", function () {
    var $elem = $("<form></form>");
    var $input_one = $("<input type='text' name='test_one' value='foo'>");
    var $input_two = $("<input type='text' name='test_two' value='bar'>");
    $elem.append($input_one);
    $elem.append($input_two);

    var form = new Form($elem, 'cyberattacks', 'get', function (response) {
        this.response = response;
    });
    form.response = 'fail';
    QUnit.test("test_construct", function (assert) {
        assert.strictEqual($elem, form.selector);
        assert.strictEqual('cyberattacks', form.url);
        assert.strictEqual('get', form.method);
        assert.notStrictEqual(null, form.callback);
    });
    QUnit.test("test_serialize_form", function (assert) {
        var serialized_form = form.serialize_form();
        assert.strictEqual("test_one=foo&test_two=bar", serialized_form);
    });
    QUnit.test("test_parse_serialized_form", function (assert) {
        var serialized_form = form.serialize_form();
        var parsed_form = form.parse_serialized_form(serialized_form);
        assert.deepEqual({'test_one': 'foo', 'test_two': 'bar'}, parsed_form);
    });
    QUnit.test("test_select_input_by_name", function (assert) {
        assert.deepEqual($elem.find(':input[name="test_one"]'), form.select_input_by_name('test_one'));
        assert.deepEqual($elem.find(':input[name="test_two"]'), form.select_input_by_name('test_two'));
    });
    QUnit.test("test_submit_form", function (assert) {
        var done = assert.async();
        assert.strictEqual('fail', form.response);
        form.submit_form();
        setTimeout(function () {
            assert.strictEqual('object', typeof JSON.parse(form.response));
            done();
        }, 500);
    });
});
