import $ from 'jquery';

export default function foursQuareGetVenueDetail(Venue_ID, Client_ID, Client_Secret) {
    return $.ajax({
        type: "GET",
        dataType: "jsonp",
        cache: false,
        url: "https://api.foursquare.com/v2/venues/" + Venue_ID + "?client_id=" + Client_ID + "&client_secret=" + Client_Secret + "&v=20181113"
    }).done((data) => {
        // console.log(data);
        return data;
    }).fail((err) => {
        console.log('Err: ' + err);
    });
}