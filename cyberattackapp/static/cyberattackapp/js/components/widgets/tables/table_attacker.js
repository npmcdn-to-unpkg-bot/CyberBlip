function TableAttacker(selector) {
    Table.call(this, selector);
}
TableAttacker.prototype = Object.create(Table.prototype);
TableAttacker.prototype.__super__table__target__ = Table;
TableAttacker.prototype.add_body_row = function (data, args) {
    var row = this.__super__table__target__.prototype.add_body_row.call(this, data, args);
    var start_background_color = row.css('backgroundColor');
    var start_color = row.css('color');
    row.css('color', '#FFFFFF');
    row.css('backgroundColor', '#FFFFFF');
    row.animate({
        color: start_color,
        backgroundColor: start_background_color
    }, 500);
};
