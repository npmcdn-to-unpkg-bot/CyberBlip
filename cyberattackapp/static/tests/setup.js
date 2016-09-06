QUnit.autostart = false;
QUnit.begin(function (details) {
    console.log("Starting QUnit tests...");
});
QUnit.moduleStart(function (details) {
    console.log("Now running: ", details.name);
});
QUnit.moduleDone(function (details) {
    console.log("Finished running: ", details.name, " Failed:", details.failed, " Passed:", details.passed, " Total:", details.total);
});
QUnit.done(function (details) {
    console.log(
        "Total tests:", details.total,
        " Failed:", details.failed,
        " Passed:", details.passed,
        " Runtime(ms):", details.runtime);
});
QUnit.log(function (details) {
    if (details.result) {
        return;
    }
    var loc = details.module + ": " + details.name + ": ",
        output = "FAILED: " + loc + ( details.message ? details.message + ", " : "" );
    if (details.actual) {
        output += "expected: " + details.expected + ", actual: " + details.actual;
    }
    if (details.source) {
        output += ", " + details.source;
    }
    console.log(output);
});
$(document).ready(function () {
    QUnit.start();
});