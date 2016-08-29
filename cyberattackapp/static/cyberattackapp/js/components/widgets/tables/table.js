function Table(selector) {
    /*
     * A Base Table widget.
     *
     * Use this widget for DOM elements that act as tables.
     * The DOM element selector of this widget must have a 'thead' and 'tbody' element.
     *
     * @param selector: The DOM element selector this widget represents.
     */
    Component.call(this, selector);
    this.header = selector.find("thead");
    this.body = selector.find("tbody");
}
Table.prototype = Object.create(Component.prototype); /* A Table is a Component */
Table.prototype.add_header_row = function (data, args) {
    /*
     * Add a row to the header of this table.
     *
     * @param data: The data for each cell of the row as an Array, each cell representing an element of the array.
     * @param args: Any html tag arguments (class, id, etc..) that should belong to each cell of this row.
     */
    var row = '<tr>';
    var arg_strings = Array(data.length).join(".").split(".");
    arg_strings = this.format_args(args, arg_strings);
    for (var index in data){
        if (data.hasOwnProperty(index)){
            var cell = String.format("<th {0}>" + String(data[index]) + "</th>", arg_strings[index]);
            row = row + cell;
        }
    }
    row = row + '</tr>';
    this.header.append(row);
};
Table.prototype.add_body_row = function (data, args) {
    /*
     * Add a row to the body of this table.
     *
     * @param data: The data for each cell of the row as an Array, each cell representing an element of the array.
     * @param args: A list of dictionaries containing html tag arguments (class, id, etc..),
     * each element represent the args for a single cell.
     */
    var row = '<tr>';
    var arg_strings = Array(data.length).join(".").split(".");
    arg_strings = this.format_args(args, arg_strings);
    for (var index in data){
        if (data.hasOwnProperty(index)){
            var cell = String.format('<td {0}>' + String(data[index]) + '</td>', arg_strings[index]);
            row = row + cell;
        }
    }
    row = row + '</tr>';
    this.body.append(row);
    return this.body.find('tr:last');
};
Table.prototype.remove_body_row = function (index) {
    /*
     * Remove a row from the body of this table by row index.
     *
     * @param index: The index of the body row to remove.
     */
    this.body.find("tr:eq(" + index + ")").remove();
};
Table.prototype.hide_body_row = function(index) {
    /*
     * Hide a row in the body of this table by row index.
     *
     * @param index: The index of the body row to hide.
     * @return: Return The hidden body row.
     */
    var row = this.body.find("tr:eq(" + index + ")");
    row.addClass("hidden");
    return row
};
Table.prototype.show_body_row = function (index) {
    /*
     * Show a row in the body of this table by row index.
     *
     * @param index: The index of the body row to show.
     */
    this.body.find("tr:eq(" + index + ")").removeClass("hidden");
};
Table.prototype.format_args = function (args, arg_strings) {
    /*
     * Format body/header cell tag arguments into strings following html format.
     *
     * @param args: A list of dictionaries containing args to format into strings for html.
     * @param arg_strings: The list to use to append the formatted strings to.
     * @return: Return The list of formatted strings.
     */
    var formatted_args = arg_strings;
    if(args) {
        for (var index in args){
            if (args.hasOwnProperty(index)){
                for (var arg_name in args[index]){
                    if (args[index].hasOwnProperty(arg_name)) {
                        var arg_string = String.format(String(arg_name) + '=' + String(args[index][arg_name]));
                        formatted_args[index] = arg_string + ' ';
                    }
                }
            }
        }
    }
    return formatted_args;
};
Table.prototype.clear = function () {
    /*
     * Clear all header and body rows from this table.
     */
    this.body.empty();
};


