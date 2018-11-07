export default function addTapListener(map) {
    //add event listener
    map.addEventListener('tap', function(evt){
        //log 'tap' and 'mouse' events
        console.log(evt.type, evt.currentPointer.type);
        //how to get clicked Geo location Latlng
        console.log(map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY));
    });
}