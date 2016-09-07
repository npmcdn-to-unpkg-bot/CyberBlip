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
QUnit.module("test_table", function () {
    var $elem = $("<table><thead></thead><tbody></tbody></table>");
    var table = new Table($elem);

    QUnit.test("test_construct", function (assert) {
        assert.strictEqual($elem, table.selector);
        assert.deepEqual($elem.find('thead'), table.header);
        assert.deepEqual($elem.find('tbody'), table.body);
    });
    QUnit.test("test_format_args", function (assert) {
        var arg_strings = [];
        table.format_args([
            {'style': 'color:red', 'width':'20px', 'height':'100px'},
            {'style': 'color:cyan', 'width':'50px', 'height':'200px'}], arg_strings);
        assert.deepEqual(
            arg_strings,
            [
                'style=color:red; width=20px; height=100px; ',
                'style=color:cyan; width=50px; height=200px; '
            ]);
    });
    QUnit.test("test_add_header_row", function (assert) {
        table.add_header_row(['foo', 'bar'], [{'width':'20px', 'height':'100px'},{'width':'50px', 'height':'200px'}]);
        var header_row = table.header.find('tr:last');
        var cell_one = header_row.find('th:nth-child(1)');
        var cell_two = header_row.find('th:nth-child(2)');

        assert.strictEqual(cell_one.html(), 'foo');
        assert.strictEqual(cell_one.css('width'), '20px');
        assert.strictEqual(cell_one.css('height'), '100px');

        assert.strictEqual(cell_two.html(), 'bar');
        assert.strictEqual(cell_two.css('width'), '50px');
        assert.strictEqual(cell_two.css('height'), '200px');
    });
    QUnit.test("test_add_body_row", function (assert) {
        table.add_body_row(['foo', 'bar'], [{'width':'20px', 'height':'100px'},{'width':'50px', 'height':'200px'}]);
        var body_row = table.body.find('tr:last');
        var cell_one = body_row.find('td:nth-child(1)');
        var cell_two = body_row.find('td:nth-child(2)');

        assert.strictEqual(cell_one.html(), 'foo');
        assert.strictEqual(cell_one.css('width'), '20px');
        assert.strictEqual(cell_one.css('height'), '100px');

        assert.strictEqual(cell_two.html(), 'bar');
        assert.strictEqual(cell_two.css('width'), '50px');
        assert.strictEqual(cell_two.css('height'), '200px');
    });
    QUnit.test("test_hide_body_row", function (assert) {
        table.add_body_row(['foo']);
        var num_rows = table.body.find('tr').length;
        var last_row = table.body.find('tr:last');
        assert.strictEqual(last_row.css('display'), 'table');
        table.hide_body_row(num_rows - 1);
        assert.strictEqual(last_row.css('display'), 'none');
    });
    QUnit.test("test_remove_body_row", function (assert) {
        table.add_body_row(['foo']);
        var num_rows = table.body.find('tr').length;
        table.remove_body_row(num_rows - 1);
        assert.strictEqual(table.body.find('tr').length, num_rows - 1);
    });
    QUnit.test("test_show_body_row", function (assert) {
        table.add_body_row(['foo']);
        var num_rows = table.body.find('tr').length;
        var last_row = table.body.find('tr:last');
        assert.strictEqual(last_row.css('display'), 'table');
        table.hide_body_row(num_rows - 1);
        assert.strictEqual(last_row.css('display'), 'none');
        table.show_body_row(num_rows - 1);
        assert.strictEqual(last_row.css('display'), 'table');
    });
    QUnit.test('test_clear', function (assert) {
        table.add_body_row(['bar']);
        assert.ok(table.body.find('tr').length > 0);
        table.clear();
        assert.strictEqual(table.body.find('tr').length, 0);
    });
});
QUnit.module("test_map", function () {
    var $elem = $("<div></div>");
    var map = new Map($elem);

    QUnit.test("test_construct", function(assert){
        assert.strictEqual($elem, map.selector);
        assert.strictEqual(null, map.map);
    });
    QUnit.test("test_enable", function (assert) {
        map.enable();
        assert.notOk(map.selector.prop('disabled'));
    });
    QUnit.test("test_disable", function (assert) {
        map.disable();
        assert.notOk(map.selector.prop('disabled'));
    });
});
