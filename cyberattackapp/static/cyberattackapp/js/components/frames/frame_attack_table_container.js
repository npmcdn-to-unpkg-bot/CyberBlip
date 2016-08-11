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

    this.row_count = 0;
};
FrameAttackTableContainer.prototype.handle = function (event, data) {
    if (event === 'add_attack_row') {
        if (this.row_count >= 4){
            this.remove_table_row(0);
        }
        this.add_table_row(data);
        this.row_count++;
    }
};
FrameAttackTableContainer.prototype.remove_table_row = function (index) {
    this.components['table_timestamp'].remove_body_row(index);
    this.components['table_attacker'].remove_body_row(index);
    this.components['table_target'].remove_body_row(index);
    this.components['table_type'].remove_body_row(index);
};
FrameAttackTableContainer.prototype.add_table_row = function (data) {
    this.components['table_timestamp'].add_body_row([data['timestamp']]);
    this.components['table_attacker'].add_body_row([data['organization'], String(data['attacker_latitude']) + ', ' + String(data['attacker_longitude']), data['attacker_ip']]);
    this.components['table_target'].add_body_row([String(data['target_latitude']) + ', ' + String(data['target_longitude'])]);
    this.components['table_type'].add_body_row([data['service'], data['port']]);
};
