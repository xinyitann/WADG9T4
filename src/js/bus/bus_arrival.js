var app = Vue.createApp({

    data() {
        return {
            selected_bus_stop_code: '',
            selected_bus_stop: '',
            bus_stop_hidden: '',
            bus_service_hidden: '',
            bus_stops: {},
            services: [],
            selected_service_no: '',
            selected_bus_stop_arrivals: {},
            bus_service_sequence: {},
            bus_direction_points: {}
        }
    },

    methods: {
        get_arrival_time_bus_stop() {
            console.log(this.selected_bus_stop)
            this.bus_stop_hidden = 'false'
            let api_endpoint_url = 'http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=' + this.selected_bus_stop_code
            axios.get(api_endpoint_url, {
                    headers: {
                        'AccountKey': '3+qMwmsMR1+Y4uxlex3DvA==',
                        'accept': 'application/json',
                    }
                })
                .then(response => {
                    Object.keys(this.selected_bus_stop_arrivals).forEach(key => {
                        delete this.selected_bus_stop_arrivals[key];
                    })
                    console.log('here')
                    console.log(this.selected_bus_stop_arrivals)
                    var response = response.data.Services
                    next_bus_no = 0
                    // console.log(response)
                    for (res of response) {
                        console.log(res)
                        const current = new Date()
                        var bus_big_list = []
                        for (i = 1; i <= 3; i++) {
                            var bus_no = 'NextBus'
                            var bus_inner_list = []
                            if (i == 1) {
                                var time = res[bus_no].EstimatedArrival
                                time = new Date(time)
                                var diff = (time.getTime() - current.getTime()) / 1000;
                                diff /= 60;
                                diff = Math.abs(Math.round(diff));
                                if (diff == 1) {
                                    diff = 'Arr'
                                }
                                var feature = res[bus_no].Feature
                                var capacity = res[bus_no].Load
                                var type = res[bus_no].Type
                                bus_inner_list.push(diff, feature, capacity, type)
                                console.log(bus_inner_list)

                            } else {
                                bus_no += i
                                if (res[bus_no].DestinationCode.length > 0) {
                                    var time = res[bus_no].EstimatedArrival
                                    time = new Date(time)
                                    var diff = (time.getTime() - current.getTime()) / 1000;
                                    diff /= 60;
                                    diff = Math.abs(Math.round(diff));
                                    if (diff == 1) {
                                        diff = 'Arr'
                                    }
                                    var feature = res[bus_no].Feature
                                    var capacity = res[bus_no].Load
                                    var type = res[bus_no].Type
                                    bus_inner_list.push(diff, feature, capacity, type)
                                    console.log(bus_inner_list)
                                }
                            }
                            bus_big_list.push(bus_inner_list)
                        }
                        console.log(bus_big_list)
                        var ServiceNo = res.ServiceNo
                        console.log(ServiceNo)
                        this.selected_bus_stop_arrivals[ServiceNo] = bus_big_list
                        console.log(this.selected_bus_stop_arrivals)
                    }

                })
                .catch(error => {
                    console.log(error.message)
                })
        },

        get_bus_stop_name() {
            for (bus_stop in this.bus_stops) {
                if (this.bus_stops[bus_stop] == this.selected_bus_stop_code) {
                    return bus_stop
                }
            }
        },

        get_capacity_color(cap) {
            if (cap == 'SEA') {
                return 'green'
            } else if (cap == 'SDA') {
                return 'yellow'
            } else {
                return 'red'
            }
        },
        get_arrival_time_bus_service() {
            // get the bus stop sequence and the direction from bus route
            // have an object with two list, in the list save the bus stop code (the sequence would be the order we push in) 
            // store the bus route to the list with both direction into different list
            // get the first and the last bus stop from both direction for the drop down (using the bus stops one or the list above)
            // get the arrival time base on the bus stop code
            // display bus stop code, bus stop name, arrival time, capacity, feature, type
            let api_endpoint_url = 'http://datamall2.mytransport.sg/ltaodataservice/BusRoutes'
            axios.get(api_endpoint_url, {
                    headers: {
                        'AccountKey': '3+qMwmsMR1+Y4uxlex3DvA==',
                        'accept': 'application/json',
                    }
                })
                .then(response => {
                    // var response = response.data.value
                    // console.log(response)
                    this.bus_service_hidden = 'false'
                    var start_direction = response[0].Direction
                    var first_list = []
                    var second_list = []
                    for (res of response) {
                        // get the bus stop sequence and the direction from bus route
                        if (res.ServiceNo == this.selected_service_no) {
                            var direction = res.Direction
                            // store the bus route to the list with both direction into different list
                            if (direction == start_direction) {
                                first_list.push(res.BusStopCode)
                            } else {
                                second_list.push(res.BusStopCode)
                            }
                        }
                    }
                    // have an object with two list, in the list save the bus stop code (the sequence would be the order we push in) 
                    if (first_list.length > 0) {
                        this.bus_service_sequence[1] = first_list
                    }
                    if (second_list.length > 0) {
                        this.bus_service_sequence[2] = second_list
                    }
                    console.log(first_list)
                    console.log(second_list)
                    console.log(this.bus_service_sequence)


                    // get the first and the last bus stop from both direction for the drop down (using the bus stops one or the list above)
                    // get the arrival time base on the bus stop code
                    // display bus stop code, bus stop name, arrival time, capacity, feature, type
                })
                .catch(error => {
                    console.log(error.message)
                })
        },

        get_first_last_stop() {
            // console.log(this.bus_service_sequence)
            var first = []
            var second = []
            for (direction in this.bus_service_sequence) {
                console.log(direction)
                var first_stop = this.bus_service_sequence[direction][0]
                var second_stop = this.bus_service_sequence[direction][this.bus_service_sequence[direction].length - 1]
                console.log(first_stop)
                console.log(second_stop)
                for (desc in this.bus_stops) {
                    // console.log(desc)
                    // console.log(this.bus_stops[desc])
                    if (this.bus_stops[desc] == first_stop) {
                        var first_stop_desc = desc
                    } else if (this.bus_stops[desc] == second_stop) {
                        var second_stop_desc = desc
                    }
                }
                // console.log(this.bus_stops)
                // var first_stop_desc = Object.keys(this.bus_stops).filter(k=>this.bus_stops[k]===first_stop)
                // var second_stop_desc = this.getObjKey(this.bus_stops, first_stop)
                console.log(first_stop_desc)
                console.log(second_stop_desc)
                // console.log(this.bus_service_sequence[direction][0])
                // console.log(this.bus_service_sequence[direction][this.bus_service_sequence[direction].length - 1])

                // this.bus_direction_points[direction] = 
                // var string = 
            }
        },


    },
    created() {
        // let api_endpoint_url1 = 'http://datamall2.mytransport.sg/ltaodataservice/BusStops'
        let api_endpoint_url1 = '../../src/php/bus/bus_stops.php'
        axios.get(api_endpoint_url1)
            .then(response => {
                // var response = response.data.value
                var response = response.data
                console.log(response)

                for (res of response) {
                    console.log(res.value)
                    var block = res.value
                    for (value of block) {
                        var bus_obj = {}
                        console.log(value)
                        var desc = value.Description
                        console.log(desc)
                        if (desc in this.bus_stops) {
                            continue
                        } else {
                            var correct_desc = ''
                            var words = desc.split(' ')
                            for (word of words) {
                                correct_desc += word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() + ' ';
                            }
                            this.bus_stops[correct_desc] = value.BusStopCode
                            console.log('here')
                            console.log(this.bus_stops.length)
                        }
                    }
                }

                console.log(this.bus_stops)

                this.bus_stops = Object.keys(this.bus_stops)
                    .sort()
                    .reduce((accumulator, key) => {
                        accumulator[key] = this.bus_stops[key];

                        return accumulator;
                    }, {});


                // for (res of response) {
                //     var bus_obj = {}
                //     var desc = res.Description
                //     if (desc in this.bus_stops) {
                //         continue
                //     } else {
                //         var correct_desc = ''
                //         var words = desc.split(' ')
                //         for (word of words) {
                //             correct_desc += word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() + ' ';
                //         }
                //         this.bus_stops[correct_desc] = res.BusStopCode
                //         // console.log(this.bus_stops)
                //     }
                // }


                // this.bus_stops = Object.keys(this.bus_stops).sort()
                // console.log(this.bus_stops)
                // this.bus_stops = Object.keys(this.bus_stops)
                //     .sort()
                //     .reduce((accumulator, key) => {
                //         accumulator[key] = this.bus_stops[key];

                //         return accumulator;
                //     }, {});

            })
            .catch(error => {
                console.log(error.message)
            })


        let api_endpoint_url2 = '../../src/php/bus_route.php'
        axios.get(api_endpoint_url2)
            .then(response => {
                console.log(response)
                var response = response.data.value
                for (res of response) {
                    var service = res.ServiceNo
                    if (this.services.includes(service)) {
                        continue
                    } else {
                        this.services.push(service)
                    }
                }
                this.services = this.services.sort()

            })
            .catch(error => {
                console.log(error.message)
            })
    }

})
app.mount("#app")