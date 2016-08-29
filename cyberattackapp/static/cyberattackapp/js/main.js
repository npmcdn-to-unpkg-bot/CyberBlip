$(document).ready(function () {
    $.get('configuration/', function (data) {
        /*
        Get configurations from the back end.
        The configurations the front end uses are ACCESS TOKEN, and GOOGLE_PLACES_API_KEY
         */
        window.configs = JSON.parse(data);
    }).done(
        function () {
            /*
            Initialize the root frame.
            The root frame holds all other frames and widgets.
             */
            var root_frame = new FrameRoot($("body"));
            root_frame.init();
        }
    );
});
