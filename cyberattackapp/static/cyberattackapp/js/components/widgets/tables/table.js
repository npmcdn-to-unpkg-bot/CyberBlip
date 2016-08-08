function Table(selector) {
    Component.call(this, selector);
    this.header = selector.find("thead");
    this.body = selector.find("tbody");
}
Table.prototype = Object.create(Component.prototype);
Table.prototype.add_header_row = function (data, args) {
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
};
Table.prototype.format_args = function (args, arg_strings) {
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
    this.body.empty();
};


