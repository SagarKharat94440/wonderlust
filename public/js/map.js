let Lng = LNG;
let Lat= LAT;
// Initialize the platform object
let apiKey = mapKey;
const platform = new H.service.Platform({
  'apikey': apiKey,
});

// Obtain the default map types from the platform object
const maptypes = platform.createDefaultLayers();

// Instantiate (and display) the map
const map = new H.Map(
  document.getElementById('mapContainer'),
  maptypes.vector.normal.map,
  {
    zoom: 10,  // Initial zoom level
    center: { lng: Lng, lat:Lat }  // Initial map center
  }
);

// Enable map behavior (add event listeners like zooming, panning, etc.)
const mapEvents = new H.mapevents.MapEvents(map);
const behavior = new H.mapevents.Behavior(mapEvents);

// Add default UI components to the map, including zoom controls
const ui = H.ui.UI.createDefault(map, maptypes);

// Example: Add a marker to the map
const marker = new H.map.Marker({ lng: Lng, lat:Lat});
map.addObject(marker);
