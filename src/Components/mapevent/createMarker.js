import geocodingservice from '../services/geocoding';
import getLatLng from '../services/getLatLng';
import $ from 'jquery';

export default function createMarker(map, searchText, platform, markerDomTemplate){

  // let markerIconDom = '<div class="markers '+markerClass+'"><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><rect stroke="white" fill="#1b468d" x="1" y="1" width="22" height="22" /><text x="12" y="18" font-size="12pt" font-family="Arial" font-weight="bold" text-anchor="middle" fill="white">'+ markerIconLetter +'</text></svg></div>'
  // console.dir(searchText);
  let icon = new H.map.DomIcon(markerDomTemplate,{
    onAttach: function(clonedElement,domIcon,domMarker) {
      $(clonedElement).css('transform','translateY(-=10)');
      $(clonedElement).animate({ 'top': '+=10' }, 100);

      $(clonedElement).hover(function(){
        //handler for mouse in
        //bg color #d18c17
        $(this).animate({ 'top': '-=10' },250);
      },function(){
        //handler for mouse out
        $(this).animate({ 'top':'+=10' },100);
      });
    },
    onDetach: function(clonedElement,domIcon, domMarker) {

    }
  });

  return getMarkerLatLng(searchText,platform).then(function(latlng){
    //get an objects array or one pair of lat lng
    //set markers on map
    if (Array.isArray(latlng)){
      latlng.map((x) => {
        let marker = new H.map.DomMarker(x, { icon: icon });
        map.addObject(marker);
      });
      // console.log('Here comes an array!');
      return latlng;
    } else {
      let marker = new H.map.DomMarker(latlng, { icon: icon });
      map.addObject(marker);
      return latlng;
    }

  }).catch(function(err){
    alert('Something is wrong! See below:</br>' + err);
  });
}

export function getMarkerLatLng(searchText,platform) {
  if(Array.isArray(searchText)) {
    //get multiple lat lng
    return Promise.all(searchText.map((x)=>{
      return getLatLng(x,platform);
    })).then(function(value){
      // console.log(value);
      return value;//an array contains all lat lng
    });

  } else {
    // console.log('address is: '+searchText);
    //get single lat lng
    return  getLatLng(searchText, platform).then(function(value){
      // console.log(value);
      return value; //a object contains one pair of lat lng
    }).catch((err)=>{
      alert(err);
    });
  }
}