import geocodingservice from '../services/geocoding'; 

export default function createMarker(map,searchText,platform){
    //create marker
    let onResult = function (result) {
        let locations = result.Response.View[0].Result,
            position,
            marker;
        //Add a marker for each location found
        for (let i = 0; i < locations.length; i++) {
            position = {
                lat: locations[i].Location.DisplayPosition.Latitude,
                lng: locations[i].Location.DisplayPosition.Longitude
            };
            marker = new H.map.Marker(position);
            map.addObject(marker);
        }
    };

    geocodingservice(searchText, platform, onResult);
}