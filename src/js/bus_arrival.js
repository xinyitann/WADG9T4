var app = Vue.createApp({

    data() {
        return {
            selected_bus_stop_code: '',
            selected_bus_stop: '',
            bus_stop_hidden: '',
            bus_stops: [],
            services: [],
            selected_service_no: '',
            selected_bus_stop_arrivals: {}
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
                    var response = response.data.Services
                    next_bus_no = 0
                    console.log(response)
                    for (res of response) {
                        const current = Date().slice(16,24);
                        console.log(current);
                        var time = res.NextBus.EstimatedArrival
                        time = time.slice(11,19)
                        console.log(time)
                        console.log(time - current)
                        var ServiceNo = res.ServiceNo
                        console.log(res)
                        var first_bus = []
                        // first_bus.push(res)
                        // this.selected_bus_stop_arrivals[ServiceNo] = 
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
                console.log(response)

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


        let api_endpoint_url2 = 'http://datamall2.mytransport.sg/ltaodataservice/BusServices'
        axios.get(api_endpoint_url2, {
                headers: {
                    'AccountKey': '3+qMwmsMR1+Y4uxlex3DvA==',
                    'accept': 'application/json',

                }
            })
            .then(response => {
                var response = response.data.value
                for (res of response) {
                    this.services.push(res.ServiceNo)
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