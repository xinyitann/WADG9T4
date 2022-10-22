var app = Vue.createApp({

    data() {
        return {
            road_names: [],
            services_affected: [],
            
            selected_service_no: '',
            selected_bus_stop_arrivals: {},
            bus_service_sequence: {}
        }
    },

    methods:{
        get_accident(){
            let api_endpoint_url= "http://datamall2.mytransport.sg/ltaodataservice/TrafficIncidents"
            axios.get(api_endpoint_url, {
                headers: {
                    'AccountKey': 'rA62Al3wSpWoBqzOBOIC6g==',
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
            })
            .catch(error => {
                console.log(error.message)
            })
        },
        get_roadworks(){
            let api_endpoint_url= "http://datamall2.mytransport.sg/ltaodataservice/RoadWorks"
            axios.get(api_endpoint_url, {
                headers: {
                    'AccountKey': 'rA62Al3wSpWoBqzOBOIC6g==',
                    'accept': 'application/json',
                }
            })
            .then(response => {
                var response = response.data.value
                console.log(response)
                
            })
            .catch(error => {
                console.log(error.message)
            })
        }
    }
})
app.mount("#app")