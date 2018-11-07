import getLatLng from '../services/getLatLng';

export default function mapInit(mapCenterAddress) {
    //here.com api init
    let platform = new H.service.Platform({
        'app_id': 'hmO1N6Q0xkefhNezXaem',
        'app_code': '9U0sBjTtpmZciXxSvfHFbg'
    });

    // Obtain the default map types from the platform object:
    let defaultLayers = platform.createDefaultLayers();

    // let centerpoint = { lat: 40.750, lng: -74.001 };

    return getLatLng(mapCenterAddress, platform).then(function(customMapCenter){
        // console.log('centerpoint is:' + customMapCenter.lat);
        return customMapCenter
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
