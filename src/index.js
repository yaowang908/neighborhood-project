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
import customMapStyle from './Components/mapinit/customStyle';

//KO strats here
function MarkerModel(location) {
  //location: { name: 'Duke Eatery', address:'300 Park Ave, New York, NY 10022',type:'restaurant',iconLetter:'F'}
  this.className = (location.name).replace(/ /g,'_');
  this.isVisible = ko.observable(true);// data-bind="visible: isVisible , only visible when isVisible is true"
  this.name = location.name;
  this.address = location.address;
  this.iconLetter = location.iconLetter;
  this.type = location.type;
  this.latlng = {};
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
    // variables above are for here.com api
    let tempMarkers = $.map(self.locations, function (item) {
      return new MarkerModel(item);
    });
    self.markers = ko.observableArray(tempMarkers);
    self.onMapObjects = [];
    self.init = self.init.bind(self);
    self.showDetail = self.showDetail.bind(self);
    self.hideMarker = self.hideMarker.bind(self);
    self.bringBackMarker = self.bringBackMarker.bind(self);
    self.fourSquare = new fourSquareApi();
    self.wikipediaApi = new wikipediaApi();
    self.getDetailInfo = self.getDetailInfo.bind(self);
    self.filterInput = ko.observable('');
    self.filterList = ko.computed(function(){
      $.map(self.markers(),function(item){
        if(self.filterInput() && item.name.toLowerCase().indexOf(self.filterInput().toLowerCase()) == -1){
          //not empty and this marker doesn't contain filterInput()
          item.isVisible(false);
          self.hideMarker(item);
        } else if (self.filterInput() === '') {
          item.isVisible(true);
          self.bringBackMarker(item);
        }
      });
    });
    self.mapStyle = ko.observable('night');
    self.applyMapStyle = ko.computed(function () {
      customMapStyle(self.platform, self.map, self.mapStyle());
    });
    self.switchMapStyle = self.switchMapStyle.bind(self);
    self.sidePanelIsShown = ko.observable(true);
    self.toggleHideAndShow = function() {//show and hide button
        // console.log(!self.sidePanelIsShown());
        self.sidePanelIsShown(!self.sidePanelIsShown());
        console.log(self.sidePanelIsShown());
        window.dispatchEvent(new Event('resize'));//trigger map redraw
    };
    self.toggleSidePanel = ko.computed(function(){//show and hide function
      if(self.sidePanelIsShown()){
        return '0';
      } else {
        if($(window).width()>700) {
          return '-20vw';
        } else {
          return '-220px';
        }
      }
    });
    self.hideAndShow = ko.computed(function () {
      if (self.sidePanelIsShown()) {
        return 'cancel';
      } else {
        return 'subject';
      }
    });
    self.mapLeftMargin = ko.computed(function(){//set mapcontainer left margin
      if (self.sidePanelIsShown()) {
        if ($(window).width() > 700) {
          return '25vw';
        } else {
          return '240px';
        }
      } else {
        return 0;
      }
    });
    self.mapWidth = ko.computed(function(){//set mapcontainer width
      if (!self.sidePanelIsShown()) {
        window.dispatchEvent(new Event('resize'));//trigger map redraw
        return '100vw';
      } else {
        if ($(window).width() > 700) {
          return '75vw';
        } else {
          return '100vw-250px';
        }
      }
    });
  }

  createMarkerDomTemplate(markerClass, markerIconLetter) {
    //marker icon template
    return '<div class="markers ' + markerClass + '"><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><rect class="marker_bg" stroke="white" fill="#1b468d" x="1" y="1" width="22" height="22" /><text x="12" y="18" font-size="12pt" font-family="Arial" font-weight="bold" text-anchor="middle" fill="white">' + markerIconLetter + '</text></svg></div>';
  }

  showDetail(marker, event, pureLatLng = false) {
    //when clicked show corresponding infowindow with details about location
    let self = this;
    //FIXED: problem was 'this' keyword inside a click event listener is refer to the DOM element not this class
    //Another problem was knockout has a second event parameter passed in by default, have to skip this
    self.ui.getBubbles().forEach(bub => self.ui.removeBubble(bub));//clear other bubbles
    if (!pureLatLng) {
      //when click on side panel
      self.getDetailInfo(marker);
    } else {
      // when clicked on map elements
      //when passing in latlng pair, need to know which marker is it
      //get marker name by marker.className
      let clickedClassName = arguments[3];
      let thisMarker;
      $.map(self.markers(),function(item){
        if(item.className === clickedClassName){
          thisMarker = item;//get clicked marker
        }
      });
      self.getDetailInfo(thisMarker);
    }

  } //end of showDetail

  getDetailInfo(marker) {
    //get info for clicked marker from Wiki API and Foursquare API
    let self = this;
    self.myMapEvent.getMarkersLatLng(marker.address, self.platform).then((location) => {
      if (marker.iconLetter === 'D') {
        //location is district
        //use wikipedia
        self.wikipediaApi.search(marker.name).then((pageid) => {
          self.wikipediaApi.getPage(pageid).then((result) => {
            // console.dir(x);
            let bubble = new H.ui.InfoBubble(location, {
              content: '<b>' + result.pageTitle + '</b><img src="' + result.url + '" width="150px"/>'
            });
            self.ui.addBubble(bubble);
            self.map.setCenter(marker.latlng);//set map center 
            return result;
          });
        }).catch((err) => {
          alert(err);
        });
      } else {
        //location is place use foursquare
        // console.log(marker);
        self.fourSquare.search(location.lat, location.lng, marker.name).then((data) => {
          // console.log(data);
          if(data.meta.code == '200'){
            //got result
            let venueID = data.response.venues[0].id;
            return venueID;
          } else {
            alert('Foursquare API err '+data.meta.code+'<br>'+data.meta.errDetail);
          }
        }).then((venueID)=>{
          self.fourSquare.detail(venueID).then((result)=>{
            console.log(result);
            if(result.meta.code == '200'){
              let photoUrl = self.fourSquare.bestPhotoUrl(result);
              // console.log(photoUrl);
              return {
                url: photoUrl,
                address:result.response.venue.location.formattedAddress,
                name: result.response.venue.name
              };
            } else {
              alert('FourSquare API err ' + result.meta.code + ' Details: ' + result.meta.errorDetail);
            }
          }).then((result)=>{
            let bubble = new H.ui.InfoBubble(location, {
              content: '<b>' + result.name + '</b><p>'+result.address[0]+'</p><img src="' + result.url + '" width="150px"/>'
            });
            self.ui.addBubble(bubble);//add info bubble
            self.map.setCenter(marker.latlng);//set map center 
            return result;
          });
        }).catch((err)=>{
          alert(err);
        });
      }
    }).catch((err) => {
      alert(err);
    });
  }//end of getDetailInfo()

  init() {
    let self = this;
    sidePanel();//add sidepanel
    //markers init
    return Promise.all($.map(self.markers(), function (item, index) {
      //create each marker on map
      let addressToSearch = item.address;
      let markerDomTemplate = self.createMarkerDomTemplate(item.className + ' ' + item.type, item.iconLetter);
      return self.myMapEvent.createMarker(self.map, addressToSearch, self.platform, markerDomTemplate).then((ll)=>{item.latlng = ll});
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
          self.showDetail(pointerLocation,'',true,item.icon.i.classList[1]);
        });
        group.addObject(item);
      });
      //get all object added to map
      return objects;
    }).catch((err) => {
      alert(err);
    });
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

  bringBackMarker(marker) {
    let self = this;
    self.ui.getBubbles().forEach(bub => self.ui.removeBubble(bub));//clear bubbles
    if (self.onMapObjects) {
      marker.isVisible(true);
      let markerObject;
      for (let i = 0; i < self.onMapObjects.length; i++) {
        //find coresponding marker on map
        if (self.onMapObjects[i].icon.i.classList[1] === marker.className) {
          markerObject = self.onMapObjects[i];
          markerObject.setVisibility(true);//show marker
        }
      }

    } else {
      //if on objects are added to map
      alert('Be patient!');
    }
  }

  switchMapStyle() {
    let self = this;
    if(self.mapStyle() === 'night') {
      self.mapStyle('day');
    } else {
      self.mapStyle('night');
    }
  }
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
    }).catch((err) => {
      alert(err);
    }).then(() => {
      ko.applyBindings(markerViewModel);
      // console.log(markerViewModel.onMapObjects);
      return;
    }).then(() => {
      if ($(window).width() > 700) {//hide or show side panel when init
        markerViewModel.sidePanelIsShown(true);
      } else {
        markerViewModel.sidePanelIsShown(false);
      }
      window.addEventListener('resize', function () {
        map.getViewPort().resize();//redraw map when window resize
      });
    }).catch((err) => { alert(err) });
  }).catch(e=>{
    console.log(e);
    window.confirm("Load unsafe script from address bar to load this app. There is not any information exchange.")
  });
});