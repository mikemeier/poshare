(function(){
    navigator.webkitGetUserMedia(
        {audio: true, video: false},
        function(stream){

        },
        function(){
            console.log(arguments);
        }
    );

    return;

    rtc.connect('ws://'+ window.location.hostname +':9001');

    rtc.createStream({"video": false, "audio":true}, function(stream){
        // get local stream for manipulation
        rtc.attachStream(stream, 'local');
    });

    rtc.on('add remote stream', function(stream){
        // show the remote video
        rtc.attachStream(stream, 'remote');
    });
}());