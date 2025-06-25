import $ from 'jquery';

export default function customStyle(platform,map,selectedMapStyle) {
  let mapTileService = platform.getMapTileService({ 'type':'base' });
  let mapSchemesID = {
    day: 'normal.day',
    night: 'normal.night.grey',
    pNight: 'pedestrian.night'
  };

  let styleLayer = mapTileService.createTileLayer(//base
    'maptile',
    mapSchemesID[selectedMapStyle],
    256,
    'png8'
  );

  // console.log(mapTileService.getInfo());

  map.setBaseLayer(styleLayer);
}