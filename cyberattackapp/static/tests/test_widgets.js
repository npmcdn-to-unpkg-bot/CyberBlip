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
