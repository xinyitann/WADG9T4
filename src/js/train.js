var app = Vue.createApp({

  data() {
      return {
          status:'2',
          AffectedSegments:[ // affectedsegment object
            {
              "Line":"NEL",
              "Direction":"HarbourFront",
              "Stations":"NE9,NE8,NE7,NE6",
              "FreePublicBus":"",
              "FreeMRTShuttle":"",
              "MRTShuttleDirection":""
            }




          ],// line, direction, stations, FreePublicBus, FreeMRTShuttle, MRTShuttleDirection (array of objects)
          Message:[
            {
              "Content":"1657 hrs",
              "CreatedDate":""
            }
          ],

          table_headers: [
            "Line",
            "Direction",
            "Stations",
            "Remarks"
            
        ],



        
      }
  }

})
app.mount("#app")