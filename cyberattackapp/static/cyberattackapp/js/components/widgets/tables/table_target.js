function TableTarget(selector) {
    Table.call(this, selector);
}
TableTarget.prototype = Object.create(Table.prototype);
TableTarget.prototype.__super__table__attacker__ = Table;
TableTarget.prototype.add_body_row = function (data, args) {
    var row = this.__super__table__attacker__.prototype.add_body_row.call(this, data, args);
    row.pulse({backgroundColor: 'white'}, {pulses: 7, duration: 1000});
    return row;
};