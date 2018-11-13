import './styles/main.scss';
import hereApiMapEvents from './Components/mapevent/index';
import mapInit from './Components/mapinit/index';
import defaultLocations from './Components/mapinit/defaultMarkers.js';
import loadding from './Components/loading/index';
import sidePanel from './Components/sidePanel/index';
import $ from 'jquery';
import ko from 'knockout';

//KO strats here
function MarkerModel(location) {
    //location: { name: 'Duke Eatery', address:'300 Park Ave, New York, NY 10022',type:'restaurant',iconLetter:'F'}
    this.className = (location.name).replace(/ /g,"_");
    this.isVisible = ko.observable(true);// data-bind="visible: isVisible , only visible when isVisible is true"
    this.name = location.name;
    this.address = location.address;
    this.iconLetter = location.iconLetter;
    this.type = location.type;
    this.geoPoint = ko.observable();
    this.closeButtonEnabled = ko.observable(false);
}

class MarkersViewModel {
    constructor(platform, defaultLayers, map, ui, myMapEvent,defaultLocations){
        let self = this;
        self.platform = platform;
        self.defaultLayers = defaultLayers;
        self.map = map;
        self.ui = ui;
        self.myMapEvent = myMapEvent;
        self.locations = defaultLocations;
        let tempMarkers = $.map(self.locations, function (item) { return new MarkerModel(item) });
        self.markers = ko.observableArray(tempMarkers);

        self.onMapObjects = [];
        self.init().then(function (result) {//call init, promise ends, returned all markers
            console.dir(result);
            // console.log(result[0].icon.i.classList[1]);//get marker class name
            self.onMapObjects = result;
        }).catch((err) => { alert(err) });
    }

    createMarkerDomTemplate(markerClass, markerIconLetter) {
        //marker icon template 
        return '<div class="markers ' + markerClass + '"><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><rect stroke="white" fill="#1b468d" x="1" y="1" width="22" height="22" /><text x="12" y="18" font-size="12pt" font-family="Arial" font-weight="bold" text-anchor="middle" fill="white">' + markerIconLetter + '</text></svg></div>';
    }

    showDetail(marker, pureLatLng = false) {
        //when clicked show corresponding infowindow with details about location
        //TODO: 
        //1.template of infowindow;
        //1.5: create marker property to hold state of infobubble like isVisible
        //2.API to 3rd party services for details 
        if (!pureLatLng) {
            //passed in address, 
            //get location
            this.myMapEvent.getMarkersLatLng(marker.address, platform).then((location) => {
                let bubble = new H.ui.InfoBubble(location, {
                    content: '<b>Hellow World</b>'
                });
                ui.addBubble(bubble);
            }).catch((err) => { alert(err) })
        } else {
            //passed in latlng pair
            let bubble = new H.ui.InfoBubble(marker, {
                content: '<b>Hellow World</b>'
            });
            ui.addBubble(bubble);
        }

    } //end of showDetail

    init() {
        let self = this;
        sidePanel();//add sidepanel
        //markers init
        return Promise.all($.map(self.markers(), function (item, index) {
            //create each marker on map
            let addressToSearch = item.address;
            let markerDomTemplate = self.createMarkerDomTemplate(item.className + " " + item.type, item.iconLetter);
            return self.myMapEvent.createMarker(self.map, addressToSearch, self.platform, markerDomTemplate);
        })
        ).then(() => {
            let objects = this.map.getObjects();
            $.map(objects, function (item, index) {
                item.addEventListener('click', function () { console.log('yes!Im clicked') });
                //FIXME: addEventListener is not working
                //******Click event must monitored by knockout */
            });
            //get all object added to map
            return objects;
        }).catch((err) => { alert(err); });
    } // end of init

    showCloseButton(marker) {
        //show hide marker button
        marker.closeButtonEnabled(true);
    }
    hideCloseButton(marker) {
        //hide 'hide marker button' when mouse leave marker entry on side panel
        marker.closeButtonEnabled(false);
    }

    hideMarker(marker) {
        if (this.onMapObjects) {
            marker.isVisible(false);
            let markerObject;
            for (let i = 0; i < this.onMapObjects.length; i++) {
                // console.log(self.onMapObjects[i].icon.i.classList[1]);
                if (this.onMapObjects[i].icon.i.classList[1] === marker.className) {
                    markerObject = this.onMapObjects[i];
                }
            }
            markerObject.setVisibility(false);
            // map.removeObject(markerObject);
            // console.log(marker.name+' '+marker.isVisible());
            // console.log(marker.className);
        } else {
            //if on objects are added to map
            alert('Be patient!');
        }
    }//end of hideMarker

}// end of viewModel class

$(document).ready(function(){
    let mapCenterText = 'Midtown, New York, NY';

    loadding();//add loading page fro slow connection

    mapInit(mapCenterText).then((value) => {
        $('.loading').css('display', 'none');
        let [platform, defaultLayers, map, ui] = value;
        let myMapEvent = new hereApiMapEvents(map);
        myMapEvent.whenYouTap();

        let markerViewModel = new MarkersViewModel(platform, defaultLayers, map, ui, myMapEvent, defaultLocations);
        ko.applyBindings(markerViewModel);
    });
});