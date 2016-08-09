function FrameAttackTableContainer(selector){
    Frame.call(this, selector);
}
FrameAttackTableContainer.prototype = Object.create(Frame.prototype);
FrameAttackTableContainer.prototype.__super__frame__attacke__table__container__ = Frame;
FrameAttackTableContainer.prototype.init = function () {
    this.add_component('table_attack', new TableAttack($("#table_attack")), true);
    this.add_component('table_attack_detail', new TableAttackDetail($("#table_attack_detail")), true);
    this.add_component('table_timestamp', new TableTimeStamp($("#table_timestamp")), true);
    this.add_component('table_attacker', new TableAttacker($("#table_attacker")), true);
    this.add_component('table_target', new TableTarget($("#table_target")), true);
    this.add_component('table_type', new TableType($("#table_type")), true);
    this.__super__frame__attacke__table__container__.prototype.init.call(this);
};
