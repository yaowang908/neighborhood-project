import createMarkerComponent from './createMarker';
import { getMarkerLatLng } from './createMarker';

export default class hereApiMapEvents {

  constructor(map){//accept map object as parameter
    //Enable the event system on the map instance;
    this.map = map;
    this.mapEvents = new H.mapevents.MapEvents(map);
    //Instantiate the default behavior, providing the mapEvents object;
    this.behavior = new H.mapevents.Behavior(this.mapEvents);
  }

  createMarker(map, searchText, platform, markerDomTemplate){
    return createMarkerComponent(map, searchText, platform, markerDomTemplate);
    //promise
  }

  getMarkersLatLng(searchText, platform){
    return getMarkerLatLng(searchText, platform);
  }

}






