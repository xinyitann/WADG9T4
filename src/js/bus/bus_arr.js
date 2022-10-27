var app = Vue.createApp({

    data() {
        return {
            selected_bus_stop_code: '',
            selected_bus_stop: '',
            auto_complete_suggestion_bus: [],
            bus_stops: {},
            bus_stop_hidden: '',
            selected_bus_stop_arrivals: {},
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

        get_arrival_time_bus_stop() {
            this.bus_stop_hidden = 'false'
            console.log(this.bus_stops[this.selected_bus_stop])
            var code = this.bus_stops[this.selected_bus_stop]

            let api_endpoint_url = '../../src/php/bus/bus_arrival.php?BusStopCode=' + code  + '&ServiceNo=a'
            axios.get(api_endpoint_url)
                .then(response => {
                    console.log(response)
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