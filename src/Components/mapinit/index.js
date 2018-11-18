import getLatLng from '../services/getLatLng';
import $ from 'jquery';

export default function mapInit(mapCenterAddress) {
  //here.com api init
  if(typeof H === 'undefined'){
    //when cannot init here.com api,display alert and change text on loading screen
    alert('Can\'t connect to Here.com, please check your internet connection!');
    $('.loadingP').css('line-height', '30px');
    $('.loadingP').css('margin-top', '80px');
    $('.loadingP').html('Error! Can\'t connect to Here.com.');
  }
  // let platform = new H.service.Platform({
  //   'app_id': 'hmO1N6Q0xkefhNezXaem',
  //   'app_code': '9U0sBjTtpmZciXxSvfHFbg'
  // });
  //in case exceeded quota
  let platform = new H.service.Platform({
    'app_id': 'WvMncEyLG4qN2LAMyoJI',
    'app_code': 'ErwP7NMO4T_Jb3UvAkbXbg'
  });
    // Obtain the default map types from the platform object:
  let defaultLayers = platform.createDefaultLayers();

  // let centerpoint = { lat: 40.750, lng: -74.001 };

  return getLatLng(mapCenterAddress, platform).then(function(customMapCenter){
    // console.log('centerpoint is:' + customMapCenter.lat);
    return customMapCenter;
  }).then(function (customMapCenter){
    // Instantiate (and display) a map object:
    let map = new H.Map(
      document.getElementById('mapContainer'),
      defaultLayers.normal.map,
      {
        zoom: 13,
        center: customMapCenter
      });

    //create the default ui
    let ui = H.ui.UI.createDefault(map, defaultLayers, 'en-US');//zh-CN for Chinese

    return [platform,defaultLayers,map,ui];
  }).catch(function (err) {
    alert(err);
  });


}

