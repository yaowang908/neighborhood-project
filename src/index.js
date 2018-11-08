import './styles/main.scss';
import hereApiMapEvents from './Components/mapevent/index';
import mapInit from './Components/mapinit/index';
import loadding from './Components/loading/index';
import sidePanel from './Components/sidePanel/index';
import $ from 'jquery';
import ko from 'knockout';

loadding();//add loading page fro slow connection
sidePanel();//add sidepanel

let mapCenterText = 'Midtown, New York, NY';

mapInit(mapCenterText).then((value)=>{
    $('.loading').css('display','none');
    let [platform, defaultLayers, map, ui] = value;
    let myMapEvent = new hereApiMapEvents(map);
    myMapEvent.whenYouTap();

    let districtArray = ['China town, Manhattan, NY','Midtown, Manhattan, NY','Central Park, Manhattan, NY'];
    let districtMarkerIconLetter = 'D';//Location
    //create location markers with customized iconLetter and className
    myMapEvent.createMarker(map, districtArray, platform, districtMarkerIconLetter, 'district');
    
    let restaurantArray = ['300 Park Ave, New York, NY 10022','225 E 60th St, New York, NY 10022','315 5th Ave Fl 2, New York, NY 10016'];
    let restaurantMarkerIconLetter = "F";//Food
    //create restaurant markers with customized iconLetter and className
    myMapEvent.createMarker(map, restaurantArray, platform, restaurantMarkerIconLetter, 'restaurant');

})

