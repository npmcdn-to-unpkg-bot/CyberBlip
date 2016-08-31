function TableAttack(selector) {
    /*
     * A Concrete Table widget used for the entire Cyber Attack table.
     *
     * @param selector: The DOM element selector representing this Table.
     */
    Table.call(this, selector);
}
TableAttack.prototype = Object.create(Table.prototype); /* This is a Table widget */
TableAttack.prototype.__super__table__attack__ = Table;
TableAttack.prototype.init = function () {
    /*
     * Initialize this TableAttack instance.
     *
     * Sets up table resizing on click.
     */
    this.default_size = true;
    (function (instance){
        instance.selector.click(function(){
            if (instance.default_size) {
                instance.grow();
                instance.default_size = false;
            }
            else {
                instance.shrink();
                instance.default_size = true;
            }
        });
    })(this);
    this.__super__table__attack__.prototype.init.call(this);
};
TableAttack.prototype.grow = function () {
    /*
     * Grow this table's height.
     */
    this.resize(null, '255px', 500);
    this.handle('grow', null);
};
TableAttack.prototype.shrink = function () {
    /*
     * Shrink this table's height.
     */
    this.resize(null, '100%', 500);
    this.handle('shrink', null);
};