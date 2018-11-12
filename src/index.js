import './styles/main.scss';
import hereApiMapEvents from './Components/mapevent/index';
import mapInit from './Components/mapinit/index';
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
    this.screenPointX = ko.observable();
    this.screenPointY = ko.observable();
}

function MarkersViewModel() {
    let self = this;

    self.locations = [
        { name: 'Duke Eatery', address:'300 Park Ave, New York, NY 10022',type:'restaurant',iconLetter:'F'},
        { name: 'Serendipity 3', address: '225 E 60th St, New York, NY 10022', type: 'restaurant', iconLetter: 'F'},
        { name: 'Soju Haus', address: '315 5th Ave Fl 2, New York, NY 10016', type: 'restaurant', iconLetter: 'F'},
        { name: 'China Town', address: 'China town, Manhattan, NY', type: 'district', iconLetter: 'D'},
        { name: 'Midtown', address: 'Midtown, Manhattan, NY', type: 'district', iconLetter: 'D'},
        { name: 'Chelsea', address: 'Chelsea, Manhattan, NY', type: 'district', iconLetter: 'D'}
    ];

    let tempMarkers = $.map(self.locations,function(item){return new MarkerModel(item)});

    self.markers = ko.observableArray(tempMarkers);//

    self.mapCenterText = 'Midtown, New York, NY';
    
    self.init = function (mapCenterText){
        loadding();//add loading page fro slow connection
        sidePanel();//add sidepanel
        //map init
        return mapInit(mapCenterText).then((value) => {
            $('.loading').css('display', 'none');
            let [platform, defaultLayers, map, ui] = value;
            let myMapEvent = new hereApiMapEvents(map);
            myMapEvent.whenYouTap();

            return Promise.all( $.map(self.markers(),function(item,index){
                    //create each marker on map
                    let addressToSearch = item.address;
                    let markerDomTemplate = self.createMarkerDomTemplate(item.className + " " + item.type, item.iconLetter);
                    return myMapEvent.createMarker(map, addressToSearch, platform, markerDomTemplate);
                })
            ).then(()=>{
                let objects = map.getObjects();
                //get all object added to map
                return {
                    allMarkers: objects,
                    mapReference: map
                };
            }).catch((err)=>{alert(err);});
        });//end of mapInit.then()
    } // end of init

    self.init(self.mapCenterText).then(function(result){//call init, promise ends, returned all markers
        console.dir(result.allMarkers);
        console.log(result.allMarkers[0].icon.i.classList[1]);//get marker class name
        
    }).catch((err)=>{alert(err)});

    self.createMarkerDomTemplate = function (markerClass, markerIconLetter){
        //marker icon template 
        return '<div class="markers ' + markerClass + '"><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><rect stroke="white" fill="#1b468d" x="1" y="1" width="22" height="22" /><text x="12" y="18" font-size="12pt" font-family="Arial" font-weight="bold" text-anchor="middle" fill="white">' + markerIconLetter + '</text></svg></div>';
    }

    self.hideMarker = function(marker){
        marker.isVisible(false);
        console.log(marker.className);

        console.log(marker.name+' '+marker.isVisible());
        console.log(marker.className);


    }

    self.showDetail = function(location) {
        //when clicked show corresponding infowindow with details about location
        //TODO: 
        //1.template of infowindow;2.API to 3rd party services for details 

    };
}
//KO only need data-bind , it's possible been done by changing template in createMaker.js

let markerViewModel = new MarkersViewModel();

// ko.applyBindings(markerViewModel);


$(document).ready(function(){
    setTimeout(() => {
        // let targetedArray;
        // targetedArray = markerViewModel.dynamicAddedDivClassArray;
        // console.log(targetedArray);
        // $.map((targetedArray),function(item,index){
        //     console.log(item);
        //     ko.applyBindings(markerViewModel, $('.'+item)[0]);
        // });
        ko.applyBindings(markerViewModel);
    }, 0);
    //there is a JavaScript timing issue, without this 0 timeout,this array would have some weird issue
    //see stackoverflow.com/question/32460602
});