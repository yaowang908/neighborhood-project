import './styles/main.scss';
import $ from 'jquery';
import hereApiMapEvents from './Components/mapevent/index';
import mapInit from './Components/mapinit/index';

let mapCenterText = 'Flushing, New York, NY';

mapInit(mapCenterText).then((value)=>{
    let [platform, defaultLayers, map, ui] = value;
    let myMapEvent = new hereApiMapEvents(map);
    myMapEvent.whenYouTap();

    //create the parameters for the geocoding request;
    let searchText= 'China town, Manhattan, NY';

    //create marker
    myMapEvent.createMarker(map,searchText,platform);
})

