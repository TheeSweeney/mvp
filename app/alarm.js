var zipcode;
var destination;
var startLocation;
var weatherHasBeenChecked = false;
var alarm={
  showcurrenttime:function(){//gets run once a second to increment the time on the
    var currDate = new Date();
    var currentTime = currDate.getHours()+":"+ currDate.getMinutes()+":"+currDate.getSeconds();
    this.currTimeRef.innerHTML = currentTime;
    this.currTimeRef.setAttribute( "title", currentTime);
    if (typeof this.hourwake != "undefined"){ //if alarm is set
      if(currDate.getHours() ===  (parseInt(this.hourwake))-1 && weatherHasBeenChecked === false){
        zipcode = zipcode === "" ? "94103" : zipcode;
        weatherCheck(zipcode);
      }
      if (this.currTimeRef.title == (this.hourwake + ":" + this.minutewake + ":" + this.secondwake)){
        clearInterval(alarm.timer);
        window.location="https://youtu.be/CSvFpBOe8eY?t=35";
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
      destination = document.getElementById("destination").value;
      startLocation = document.getElementById("startLocation").value;
      this.disabled = true;
      routeCheck();
    };

    this.reset=document.getElementById("resetbutton");

    this.reset.onclick=function(){
      alarm.submitButton.disabled=false;
      alarm.hourwake=undefined;
      alarm.hourselect.disabled=false;
      alarm.minuteselect.disabled=false;
      alarm.secondselect.disabled=false;
      return false;
    };

    var selections=document.getElementsByTagName("select");

    this.hourselect=selections[0];
    this.minuteselect=selections[1];
    this.secondselect=selections[2];

    for (var i=0; i<60; i++){
      if (i<24) //If still within range of hours field: 0-23
      this.hourselect[i]=new Option(i, i, false, currDate.getHours()==i);
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
    console.log(res);
    if(res.rain['1h'] > 0.49){    //returns probability of rain within the next hour
      console.log("it gon' rain");
      resetAlarm();               //dat modularity
    }   
  });
  weatherHasBeenChecked = true;//one want to run this function once, value set to false at top of page
};

var resetAlarm = function(){//tricky to write since I wanted only a half hour adjustment
  if(alarm.minutewake > 30){
    alarm.minutewake = (parseInt(alarm.minutewake) - 30).toString();//alarm.minutewake is a string, so I need to parse it, do math, the stringify it
  }else{
    alarm.minutewake = (60 - (30 - parseInt(alarm.minutewake))).toString();
    alarm.hourwake = (parseInt(alarm.hourwake) - 1);
  }
};

var routeCheck = function(){
  var walkTime;
  var bikeTime;
  $.ajax({
    type: 'GET',
    headers:{
      "Authorization": "AIzaSyDbFHs8I-4JzwuXIR156Po0XXnZ58YfASk",
      "Access-Control-Allow-Origin": "*",
    },
    url: "https://maps.googleapis.com/maps/api/directions/json?origin="+ startLocation + "+" + zipcode + "&destination=" + destination + "+" + zipcode + "&mode=bicycling&key=AIzaSyDbFHs8I-4JzwuXIR156Po0XXnZ58YfASk"
  }).done(function(res){
    console.log(res);
  });
};

$(document).ready(function(){

  $('#submitid').click(function(){
    $('#test').show();
  });

});






















