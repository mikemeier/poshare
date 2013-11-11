(function(hostname, port, mapContainer){
    var map = new google.maps.Map(mapContainer, {
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var users = {};
    var socket = io.connect('http://'+ hostname +':'+ port);
    var infoWindow = new google.maps.InfoWindow();

    google.maps.event.addListener(map, "click", function(){
        infoWindow.close();
    });

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

        var position = data.position;
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        var id = data.id;
        if(typeof users[id] != "object"){
            var newMarker = new google.maps.Marker({
                map: map,
                icon: data.image+'&sz=25'
            });

            google.maps.event.addListener(newMarker, "click", function(){
                var content = '<b>'+ data.name +'</b><br>Lat: '+ latLng.lat() +' / Lng: '+ latLng.lng() +'<br>';
                infoWindow.setContent(content + 'loading...');
                infoWindow.open(map, marker);
                $.get('http://maps.googleapis.com/maps/api/geocode/json?latlng='+ latLng.lat()+','+latLng.lng() +'&sensor=false', function(data){
                    infoWindow.setContent(content + data.results[0].formatted_address);
                }, 'json');
            });

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
                marker: newMarker
            };
        }

        users[id]['polygon'].getPath().push(latLng);
        users[id]['marker'].setPosition(latLng);
    });
}(hostname, port, document.getElementById('map')));