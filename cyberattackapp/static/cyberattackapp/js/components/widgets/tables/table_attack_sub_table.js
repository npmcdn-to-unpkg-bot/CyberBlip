function TableAttackSubTable(selector) {
    /*
     * A Table widget used for Sub Tables of the Attack Table.
     *
     * @param selector: The DOM element selector representing this Table.
     */
    Table.call(this, selector);
}
TableAttackSubTable.prototype = Object.create(Table.prototype); /* This is a Table widget */
TableAttackSubTable.prototype.__super__table__attack__sub__table = Table;
TableAttackSubTable.prototype.add_body_row = function (data, args) {
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
    var row = this.__super__table__attack__sub__table.prototype.add_body_row.call(this, data, args);
    row.pulse({backgroundColor: 'white'}, {pulses: 7, duration: 1000});
    return row;
};