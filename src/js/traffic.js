let all_accident = []
function initMap() {

    var loc = {
        lat: 1.2963,
        lng: 103.8502
    };
    var map = new google.maps.Map(document.getElementById("map"), {
        center: loc,
        zoom: 12,
    });

    window.map = map

    var marker = new google.maps.Marker({
        position: loc,
        map: window.map
    });

    let api_endpoint_url1 = '../../src/js/traffic_accident.php'
    axios.get(api_endpoint_url1, {
        headers: {
            'AccountKey': 'rA62Al3wSpWoBqzOBOIC6g==',
            'accept': 'application/json',
        }
    })
        .then(response => {
            var values = response.data[0].value
            
            values_outside = values

            for (let line of values) {
                var icon = {}
                const latlng = {
                    lat: line.Latitude,
                    lng: line.Longitude
                }
                // console.log(line.Type)
                if (line.Type == 'Roadwork') {
                    var marker = new google.maps.Marker({
                        position: latlng,
                        map: window.map,
                        icon: {
                            url: "../../src/img/traffic/roadwork_color.png",
                            scaledSize: new google.maps.Size(35, 35)
                        }
                    });
                }
                if (line.Type == 'Vehicle breakdown') {
                    var marker = new google.maps.Marker({
                        position: latlng,
                        map: window.map,
                        icon: {
                            url: "../../src/img/traffic/breakdown_color.png",
                            scaledSize: new google.maps.Size(35, 35)
                        }
                    });
                }
                if (line.Type == 'Accident') {
                    var marker = new google.maps.Marker({
                        position: latlng,
                        map: window.map,
                        icon: {
                            url: "../../src/img/traffic/accident_color.png",
                            scaledSize: new google.maps.Size(35, 35)
                        }
                    });
                }
                if (line.Type == 'Unattended Vehicle') {
                    var marker = new google.maps.Marker({
                        position: latlng,
                        map: window.map,
                        icon: {
                            url: "../../src/img/traffic/abandoned.png",
                            scaledSize: new google.maps.Size(35, 28)
                        }
                    });
                }
                if (line.Type == 'Diversion') {
                    var marker = new google.maps.Marker({
                        position: latlng,
                        map: window.map,
                        icon: {
                            url: "../../src/img/traffic/roadwork.png",
                            scaledSize: new google.maps.Size(35, 28)
                        }
                    });
                }
                if (line.Type == 'Misc.') {
                    var marker = new google.maps.Marker({
                        position: latlng,
                        map: window.map,
                        icon: {
                            url: "../../src/img/traffic/misc.png",
                            scaledSize: new google.maps.Size(35, 28)
                        }
                    });
                }
                if (line.Type == 'Road Block') {
                    var marker = new google.maps.Marker({
                        position: latlng,
                        map: window.map,
                        icon: {
                            url: "../../src/img/traffic/roadblock.png",
                            scaledSize: new google.maps.Size(35, 28)
                        }
                    });
                }
                if (line.Type == 'Heavy Traffic') {
                    var marker = new google.maps.Marker({
                        position: latlng,
                        map: window.map,
                        icon: {
                            url: "../../src/img/traffic/congestion-removebg-preview.png",
                            scaledSize: new google.maps.Size(35, 28)
                        }
                    });
                }

                // var marker = new google.maps.Marker({position: latlng, map: window.map});
            }//end of for loop

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
                        }
                    }

                }
                var error_msg = "there are" + numba_of_stiff + "accidents/roadworks in your path!"
                if (numba_of_stiff > 0) {
                    document.getElementById("left1").innerHTML = error_msg
                }
            }, function (error) {
                console.log("ERROR", error)
            })
        })

}
var app = Vue.createApp({

    data() {
        return {
            test: "hello world 123",
            accidents: [],
            services_affected: [],
            
            selected_service_no: '',
            accident_details: {},//{accident: type, lat, long }
            

        }
    },

    methods:{
        get_accident(){
            console.log("=== [traffic.js] get_accident() ===")
            let api_endpoint_url1 = '../../src/js/traffic_accident.php'
            axios.get(api_endpoint_url1, {
                headers: {
                    'AccountKey': 'rA62Al3wSpWoBqzOBOIC6g==',
                    'accept': 'application/json',
                }
            })
            .then(response => {

                var response = response.data
                console.log(response)
                
                for(var res of response){
                    //response is the array of objects of 500s
                    let accident_object = res.value
                    //res.value is the individual arrays with objects
                    console.log(res.value)
                    if(accident_object != [] ){
                        for(var accident of accident_object){
                            this.accidents.push(accident)
                            all_accident.push(accident)
                        }
                        console.log("===get_accident()===")
                        console.log(all_accident)
                
                    }
                    console.log(this.accidents)
                }
                //array of objects(key = number key = type,lat,long)
                this.accident_details
            })
            .catch(error => {
                console.log(error.message)
            })
        },
        get_roadworks(){

            console.log("=== [traffic.js] get_roadworks() ===")
            let api_endpoint_url1 = '../../src/js/traffic_roadworks.php'
            axios.get(api_endpoint_url1, {
                headers: {
                    'AccountKey': 'rA62Al3wSpWoBqzOBOIC6g==',
                    'accept': 'application/json',
                }
            })
            .then(response => {
                console.log('test')
                var response = response.data
                console.log(response)
                for(res of response){
                    console.log(res)
                }
                
                
            })
            .catch(error => {
                console.log(error.message)
            })
        }
    }
})

app.mount("#appp")
// alert("this is traffic js")