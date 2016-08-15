function TableAttacker(selector) {
    Table.call(this, selector);
}
TableAttacker.prototype = Object.create(Table.prototype);
TableAttacker.prototype.__super__table__target__ = Table;
TableAttacker.prototype.add_body_row = function (data, args) {
    var row = this.__super__table__target__.prototype.add_body_row.call(this, data, args);
    row.pulse({backgroundColor: 'white'}, {pulses: 7, duration: 1000});
};
