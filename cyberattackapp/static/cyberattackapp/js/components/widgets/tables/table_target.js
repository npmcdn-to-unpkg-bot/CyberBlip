function TableTarget(selector) {
    Table.call(this, selector);
}
TableTarget.prototype = Object.create(Table.prototype);
TableTarget.prototype.__super__table__attacker__ = Table;
TableTarget.prototype.add_body_row = function (data, args) {
    var row = this.__super__table__attacker__.prototype.add_body_row.call(this, data, args);
    var start_background_color = row.css('backgroundColor');
    var start_color = row.css('color');
    row.css('color', '#FFFFFF');
    row.css('backgroundColor', '#FFFFFF');
    row.animate({
        color: start_color,
        backgroundColor: start_background_color
    }, 500);
};