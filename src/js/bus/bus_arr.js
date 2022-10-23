var app = Vue.createApp({

    data() {
        return {
            selected_bus_stop_code: '',
            selected_bus_stop: '',
            auto_complete_suggestion_bus: [],
            services: [],
            selected_service_no: '',
            auto_complete_suggestion_service: [],
            bus_stops: {},
            bus_stop_hidden: '',
            bus_service_hidden: '',
            selected_bus_stop_arrivals: {},
            bus_routes: {},
            bus_service_sequence: {},
            bus_direction_points: {},
            direction: '',
            arrival_timings: {},
            service_arrival_time: '',
            service_time: []
        }
    },

    methods: {
        auto_complete_bus_stop_search() {
            this.auto_complete_suggestion_bus.length = 0
            var hint = []
            var query = this.selected_bus_stop
            if (this.selected_bus_stop != '') {
                query = query.toLowerCase()
                var len = query.length

                for (bus_stop in this.bus_stops) {
                    if (this.stristr(query, bus_stop.substr(0, len))) {
                        hint.push(bus_stop)
                    }
                }
            }
            // console.log(hint)
            this.auto_complete_suggestion_bus = hint
            // console.log(this.auto_complete_suggestion_bus)
        },
        auto_complete_bus_service_search() {
            this.auto_complete_suggestion_service.length = 0
            var hint = []
            var query = this.selected_service_no
            if (this.selected_service_no != '') {
                query = query.toLowerCase()
                var len = query.length

                for (service in this.services) {
                    if (this.stristr(query, service.substr(0, len))) {
                        hint.push(service)
                    }
                }
            }
            // console.log(hint)
            this.auto_complete_suggestion_service = hint
            // console.log(this.auto_complete_suggestion_service)
        },

        stristr(haystack, needle, bool) {
            var pos = 0;
            haystack += '';
            pos = haystack.toLowerCase().indexOf((needle + '').toLowerCase());
            if (pos == -1) {
                return false;
            } else {
                if (bool) {
                    return haystack.substr(0, pos);
                } else {
                    return haystack.slice(pos);
                }
            }
        },

        fill_bus_stops(suggestion) {
            this.selected_bus_stop = suggestion
            this.auto_complete_suggestion_bus.length = 0
        },

        fill_bus_service(suggestion) {
            this.selected_service_no = suggestion
            this.auto_complete_suggestion_service.length = 0
        },

        get_arrival_time_bus_stop() {
            this.bus_stop_hidden = 'false'
            console.log(this.bus_stops[this.selected_bus_stop])
            var code = this.bus_stops[this.selected_bus_stop]

            let api_endpoint_url = '../../src/php/bus/bus_arrival.php?BusStopCode=' + code
            axios.get(api_endpoint_url)
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

        get_capacity_color(cap) {
            if (cap == 'SEA') {
                return 'green'
            } else if (cap == 'SDA') {
                return 'yellow'
            } else {
                return 'red'
            }
        },

        get_service_sequence() {
            var service_no = this.selected_service_no
            var service_no = this.bus_routes[service_no]
            var first_list = []
            var second_list = []
            var start_direction = service_no[0][0]
            for (value of service_no) {
                if (start_direction == value[0]) {
                    first_list.push(value[1])
                } else {
                    second_list.push(value[1])
                }
            }
            if (first_list.length > 0) {
                this.bus_service_sequence[1] = first_list
            }
            if (second_list.length > 0) {
                this.bus_service_sequence[2] = second_list
            }

            console.log(this.bus_service_sequence)

            this.get_directions()
        },

        get_directions() {
            for (direction in this.bus_service_sequence) {
                var stops = {}
                var first_stop = this.bus_service_sequence[direction][0]
                var second_stop = this.bus_service_sequence[direction][this.bus_service_sequence[direction].length - 1]
                for (desc in this.bus_stops) {
                    if (this.bus_stops[desc] == first_stop) {
                        var first_stop_desc = desc
                    } else if (this.bus_stops[desc] == second_stop) {
                        var second_stop_desc = desc
                    }
                }
                console.log(this.bus_stops)
                first_stop_desc = first_stop_desc.split(' - ')[0]
                second_stop_desc = second_stop_desc.split(' - ')[0]

                var whole = first_stop_desc + " - " + second_stop_desc

                stops[whole] = first_stop

                this.bus_direction_points[direction] = stops
            }
        },

        get_bus_stop_name(bus_stop_code) {
            return Object.keys(this.bus_stops).find(key => this.bus_stops[key] === bus_stop_code)
        },

        get_bus_timing_from_service(bus_stop_code) {
            this.service_arrival_time = 'true'

            let api_endpoint_url = '../../src/php/bus/bus_arrival.php?BusStopCode=' + bus_stop_code
            axios.get(api_endpoint_url)
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
                        var bus_no = 'NextBus'
                        var bus_inner_list = []
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

                        var whole = ''

                        if (capacity == 'SEA') {
                            whole += '<p class="green">' + diff + '</p>'
                        } else if (capacity == 'SDA') {
                            whole += '<p class="yellow">' + diff + '</p>'
                        } else {
                            whole += '<p     class="red">' + diff + '</p>'
                        }

                        if (feature == 'WAB') {
                            whole += '<i class="fa-solid fa-wheelchair display-6"></i>'
                        }
                        if (type = "SD") {
                            whole += '<img src="../../src/img/bus/dd.png" style="width:60px">'
                        } else if (type = 'DD') {
                            whole += '<img src="../../src/img/bus/dd.png" style="width:60px">'
                        } else if (type = 'BD') {
                            whole += '<img src="../../src/img/bus/bd.png" style="width:100px">'
                        }

                        console.log(whole)

                        this.service_time.push(whole)
                        
                    }
                    console.log(this.service_time)

                })
                .catch(error => {
                    console.log(error.message)
                })
        },

    },


    computed: {
        get_bus_stops() {
            let api_endpoint_url1 = '../../src/php/bus/bus_stops.php'
            axios.get(api_endpoint_url1)
                .then(response => {
                    var response = response.data

                    for (res of response) {
                        var block = res.value
                        for (value of block) {
                            var road = value.RoadName
                            var desc = value.Description
                            if (desc in this.bus_stops) {
                                continue
                            } else {
                                var correct_desc = ''
                                var words = desc.split(' ')
                                for (word of words) {
                                    correct_desc += word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() + ' ';
                                }
                                var whole = desc + " - " + road
                                this.bus_stops[whole] = value.BusStopCode
                            }
                        }
                    }
                    this.bus_stops = Object.keys(this.bus_stops)
                        .sort()
                        .reduce((accumulator, key) => {
                            accumulator[key] = this.bus_stops[key];

                            return accumulator;
                        }, {});
                })
                .catch(error => {
                    console.log(error.message)
                })
        },

        get_bus_service() {
            let api_endpoint_url1 = '../../src/php/bus/bus_service.php'
            axios.get(api_endpoint_url1)
                .then(response => {
                    var response = response.data

                    for (res of response) {
                        var block = res.value
                        for (value of block) {
                            var service = value.ServiceNo
                            if (this.services.includes(service)) {
                                continue
                            } else {
                                this.services.push(service)
                            }
                        }
                    }
                    this.services = this.services.sort()
                })
                .catch(error => {
                    console.log(error.message)
                })
        },

        get_bus_routes() {
            let api_endpoint_url1 = '../../src/php/bus/bus_route.php'
            axios.get(api_endpoint_url1)
                .then(response => {
                    var response = response.data
                    for (res of response) {
                        var block = res.value
                        for (value of block) {
                            if (value.ServiceNo in this.bus_routes) {
                                this.bus_routes[value.ServiceNo].push([value.Direction, value.BusStopCode, value.StopSequence])
                            } else {
                                this.bus_routes[value.ServiceNo] = []
                                this.bus_routes[value.ServiceNo].push([value.Direction, value.BusStopCode, value.StopSequence])
                            }
                        }
                    }

                    console.log(this.bus_routes)
                })
                .catch(error => {
                    console.log(error.message)
                })
        }
    }

})
app.mount("#app")