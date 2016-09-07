QUnit.module("test_component", function () {
    var parent_elem = $("<div></div>");
    var child_elem = $("<div></div>");
    parent_elem.append(child_elem);
    var component = new Component(child_elem);
    var parent_component = new Component(parent_elem);
    parent_component.handle = function (event, data) {
        this.event = event;
        this.data = data;
    };
    QUnit.test("test_construct", function (assert) {
        assert.strictEqual(child_elem, component.selector);
        assert.strictEqual(null, component.parent);
    });
    QUnit.test("test_hide", function (assert) {
        component.hide();
        assert.strictEqual(component.selector.css('display'), 'none');
    });
    QUnit.test("test_show", function (assert) {
        component.show();
        assert.notStrictEqual(component.selector.css('display'), 'none');
    });
    QUnit.test("test_enable", function (assert) {
        component.enable();
        assert.notOk(component.selector.prop('disabled'));
    });
    QUnit.test("test_disable", function (assert) {
        component.disable();
        assert.ok(component.selector.prop('disabled'));
    });
    QUnit.test("test_resize", function (assert) {
        var done = assert.async();
        component.selector.css('width', '0px');
        component.selector.css('height', '0px');
        component.resize('1000px', '2000px', 300);
        setTimeout(function () {
            assert.strictEqual('1000px', component.selector.css('width'));
            assert.strictEqual('2000px', component.selector.css('height'));
            done();
        }, 350);
    });
    QUnit.test("test_set_parent", function (assert) {
        component.set_parent(parent_component);
        assert.strictEqual(component.parent, parent_component);
    });
    QUnit.test("test_handle", function (assert) {
        component.set_parent(parent_component);
        component.handle('foo', {'foo': 'bar'});
        assert.deepEqual('foo', parent_component.event);
        assert.deepEqual({'foo': 'bar'}, parent_component.data);
    });
});