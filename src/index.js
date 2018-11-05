import './styles/main.scss';
import $ from 'jquery';

var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 40.750, lng: -74.001 },//Manhattan Midtown NY
        zoom: 13
    });
}

window.initMap = initMap;

//inject google map api  
$("body").append('<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDeFIT4z8Ef8rVvIUq2NfiUX3LOko5yNso&callback=initMap" async defer ></script >');