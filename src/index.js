import './styles/main.scss';
import hereApiMapEvents from './Components/mapevent/index';
import mapInit from './Components/mapinit/index';
import defaultLocations from './Components/mapinit/defaultMarkers.js';
import loadding from './Components/loading/index';
import sidePanel from './Components/sidePanel/index';
import $ from 'jquery';
import ko from 'knockout';
import fourSquareApi from './Components/foursquareinit/index';
import wikipediaApi from './Components/wikipedia/index';

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
        self.init = self.init.bind(self);
        self.showDetail = self.showDetail.bind(self);
        self.hideMarker = self.hideMarker.bind(self);
        self.fourSquare = new fourSquareApi();
        self.wikipediaApi = new wikipediaApi();
    }

    createMarkerDomTemplate(markerClass, markerIconLetter) {
        //marker icon template 
        return '<div class="markers ' + markerClass + '"><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><rect stroke="white" fill="#1b468d" x="1" y="1" width="22" height="22" /><text x="12" y="18" font-size="12pt" font-family="Arial" font-weight="bold" text-anchor="middle" fill="white">' + markerIconLetter + '</text></svg></div>';
    }

    showDetail(marker, event, pureLatLng = false) {
        //when clicked show corresponding infowindow with details about location
        //TODO: 
        //1.template of infowindow;
        //1.5: create marker property to hold state of infobubble like isVisible
        //2.API to 3rd party services for details 
        let self = this;
        // console.log(pureLatLng);
        //FIXED: problem was 'this' keyword inside a click event listener is refer to the DOM element not this class
        //Another problem was knockout has a second event parameter passed in by default, have to skip this 
        self.ui.getBubbles().forEach(bub => self.ui.removeBubble(bub));//clear other bubbles
        if (!pureLatLng) {
            //passed in address, 
            //get location
            self.myMapEvent.getMarkersLatLng(marker.address, self.platform).then((location) => {
                if(marker.iconLetter === 'D') {
                    //location is district
                    //use wikipedia
                    self.wikipediaApi.search(marker.name).then((pageid)=>{
                        self.wikipediaApi.getPage(pageid).then((result)=>{
                            // console.dir(x);
                            let bubble = new H.ui.InfoBubble(location, {
                                content: '<b>'+result.pageTitle+'</b><img src="'+result.url+'" />'
                            });
                            self.ui.addBubble(bubble);
                            return result;
                        });
                    }).catch((err)=>{alert(err)});
                } else {
                    //location is place use foursquare
                    self.fourSquare.search(location.lat, location.lng, 'pizza').then((data)=>{
                        console.log(data);
                    });
                }
                
            }).catch((err) => { alert(err) })
        } else {
            //TODO: when passing in latlng pair, need to know which marker is it
            //get marker name by marker.className
            //passed in latlng pair
            console.log('arguments[3]: '+arguments[3]);
            let thisMarker;
            $.map(self.markers(),function(item){
                console.log(item.className);
                if(item.className == arguments[3]){
                    thisMarker = item;
                    console.log('match!');
                    //FIXME: wont go through this if statement
                }
                
            });
            

            self.fourSquare.search(marker.lat, marker.lng, 'pizza').then((data) => {
                // console.log(data);
            });
            self.wikipediaApi.search('Midtown Manhattan').then((pageid) => {
                self.wikipediaApi.getPage(pageid).then((result) => {
                    // console.dir(x);
                    let bubble = new H.ui.InfoBubble(marker, {
                        content: '<h4>' + result.pageTitle + '</h4><img src="' + result.url + '" />'
                    });
                    self.ui.addBubble(bubble);
                    return result;
                });
            }).catch((err) => { alert(err) });
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
                let group = new H.map.Group();
                self.map.addObject(group);
                group.addEventListener('tap', function (evt) {
                    //log 'tap' and 'mouse' events,console.log(evt.type, evt.currentPointer.type);
                    //how to get clicked Geo location Latlng, console.log(map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY));
                    let pointerLocation = self.map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);
                    self.ui.getBubbles().forEach(bub=>self.ui.removeBubble(bub));//clear other bubbles
                    // console.log(item);
                    self.showDetail(pointerLocation,'',true,item.icon.i.classList[1],);
                });
                group.addObject(item);
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
        let self = this;
        self.ui.getBubbles().forEach(bub => self.ui.removeBubble(bub));//clear bubbles
        if (self.onMapObjects) {
            marker.isVisible(false);
            let markerObject;
            for (let i = 0; i < self.onMapObjects.length; i++) {
                //find coresponding marker on map
                if (self.onMapObjects[i].icon.i.classList[1] === marker.className) {
                    markerObject = self.onMapObjects[i];
                }
            }
            markerObject.setVisibility(false);//hide marker
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
        let markerViewModel = new MarkersViewModel(platform, defaultLayers, map, ui, myMapEvent, defaultLocations);
        
        markerViewModel.init().then(function (result) {//call init, promise ends, returned all markers
            // console.log(result[0].icon.i.classList[1]);//get marker class name
            markerViewModel.onMapObjects = result;
        }).catch((err) => { alert(err) }).then(() => {
            ko.applyBindings(markerViewModel);
            // console.log(markerViewModel.onMapObjects);
        });
    });
});