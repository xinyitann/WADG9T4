//set map

var myLatLng={lat:1.3521,lng:103.8198};
var mapOptions={
  center:myLatLng,
  zoom:13,
  mapTypeId:google.maps.MapTypeId.ROADMAP
};


//create map

var map=new google.maps.Map(document.getElementById('map'),mapOptions)

//create a directions service object

var directionsService= new google.maps.DirectionsService();

//create a directionsRenderer object which we will use to display route

var directionsDisplay=new google.maps.DirectionsRenderer();

//bind the directionsRenderer to the map 

directionsDisplay.setMap(map);

//function 

function calcRoute(){
  //create request 
  const selectedMode=document.getElementById('mode').value;
  var request ={
    origin:document.getElementById('from').value,
    destination:document.getElementById('to').value,
    travelMode: google.maps.TravelMode[selectedMode],//WALKING,BICYCLING AND TRANSIT
    unitSystem:google.maps.UnitSystem.METRIC
  }

  //Pass the request to the route metthod
  directionsService.route(request,(result,status)=>{
    if (status==google.maps.DirectionsStatus.OK){

      //get distance and time
      //get distance and time 

      const output=document.querySelector('#output');
      const destination = document.getElementById('to').value
      const source = document.getElementById('from').value

      output.innerHTML="<div class='alert-info'>From:"+source+"<br/>To:"+destination+".<br/> Driving distance:"+result.routes[0].legs[0].distance.text+".<br/>Duration : "+result.routes[0].legs[0].duration.text + ".</div>";

      var toSave = {}
      toSave['source'] = source
      toSave['destination'] = destination
      var route = []

      for (const point of result.routes[0].overview_path) {
        route.push({
          lat:point.lat(),
          lng:point.lng()
        })
      }

      toSave['route'] = route

      console.log(localStorage.getItem("users"))
      console.log(JSON.stringify(toSave))

      output.innerHTML="<div class='alert-info'>From:"+document.getElementById('from').value+"<br/>To:" +document.getElementById('to').value +".<br/> Driving distance:"+result.routes[0].legs[0].distance.text+".<br/>Duration : "+result.routes[0].legs[0].duration.text + ".</div>";

      //display route
      directionsDisplay.setDirections(result);
    }else{
      //delete route from map 
      directionsDisplay.setDirections({routes:[]});

      //center map in spain 
      map.setCenter(myLatLng);

      //show error msg
      output.innerHTML="<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not retrieve distance </div>"
    }
  })
}



//create autocomplete objects for all input 

var options={
  types:['establishment'],
  componentRestrictions:{'country':['SG']},
}

var input1=document.getElementById('from');
var autocomplete1= new google.maps.places.Autocomplete(input1,options)

var input2=document.getElementById('to');
var autocomplete2= new google.maps.places.Autocomplete(input2,options)