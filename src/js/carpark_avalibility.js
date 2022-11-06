var app = Vue.createApp({

    data() {
        return {
            
        }
    },

    methods: {
        
        carpark_avalibility() {
            console.log("yes")

            let api_endpoint_url = '../../src/php/car/carpark_avalibility.php' 
            axios.get(api_endpoint_url)
                .then(response => {
                    console.log("SUCCESS")
                    console.log(response)
                    for(res of response.data) {

                    }

                })
                .catch(error => {
                    console.log(error.message)
                })
        },

    },
})
app.mount("#app")