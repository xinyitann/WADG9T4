var app = Vue.createApp({

    data() {
        return {
            road_names: [],
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

                var response = response.data[0].value
                console.log(response)
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
                for(res of response)
                console.log(response)
                
            })
            .catch(error => {
                console.log(error.message)
            })
        }
        
    }
})
app.mount("#appp")