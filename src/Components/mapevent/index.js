import addTapListener from './addTapListener';
import createMarkerComponent from './createMarker';

export default class hereApiMapEvents {
    
    constructor(map){//accept map object as parameter
        //Enable the event system on the map instance;
        this.map = map;
        this.mapEvents = new H.mapevents.MapEvents(map);
        //Instantiate the default behavior, providing the mapEvents object;
        this.behavior = new H.mapevents.Behavior(this.mapEvents);
    }

    whenYouTap(callBack){
        addTapListener(this.map,callBack);
    }

    createMarker(map, searchText, platform, markerIconLetter){
        createMarkerComponent(map, searchText, platform, markerIconLetter);
    }
    
}






