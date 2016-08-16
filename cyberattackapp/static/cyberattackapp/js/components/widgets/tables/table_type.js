function TableType(selector) {
    Table.call(this, selector);
}
TableType.prototype = Object.create(Table.prototype);
TableType.prototype.__super__table__type__ = Table;
TableType.prototype.add_body_row = function (data, args) {
    var row = this.__super__table__type__.prototype.add_body_row.call(this, data, args);
    row.pulse({backgroundColor: 'white'}, {pulses: 7, duration: 1000});
    return row;
};