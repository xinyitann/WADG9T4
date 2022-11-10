var app = Vue.createApp({

    data() {
        return {
                carparkID: '',
                area: '',
                development: [],
                location: [],
                available_lots: '',
                bus_stop_hidden: '',
                lotType: '',
                pos: {},
                agency: '',
        }
    },

    methods: {
        get_user_location() {
            if (navigator.geolocation) {
                console.log('jere')
                // navigator.geolocation.getCurrentPosition(this,showposition,errorCoor,{maximumAge:60000, timeout:5000, enableHighAccuracy:true})
                navigator.geolocation.getCurrentPosition(position => {
                    this.pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                }, () => {
                    // Browser supports geolocation, but user has denied permission
                    this.pos = {
                        lat: 1.29,
                        lng: 103.8
                    };
                }, {
                    timeout: 50000
                });
            } else {
                // Browser doesn't support geolocation
                this.pos = {
                    lat: 1.29,
                    lng: 103.8
                };
            }
            console.log(this.pos)
        },

        carpark_avalibility() {
            console.log("yes")

            let api_endpoint_url = '../src/php/car/carpark_avalibility.php' 
            axios.get(api_endpoint_url)
                .then(response => {
                    console.log("SUCCESS")
                    console.log(response)
                    console.log(response.data[0].value[0])
                    for(res of response.data[0].value) {
                        console.log(res)
                        var coord = res.Location
                        var car_id = res.CarParkID
                        var car_lat = Number(coord.slice(0,7))
                        var car_lng = Number(coord.slice(8,17))
                        var car_park = {}
                        car_park['latitude'] = car_lat
                        car_park['longitude'] = car_lng
                        if (car_park in this.location) {
                            continue
                        } else {
                            this.location[car_id] = car_park
                        }
                        console.log(this.location)
                    }

                })
                .catch(error => {
                    console.log(error.message)
                })
        },
        get_carpark_map() {
            console.log('here')
            console.log(this.bus_stop_location)
            if (Object.keys(this.pos).length = 0) {
                this.get_user_location()
            }
            for (bus_stop in this.bus_stop_location) {
                // console.log(this.bus_stop_location[bus_stop])
                // console.log(this.pos)
                var lat1 = this.bus_stop_location[bus_stop].latitude
                var long1 = this.bus_stop_location[bus_stop].longitude
                var lat2 = this.pos.lat
                var long2 = this.pos.lng//wya
                var dist = this.distanceInKmBetweenEarthCoordinates(lat1, long1, lat2, long2)
                // console.log(dist)
                if (dist < 500) {
                    var list = []
                    list.push(bus_stop.split(' - ')[0])
                    list.push(this.bus_stop_location[bus_stop]['latitude'])
                    list.push(this.bus_stop_location[bus_stop]['longitude'])
                    list.push(bus_stop)
                    console.log(list)
                    this.list_of_stops.push(list)
                }
            }
            console.log(this.list_of_stops)
            window.initMap = this.initMap();
        }

    },
})
app.mount("#app")
