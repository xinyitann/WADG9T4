var app = Vue.createApp({

    data() {
        return {
            selected_bus_stop_code: '',
            selected_bus_stop: '',
            bus_stop_hidden: '',
            bus_service_hidden: '',
            bus_stops: [],
            services: [],
            selected_service_no: '',
            selected_bus_stop_arrivals: {},
            bus_service_sequence: {}
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
            for (bus_stop of this.bus_stops) {
                if (bus_stop.code == this.selected_bus_stop_code) {
                    return bus_stop.desc
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
                    var response = response.data.value
                    this.bus_service_hidden = 'false'
                    console.log(response)
                    console.log(this.selected_service_no)
                    for(res of response){
                        if(res.ServiceNo == this.selected_service_no){
                            console.log(res)
                            console.log(res.ServiceNo)
                            console.log(res.Direction)
                            
                        }
                    }
                    // get the bus stop sequence and the direction from bus route
                    // have an object with two list, in the list save the bus stop code (the sequence would be the order we push in) 
                    // store the bus route to the list with both direction into different list
                    // get the first and the last bus stop from both direction for the drop down (using the bus stops one or the list above)
                    // get the arrival time base on the bus stop code
                    // display bus stop code, bus stop name, arrival time, capacity, feature, type
                })
                .catch(error => {
                    console.log(error.message)
                })

        }


    },
    created() {
        let api_endpoint_url1 = 'http://datamall2.mytransport.sg/ltaodataservice/BusStops'
        axios.get(api_endpoint_url1, {
                headers: {
                    'AccountKey': '3+qMwmsMR1+Y4uxlex3DvA==',
                    'accept': 'application/json',

                }
            })
            .then(response => {
                var response = response.data.value
                // console.log(response)

                for (res of response) {
                    var bus_obj = {}
                    var desc = res.Description
                    if (this.bus_stops.includes(desc)) {
                        continue
                    } else {
                        bus_obj.code = res.BusStopCode
                        bus_obj.desc = desc
                        this.bus_stops.push(bus_obj)
                    }
                }
            })
            .catch(error => {
                console.log(error.message)
            })


        let api_endpoint_url2 = 'http://datamall2.mytransport.sg/ltaodataservice/BusRoutes'
        axios.get(api_endpoint_url2, {
                headers: {
                    'AccountKey': '3+qMwmsMR1+Y4uxlex3DvA==',
                    'accept': 'application/json',

                }
            })
            .then(response => {
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