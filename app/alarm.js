var zipcode;
var travelTime = {};
var destination = {};
var startLocation = {};
var weatherHasBeenChecked = false;
var differenceInMinutes;
var alarm={
  showcurrenttime:function(){//gets run once a second to increment the time on the
    var currDate = new Date();
    var currentTime = currDate.getHours()+":"+ currDate.getMinutes()+":"+currDate.getSeconds();
    this.currTimeRef.innerHTML = currentTime;
    this.currTimeRef.setAttribute( "title", currentTime);
    if (typeof this.hourwake != "undefined"){ //if alarm is set
      if((currDate.getHours() ===  (parseInt(this.hourwake))-1 || currDate.getHours() ===  (parseInt(this.hourwake))) && weatherHasBeenChecked === false){
        zipcode = zipcode === "" ? "94103" : zipcode;  //had to include above nested conditional in case someone set an alarm for the same hour
        weatherCheck(zipcode);
      }
      if (this.currTimeRef.title == (this.hourwake + ":" + this.minutewake + ":" + this.secondwake)){
        clearInterval(alarm.timer);
        window.location="https://youtu.be/CSvFpBOe8eY?t=41";
      }
    }
  },
  init:function(){

    var currDate=new Date();

    this.currTimeRef = document.getElementById("alarm_ct");

    this.submitButton = document.getElementById("submitid");

    this.submitButton.onclick = function(){
      alarm.setalarm();
      zipcode = document.getElementById("zipcode").value;
      destination.address = document.getElementById("destinationStreetAddress").value;
      startLocation.address = document.getElementById("startStreetAddress").value;
      this.disabled = true;
      getLatLong();
    };

    this.reset=document.getElementById("resetbutton");

    this.reset.onclick=function(){//turn all the buttons back on
      $('#alert').hide()
      alarm.submitButton.disabled=false;
      alarm.hourwake=undefined;//functionally disable the clock
      alarm.hourselect.disabled=false;
      alarm.minuteselect.disabled=false;
      alarm.secondselect.disabled=false;
      weatherHasBeenChecked = false;
      return false;
    };

    var selections=document.getElementsByTagName("select"); //grab the three options boxes

    this.hourselect=selections[0]; //divide them by what they contain
    this.minuteselect=selections[1];
    this.secondselect=selections[2];

    for (var i=0; i<60; i++){
      if (i<24){ //If still within range of hours field: 0-23
        this.hourselect[i]=new Option(i, i, false, currDate.getHours()==i); //Option(value, text, defaultSelected(not sure what this does, just keep it at its default value of false), selected)
      }
      this.minuteselect[i]=new Option(i, i, false, currDate.getMinutes()==i);
      this.secondselect[i]=new Option(i, i, false, currDate.getSeconds()==i);
    }

    alarm.showcurrenttime();

    alarm.timer=setInterval(function(){alarm.showcurrenttime();}, 1000);
  },
  setalarm:function(){
    this.hourwake=this.hourselect.options[this.hourselect.selectedIndex].value;
    this.minutewake=this.minuteselect.options[this.minuteselect.selectedIndex].value;
    this.secondwake=this.secondselect.options[this.secondselect.selectedIndex].value;
    this.waketime = this.hourwake + this.minutewake + this.secondwake;
    this.hourselect.disabled=true;
    this.minuteselect.disabled=true;
    this.secondselect.disabled=true;
  }
};




// var submitButton =  document.getElementById("submitbutton")

// submitButton.onclick
var weatherCheck = function(zipcode){
  var out;
  $.ajax({
    url: "http://api.openweathermap.org/data/2.5/weather?zip=" + zipcode + ",us&APPID=d4cfd0bd1508312c19df37e0c64b5bdf",
    context: document.body
  }).done(function(res) {
    if(res.rain['1h'] > 0.1){    //returns probability of rain within the next hour
      console.log("it gon' rain");
      resetAlarm();               //dat modularity
    } 
    // resetAlarm();  
  });
  weatherHasBeenChecked = true;//one want to run this function once, value set to false at top of page
};

var resetAlarm = function(){//tricky to write since I wanted only a half hour adjustment
  $('#alert').show();
  if(travelTime.difference == undefined){
    travelTime.difference = 30;
  }else{
    travelTime.difference = Math.round(travelTime.difference/60);
  };
  differenceInMinutes = travelTime.difference;
  if(alarm.minutewake > differenceInMinutes){
    alarm.minutewake = (parseInt(alarm.minutewake) - differenceInMinutes).toString();//alarm.minutewake is a string, so I need to parse it, do math, the stringify it
  }else{
    alarm.minutewake = (60 - (differenceInMinutes - parseInt(alarm.minutewake))).toString();
    alarm.hourwake = (parseInt(alarm.hourwake) - 1);
  }
};


var getLatLong = function(){
  $.ajax({
    url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + startLocation.address.replace(" ", "+") + zipcode,
    context: document.body
  }).done(function(res) {
    startLocation.latitude = res.results[0].geometry.location.lat;  
    startLocation.longitude = res.results[0].geometry.location.lng;

      $.ajax({
      url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + destination.address.replace(" ", "+") + zipcode,
      context: document.body
    }).done(function(res) {
      destination.latitude = res.results[0].geometry.location.lat;  
      destination.longitude = res.results[0].geometry.location.lng;
      checkdistance();            //god damn asynchrony 
    });
  });


};

var checkdistance = function(){
  $.ajax({
    url: "https://api.mapbox.com/v4/directions/mapbox.cycling/" + startLocation.longitude + "," + startLocation.latitude + ";" + destination.longitude + "," + destination.latitude + ".json?alternatives={true|false}&instructions={text|html}&geometry={geojson|polyline|false}&steps={true|false}&access_token=pk.eyJ1IjoidGhlZXN3ZWVuZXkiLCJhIjoiY2lqMjFkOGRsMDBkcHRvbHp0NjY1dTVxdSJ9.dyzB_rtro5mOjIOv1kPkYA",
    context: document.body
  }).done(function(res) {
    travelTime.skating = res.routes[0].duration * 1.3;//to account for difference in speed between cycling and biking

      $.ajax({ // damn asynchrony
      url: "https://api.mapbox.com/v4/directions/mapbox.walking/" + startLocation.longitude + "," + startLocation.latitude + ";" + destination.longitude + "," + destination.latitude + ".json?alternatives={true|false}&instructions={text|html}&geometry={geojson|polyline|false}&steps={true|false}&access_token=pk.eyJ1IjoidGhlZXN3ZWVuZXkiLCJhIjoiY2lqMjFkOGRsMDBkcHRvbHp0NjY1dTVxdSJ9.dyzB_rtro5mOjIOv1kPkYA",
      context: document.body
    }).done(function(res) {
      travelTime.walking = res.routes[0].duration;
      travelTime.difference = travelTime.walking - travelTime.skating
    });
  });

  
};
























