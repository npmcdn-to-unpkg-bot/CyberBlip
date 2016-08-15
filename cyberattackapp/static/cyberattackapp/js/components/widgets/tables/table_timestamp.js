function TableTimeStamp(selector) {
    Table.call(this, selector);
}
TableTimeStamp.prototype = Object.create(Table.prototype);
TableTimeStamp.prototype.__super__table__timestamp__ = Table;
TableTimeStamp.prototype.add_body_row = function (data, args) {
    var row = this.__super__table__timestamp__.prototype.add_body_row.call(this, data, args);
    row.pulse({backgroundColor: 'white'}, {pulses: 7, duration: 1000});
};