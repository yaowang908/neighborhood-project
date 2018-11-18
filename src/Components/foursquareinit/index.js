import $ from 'jquery';
import foursQuareSearch from './search';
import foursQuareGetVenueDetail from './getVenueDetail';
import noPhotoAvailable from '../../../assets/No-Photo-Available.jpg';

export default class fourSquareApi {
  constructor(){
    this.init = {
      'Client_ID': 'YNK5MRRYLPVAJSGWLZ52IO33TXOBLE4HC53M5V22TVT5RTP1',
      'Client_Secret': 'TFJMXGFUERXEMKPP1CTL4DP2ZC44ZFPBXRTGDSXDMTNK0NEW'
    };
    this.search = this.search.bind(this);
  }

  search(lat,lng,query){
    let self = this;
    return foursQuareSearch(self.init.Client_ID,self.init.Client_Secret,lat,lng,query).then((data)=>{
      return data;
    });
  }

  detail(venueID){
    let self = this;
    return foursQuareGetVenueDetail(venueID, self.init.Client_ID,self.init.Client_Secret).then((data)=>{
      return data;
    });
  }

  bestPhotoUrl(result) {
    let self = this;
    if(result.response.venue.bestPhoto) {
      return result.response.venue.bestPhoto.prefix+
                result.response.venue.bestPhoto.width+ 'x' +
                result.response.venue.bestPhoto.height+
                result.response.venue.bestPhoto.suffix;
    } else {
      return noPhotoAvailable;
    }

  }
}


