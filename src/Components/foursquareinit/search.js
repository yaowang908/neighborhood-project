import $ from 'jquery';

export default function foursquaresearch(Client_ID, Client_Secret ,lat, lng, query) {
    return $.ajax({
        type: "GET",
        dataType: "jsonp",
        cache: false,
        url: "https://api.foursquare.com/v2/venues/search?client_id=" + Client_ID + "&client_secret=" + Client_Secret + "&ll="+lat+","+lng+"&query="+query+"&v=20181113"
    }).done((data) => {
        // console.log(data);
        return data;
    }).fail((err) => {
        console.log('Err: ' + err);
    });
}