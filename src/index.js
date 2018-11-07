import './styles/main.scss';
import hereApiMapEvents from './Components/mapevent/index';
import mapInit from './Components/mapinit/index';
import loadding from './Components/loadding/index';
import $ from 'jquery';

loadding();

let mapCenterText = 'Midtown, New York, NY';

mapInit(mapCenterText).then((value)=>{
    $('.loading').css('display','none');
    let [platform, defaultLayers, map, ui] = value;
    let myMapEvent = new hereApiMapEvents(map);
    myMapEvent.whenYouTap();

    //create the parameters for the geocoding request;
    let searchText= 'China town, Manhattan, NY';

    //create marker
    myMapEvent.createMarker(map,searchText,platform);
})

