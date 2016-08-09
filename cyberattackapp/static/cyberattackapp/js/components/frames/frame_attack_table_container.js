function FrameAttackTableContainer(selector){
    Frame.call(this, selector);
}
FrameAttackTableContainer.prototype = Object.create(Frame.prototype);
FrameAttackTableContainer.prototype.__super__frame__attacke__table__container__ = Frame;
FrameAttackTableContainer.prototype.init = function () {
    this.add_component('table_attack', new TableAttack($("#table_attack")), true);
    this.__super__frame__attacke__table__container__.prototype.init.call(this);
};
