import geocodingservice from './geocoding';

//get latlng from here.com api with Promise
export default function getLatLng(searchText,platform) {
    let latlng={};
    return new Promise((resolve,reject)=>{
                geocodingservice(searchText, platform, function(result) {
                    let locations = result.Response.View[0].Result;
                    //Add a marker for each location found
                    latlng = {
                        lat: locations[0].Location.DisplayPosition.Latitude,
                        lng: locations[0].Location.DisplayPosition.Longitude
                    };
                    // console.dir(latlng);
                    resolve(latlng);
                },function(err){
                    reject(err);
                });
            });
}