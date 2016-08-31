function TableAttacker(selector) {
    /*
     * A Concrete Table widget used for the Attacker portion of the Attack Table.
     *
     * @param selector: The DOM element selector representing this Table.
     */
    Table.call(this, selector);
}
TableAttacker.prototype = Object.create(Table.prototype); /* This is a Table widget */
TableAttacker.prototype.__super__table__attacker__ = Table;
TableAttacker.prototype.add_body_row = function (data, args) {
    /*
     * Add a row to the body of this table.
     *
     * Overrides the base Table widgets add_body_row function in order to add
     * a white pulse to the row when it is added.
     *
     * @param data: The data for each cell of the row as an Array, each cell representing an element of the array.
     * @param args: A list of dictionaries containing html tag arguments (class, id, etc..),
     * each element represent the args for a single cell.
     */
    var row = this.__super__table__attacker__.prototype.add_body_row.call(this, data, args);
    row.pulse({backgroundColor: 'white'}, {pulses: 7, duration: 1000});
    return row;
};