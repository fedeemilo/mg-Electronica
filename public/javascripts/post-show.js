
mapboxgl.accessToken = 'pk.eyJ1IjoiZmVkZWVtaWxvOTEiLCJhIjoiY2p6bG44dnp3MHhpYTNtb2FqbnZxcjY0ayJ9.z712YCPH8PLoCgSqtldzsQ';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: post.coordinates,
    zoom: 5
});

// create a HTML element for our post location/marker
var el = document.createElement('div');
el.className = 'marker';

// make a marker for our location and add to the map
new mapboxgl.Marker(el)
    .setLngLat(post.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
    .setHTML('<h3>' + post.title + '</h3><p>' + post.location + '</p>'))
    .addTo(map);
