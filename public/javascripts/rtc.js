(function(){
    return;

    navigator.webkitGetUserMedia(
        {audio: true, video: false},
        function(stream){

        },
        function(){
            console.log(arguments);
        }
    );

    rtc.connect('ws://'+ window.location.hostname +':{{rtc_port}}');

    rtc.createStream({"video": false, "audio":true}, function(stream){
        // get local stream for manipulation
        rtc.attachStream(stream, 'local');
    });

    rtc.on('add remote stream', function(stream){
        // show the remote video
        rtc.attachStream(stream, 'remote');
    });
}());