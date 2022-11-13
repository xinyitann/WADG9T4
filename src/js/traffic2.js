function accident_coord() {
    
    
    // var loc = {
    //     lat: 1.2963,
    //     lng: 103.8502
    // };
    // var map = new google.maps.Map(document.getElementById("map"), {
    //     center: loc,
    //     zoom: 12,
    // });

    // window.map = map

    // var marker = new google.maps.Marker({
    //     position: loc,
    //     map: window.map
    // });

    let api_endpoint_url1 = 'traffic_accident.php'
    axios.get(api_endpoint_url1, {
    headers: {
        'AccountKey': 'rA62Al3wSpWoBqzOBOIC6g==',
        'accept': 'application/json',
}
})
.then(response => {
    var check1 = []
var accident_coords = []
var values = response.data[0].value

var values_outside = values
var firebaseConfig = {
    apiKey: "AIzaSyC6FeItoMxFnT9yIv5F8zukSMvhnZrH0YU",
    authDomain: "onestopper.firebaseapp.com",
    databaseURL: "https://onestopper-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "onestopper",
    storageBucket: "onestopper.appspot.com",
    messagingSenderId: "64753765868",
    appId: "1:64753765868:web:2f5a596f8d4a62d0e9c4c9",
    measurementId: "G-DE6MGV1BWE"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {

}

var uid = JSON.parse(localStorage.getItem("users")).uid

var ref = firebase.database().ref("/user_routes/" + uid)

ref.on("value", function (snapshot) {
    //gkdflkgodfkgfglkdfg
    var route = snapshot.val().route.route
    
    console.log(route)
    console.log(values_outside)
    var accident_in_route = []
    var numba_of_stiff = 0
    for (obje of route) {

        // console.log(obje)
        var route_lat = obje.lat
        var round_route_lat = route_lat.toFixed(3)
        var route_lng = obje.lng
        var round_route_lng = route_lng.toFixed(3)
        console.log(round_route_lat)
        console.log(round_route_lng)
        for (var vall of values_outside) {
            var vall_latitude = vall.Latitude
            var vall_longititude = vall.Longitude
            var round_vall_lat = vall_latitude.toFixed(3)
            var round_vall_lng = vall_longititude.toFixed(3)
            if (round_route_lat == round_vall_lat && round_vall_lng == round_route_lng) {
                numba_of_stiff += 1
                const latlng1 = {
                    lat: vall.Latitude,
                    lng: vall.Longitude
                    }
                check1.push(latlng1)
            }
        }

    }
    // var error_msg = "there are" + numba_of_stiff + "accidents/roadworks in your path!"
    // if (numba_of_stiff > 0) {
    //     document.getElementById("left1").innerHTML = error_msg
    // }
}, function (error) {
    console.log("ERROR", error)
})
for (let line of values) {
    var icon = {}
    const latlng = {
        lat: line.Latitude,
        lng: line.Longitude
    }
    // console.log(line.Type)
    if (line.Type == 'Roadwork' && check1.includes(latlng)) {
        var marker = new google.maps.Marker({
            position: latlng,
            //map: window.map,
            map: map,
            icon: {
                url: "src/img/traffic/roadwork_color.png",
                scaledSize: new google.maps.Size(35, 35)
            }
        });
        accident_coords.push(latlng)
    }
    if (line.Type == 'Vehicle breakdown' && check1.includes(latlng)) {
        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            icon: {
                url: "src/img/traffic/breakdown_color.png",
                scaledSize: new google.maps.Size(35, 35)
            }
        });
        accident_coords.push(latlng)
    }
    if (line.Type == 'Accident' && check1.includes(latlng)) {
        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            icon: {
                url: "src/img/traffic/accident_color.png",
                scaledSize: new google.maps.Size(35, 35)
            }
        });
        accident_coords.push(latlng)
    }
    if (line.Type == 'Unattended Vehicle' && check1.includes(latlng)) {
        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            icon: {
                url: "src/img/traffic/abandoned.png",
                scaledSize: new google.maps.Size(35, 28)
            }
        });
        accident_coords.push(latlng)
    }
    if (line.Type == 'Diversion' && check1.includes(latlng)) {
        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            icon: {
                url: "src/img/traffic/roadwork.png",
                scaledSize: new google.maps.Size(35, 28)
            }
        });
        accident_coords.push(latlng)
    }
    if (line.Type == 'Misc.' && check1.includes(latlng)) {
        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            icon: {
                url: "src/img/traffic/misc.png",
                scaledSize: new google.maps.Size(35, 28)
            }
        });
        accident_coords.push(latlng)
    }
    if (line.Type == 'Road Block' && check1.includes(latlng)) {
        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            icon: {
                url: "src/img/traffic/roadblock.png",
                scaledSize: new google.maps.Size(35, 28)
            }
        });
        accident_coords.push(latlng)
    }
    if (line.Type == 'Heavy Traffic' && check1.includes(latlng)) {
        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            icon: {
                url: "src/img/traffic/congestion-removebg-preview.png",
                scaledSize: new google.maps.Size(35, 28)
            }
        });
        accident_coords.push(latlng)
    }
    
    // var marker = new google.maps.Marker({position: latlng, map: window.map});
}
console.log(accident_coords)
return accident_coords//end of for loop
})
}