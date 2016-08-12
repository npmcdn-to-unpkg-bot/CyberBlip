function TableType(selector) {
    Table.call(this, selector);
}
TableType.prototype = Object.create(Table.prototype);
TableType.prototype.__super__table__type__ = Table;
TableType.prototype.add_body_row = function (data, args) {
    var row = this.__super__table__type__.prototype.add_body_row.call(this, data, args);
    var start_background_color = row.css('backgroundColor');
    var start_color = row.css('color');
    row.css('color', '#FFFFFF');
    row.css('backgroundColor', '#FFFFFF');
    row.animate({
        color: start_color,
        backgroundColor: start_background_color
    }, 500);
};