(function(hostname, port, mapContainer){
    var map = new google.maps.Map(mapContainer, {
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var users = {};
    var socket = io.connect('http://'+ hostname +':'+ port);

    socket.on('start', function(userData){
        console.log('welcome');
        console.log(userData);

        if(navigator.geolocation){
            var watchId = navigator.geolocation.watchPosition(function(position){
                console.log(position);
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;
                if(typeof map.getCenter() != "object"){
                    map.setCenter(new google.maps.LatLng(lat, lng));
                }
                socket.emit('position', position);
            }, function(error){
                alert('Position error: '+ error.code +': '+ error.message);
            }, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            });
        }else{
            alert('Geolocation not supported');
        }
    });

    socket.on('position', function(err, data){
        if(err){
            console.log(err);
            return alert(err);
        }

        var id = data.id;
        if(typeof users[id] != "object"){
            users[id] = {
                polygon: new google.maps.Polyline({
                    path: [],
                    icons: [{
                        icon: {
                            path: 'M 0,-1 0,1',
                            strokeOpacity: 1,
                            scale: 4
                        },
                        offset: '0',
                        repeat: '20px'
                    }],
                    strokeOpacity: 0,
                    map: map
                }),
                marker: new google.maps.Marker({
                    map: map,
                    icon: data.image+'&sz=25'
                })
            };
        }

        var polygon = users[id]['polygon'];
        var marker = users[id]['marker'];

        var position = data.position;
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        var path = polygon.getPath();
        path.push(latLng);

        marker.setPosition(latLng);
    });
}(hostname, port, document.getElementById('map')));