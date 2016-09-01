function FrameAttackTableContainer(selector){
    /*
     * A Concrete Frame Component that acts as a container for the attack table components.
     *
     * @param selector: The DOM element selector representing this Frame.
     */
    Frame.call(this, selector);
}
FrameAttackTableContainer.prototype = Object.create(Frame.prototype);/* This is a Frame */
FrameAttackTableContainer.prototype.__super__frame__attacke__table__container__ = Frame;
FrameAttackTableContainer.prototype.init = function () {
    /*
     * Initialize this FrameAttackTableContainer Component.
     *
     * Adds all the components of the attack table to this frame.
     */
    this.add_component('form_attack_filter', new FormAttackFilter($("#form_attack_filter")), true);
    this.add_component('table_attack', new TableAttack($("#table_attack")), true);
    this.add_component('table_timestamp', new TableTimeStamp($("#table_timestamp")), true);
    this.add_component('table_attacker', new TableAttacker($("#table_attacker")), true);
    this.add_component('table_target', new TableTarget($("#table_target")), true);
    this.add_component('table_type', new TableType($("#table_type")), true);
    this.__super__frame__attacke__table__container__.prototype.init.call(this);

    this.hidden_rows = [];
    this.visible_rows = [];
    this.max_row_count = 3;
};
FrameAttackTableContainer.prototype.handle = function (event, data) {
    /*
     * Handle some event.
     *
     * Valid events:
     *     - 'add_attack_row': Add an attack to the attack table.
     *     - 'grow': Grow the size of the attack table, showing old rows as necessary.
     *     - 'shrink': Shrink the size of the attack table, hiding rows as necessary.
     *
     * @param event: The event to handle. (str)
     * @param data: The data corresponding to the event.
     */
    if (event === 'add_attack_row') {
        this.add_table_row(data);
        if (this.visible_rows.length > this.max_row_count){
            var row_to_hide = this.visible_rows.shift();
            this.hide_table_row_by_element(row_to_hide);
            this.hidden_rows.push(row_to_hide);
            if (this.hidden_rows.length > 3){
                this.remove_table_row_by_element(this.hidden_rows.shift());
            }
        }
    }
    else if (event == 'grow') {
        this.max_row_count = 7;
        var hidden_row_length = this.hidden_rows.length;
        for (var i = 0; i < hidden_row_length; i++){
            var row_to_show = this.hidden_rows.shift();
            this.show_table_row_by_element(row_to_show);
            this.visible_rows.splice(i, 0, row_to_show);
        }
    }
    else if (event == 'shrink') {
        this.max_row_count = 3;
        var rows_to_show = this.visible_rows.slice(-3);
        var rows_to_hide = this.visible_rows.slice(0, -3);
        this.visible_rows = rows_to_show;
        this.hidden_rows = rows_to_hide;
        for (var i = 0; i < this.hidden_rows.length; i++){
            this.hide_table_row_by_element(this.hidden_rows[i]);
        }
    }
    else {
        this.parent.handle(event, data);
    }
};
FrameAttackTableContainer.prototype.show_table_row_by_element = function (row) {
    /*
     * Show a row in the attack table.
     *
     * @param row: The row to show. (array)
     */
    for (var i = 0; i < row.length; i++){
        row[i].removeClass('hidden');
    }
};
FrameAttackTableContainer.prototype.hide_table_row_by_element = function(row){
    /*
     * Hide a row in the attack table.
     *
     * @param row: The row to hide. (array)
     */
    for (var i = 0; i < row.length; i++){
        row[i].addClass('hidden');
    }
};
FrameAttackTableContainer.prototype.remove_table_row_by_element = function(row){
    /*
     * Remove a row from the attack table.
     *
     * @param row: The row to remove. (array)
     */
    for (var i = 0; i < row.length; i++){
        row[i].remove();
    }
};
FrameAttackTableContainer.prototype.hide_table_row = function (index) {
    /*
     * Hide a row in the attack table by index.
     *
     * @param index: The index of the row to remove. (int)
     */
    var attack_row = [];

    attack_row.push(this.components['table_timestamp'].hide_body_row(index));
    attack_row.push(this.components['table_attacker'].hide_body_row(index));
    attack_row.push(this.components['table_target'].hide_body_row(index));
    attack_row.push(this.components['table_type'].hide_body_row(index));

    this.hidden_rows.push(attack_row);

};
FrameAttackTableContainer.prototype.remove_table_row = function (index) {
    /*
     * Remove a row from the attack table by index.
     *
     * @param index: The index of the row to remove. (int)
     */
    this.components['table_timestamp'].remove_body_row(index);
    this.components['table_attacker'].remove_body_row(index);
    this.components['table_target'].remove_body_row(index);
    this.components['table_type'].remove_body_row(index);
};
FrameAttackTableContainer.prototype.add_table_row = function (data) {
    /*
     * Add a row to the attack table.
     *
     * @param data: The data to populate the row with. (dict)
     */
    var attack_row = [];

    attack_row.push(this.components['table_timestamp'].add_body_row([data['timestamp']]));
    attack_row.push(this.components['table_attacker'].add_body_row([data['organization'], String(data['attacker_latitude']) + ', ' + String(data['attacker_longitude']), data['attacker_ip']]));
    attack_row.push(this.components['table_target'].add_body_row([String(data['target']['latitude']) + ', ' + String(data['target']['longitude'])]));
    attack_row.push(this.components['table_type'].add_body_row([data['service'], data['target_port']]));

    this.visible_rows.push(attack_row);
};
