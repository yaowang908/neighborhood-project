import $ from 'jquery';
import foursquaresearch from './search';

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
        return foursquaresearch(self.init.Client_ID,self.init.Client_Secret,lat,lng,query).then((data)=>{
            return data;
        });        
    }
}


