import $ from 'jquery';

export default class wikipediaApi {
  constructor() {

  }

  search(searchText){
    return $.ajax({
      url:'//en.wikipedia.org/w/api.php',
      data:{
        action:'query',
        list: 'search',
        prop:'info',
        inprop: 'url',
        srsearch:searchText,
        formatversion: 2,
        format:'json'
      },
      dataType: 'jsonp'
    }).then((x)=>{
      // console.log('title',x.query.search[0].pageid);
      // console.dir(x);
      let pageid = x.query.search[0].pageid; //get first match from result list
      return pageid;
    }).fail((err)=>{
      alert(err);
    });
  }

  getPage(pageid) {
    return $.ajax({
      type:'GET',
      url: '//en.wikipedia.org/w/api.php',
      data: {
        action: 'query',
        prop: 'pageimages',
        pithumbsize: 100,
        // rvprop: 'content',
        formatversion: 2,
        format: 'json',
        pageids:pageid
      },
      dataType: 'jsonp'
    }).then((x) => {
      let thumbnailUrl = x.query.pages[0].thumbnail.source;
      let thumbnailHeight = x.query.pages[0].thumbnail.height;
      let thumbnailWidth = x.query.pages[0].thumbnail.width;
      let pageTitle = x.query.pages[0].title;
      // console.dir(x);
      let result = { url: thumbnailUrl, height: thumbnailHeight, width: thumbnailWidth, pageTitle: pageTitle };
      return result;
    }).fail((err) => {
      console.dir(err);
      alert(err);
    });
  }
}