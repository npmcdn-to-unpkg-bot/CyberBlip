function TableAttack(selector) {
    Table.call(this, selector);
}
TableAttack.prototype = Object.create(Table.prototype);
TableAttack.prototype.__super__table__attack__ = Table;
TableAttack.prototype.init = function () {
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
    this.resize(null, '255px', 500);
    this.handle('grow', null);
};
TableAttack.prototype.shrink = function () {
    this.resize(null, '100%', 500);
    this.handle('shrink', null);
};