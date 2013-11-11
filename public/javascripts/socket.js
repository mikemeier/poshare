(function(hostname, port, mapContainer){
    var map = new google.maps.Map(mapContainer, {
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var users = {};
    var socket = io.connect('http://'+ hostname +':'+ port);

    socket.on('position', function(err, data){
        if(err){
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
                marker: null
            };
        }

        var position = data.position;
        var polygon = users[id]['polygon'];
        if(position == null){
            polygon.setMap(null);
            return delete users[id];
        }

        var latLng = new google.maps.LatLng(position.lat, position.lng);
        var path = polygon.getPath();
        path.push(latLng);

        if(users[id]['marker'] != null){
            users[id]['marker'].setMap(null);
        }

        users[id]['marker'] = new google.maps.Marker({
            position: latLng,
            icon: data.image+'&sz=25',
            map: map
        });
    });

    if(navigator.geolocation){
        var emitPosition = function(setCenter){
            return function(){
                navigator.geolocation.getCurrentPosition(function(position){
                    var lat = position.coords.latitude;
                    var lng = position.coords.longitude;
                    if(setCenter == true){
                        map.setCenter(new google.maps.LatLng(lat, lng));
                    }
                    socket.emit('position', {lat: lat, lng: lng});
                }, function(error){
                    alert('GetCurrentPositionErrorCode '+ error.code +': '+ error.message);
                }, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 5000
                });
            };
        };
        emitPosition(true)();
        window.setInterval(emitPosition(false), 10000);
    }else{
        alert('Geolocation not supported');
    }
}(hostname, port, document.getElementById('map')));