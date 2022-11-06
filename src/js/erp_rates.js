var app2 = Vue.createApp({

    data() {
        return {
            
        }
    },

    methods: {
        
        get_erp_rate() {
            console.log("yes")

            let api_endpoint_url = '../../src/php/car/erp.php' 
            axios.get(api_endpoint_url)
                .then(response => {
                    console.log("SUCCESS")
                    console.log(response.data)
                })
                .catch(error => {
                    console.log(error.message)
                })
        },

    },
})
app2.mount("#app2")