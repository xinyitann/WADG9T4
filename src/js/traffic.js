var app = Vue.createApp({

    data() {
        return {
            road_names: [],
            services_affected: [],
            
            selected_service_no: '',
            accident_details: {},//{accident: type, lat, long }
            bus_service_sequence: {}

        }
    },

    methods:{
        get_accident(){
            console.log("=== [traffic.js] get_accident() ===")
            let api_endpoint_url= "http://datamall2.mytransport.sg/ltaodataservice/TrafficIncidents"
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
        },
        get_roadworks(){

            console.log("=== [traffic.js] get_roadworks() ===")
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
app.mount("#appp")