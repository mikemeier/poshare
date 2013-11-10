(function(){
    var video = document.getElementById('local');
    navigator.webkitGetUserMedia({audio: true, video: true}, success, error);
    function success(stream){
        video.src = webkitURL.createObjectURL(stream);
    };

    function error(){
        console.log(arguments);
    };

    return;

    rtc.connect('ws://'+ window.location.hostname +':9001');

    rtc.createStream({"video": true, "audio":false}, function(stream){
        // get local stream for manipulation
        rtc.attachStream(stream, 'local');
    });

    rtc.on('add remote stream', function(stream){
        // show the remote video
        rtc.attachStream(stream, 'remote');
    });
}());