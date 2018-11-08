import geocodingservice from '../services/geocoding'; 
import getLatLng from '../services/getLatLng';

export default function createMarker(map, searchText, platform, markerIconLetter = 'H'){

    let markerIconDom = '<div class="markers"><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><rect stroke="white" fill="#1b468d" x="1" y="1" width="22" height="22" /><text x="12" y="18" font-size="12pt" font-family="Arial" font-weight="bold" text-anchor="middle" fill="white">'+ markerIconLetter +'</text></svg></div>'
    console.log(markerIconLetter);
    let icon = new H.map.DomIcon(markerIconDom);

    getMarkerLatLng(searchText,platform).then(function(latlng){
        //get an objects array or one pair of lat lng
        // console.dir(latlng);
        if(typeof value === 'array'){
            latlng.map((x) => {
                let marker = new H.map.DomMarker(x, { icon: icon });
                map.addObject(marker);
            });
            return true;
        } else {
            let marker = new H.map.DomMarker(latlng, { icon: icon });
            map.addObject(marker);
            return true;
        }
        
    }).catch(function(err){
        alert("Something is wrong! See below:" + err);
    });
}

function getMarkerLatLng(searchText,platform) {
    if(typeof searchText === 'array') {
        //get multiple lat lng
        return Promise.all(searchText.map((x)=>{
                getLatLng(x,platform);
            })).then(function(value){
                return value;//an array contains all lat lng
        })
        
    } else {
        //get single lat lng
        return  getLatLng(searchText, platform).then(function(value){
                    // console.log(value);
                    return value; //a object contains one pair of lat lng
                });
    }
}