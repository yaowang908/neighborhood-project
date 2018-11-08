export default function geocoding(paramSearchText,platform, onResult,onError) {
    //searchText: 'China town, Manhattan, NY'
    //platform is api object created on main index.js
    //onResult is function to run when geocoding return result;
    //create the parameters for the geocoding request;
    let geocodingParams = {
        searchText: paramSearchText
    };

    //get an instance of the geocoding service;
    let geocoder = platform.getGeocodingService();

    //call the geocode method with the geocoding parameters,
    //the callback and an error callback function(called if a
    //communication error occurs)
    geocoder.geocode(
        geocodingParams, onResult, onError
    );
}

