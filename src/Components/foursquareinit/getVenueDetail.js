import $ from 'jquery';

export default function foursQuareGetVenueDetail(venueID, clientID, clientSecret) {
  return $.ajax({
    type: 'GET',
    dataType: 'jsonp',
    cache: false,
    url: 'https://api.foursquare.com/v2/venues/' + venueID + '?client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20181113'
  }).done((data) => {
    // console.log(data);
    return data;
  }).fail((err) => {
    console.log('Err: ' + err);
  });
}