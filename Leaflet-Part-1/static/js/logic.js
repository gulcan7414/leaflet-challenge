
// Store our API endpoint as url.
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL

d3.json(url).then(function(data) {
  console.log(data);

  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3> Location: ${feature.properties.place}</h3>
                    <hr><p>Magnitude: ${feature.properties.mag}</p>
                    <hr><p>Time: ${new Date(feature.properties.time)}</p>
                    <hr><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
  };

  function pointToLayer(feature, latlng){
    let geojasonMarkerOptions = {
            radius: markerSize(feature.properties.mag),
            fillColor: markerColor(feature.geometry.coordinates[2]),
            fillOpacity: 1,
            color: "black",
            stroke: true,
            weight:1
        }; 
    return L.circleMarker(latlng, geojasonMarkerOptions);
}

// Create a GeoJSON layer that contains the features array on the earthquakeData object.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: pointToLayer
  });
  
  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
};



function markerSize(magnitude) {
  return Math.sqrt(magnitude) * 8;
}

// Loop through the earthquake array, and create one marker for each magnitude object.
function markerColor(depth) {
  if (depth < 10) return "#fee391";
  else if (depth < 30) return "#fec44f";
  else if (depth < 50) return "#f768a1";
  else if (depth < 70) return "#dd3497";
  else if (depth < 90) return "#ae017e";
  else return "#49006a";
}


function createMap(earthquakes) {

  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [street, earthquakes]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


// Add legend to map, css style finishes the legend
let legend = L.control({position: "bottomright"});

legend.onAdd = function(myMap) {
  let div = L.DomUtil.create("div", "info legend");
  grades = ["-10", "10", "30", "50", "70", "90"]
  colors = ["#fee391", "#fec44f", "#f768a1", "#dd3497", "#ae017e", "#49006a"]
  labels = [];

// loop through our density intervals and generate a label with a colored square for each interval


for (let i =0; i<grades.length; i++){
div.innerHTML +=
              '<li style= "background:' + colors[i] + '"></li> ' +
             grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
            }
return div;

}

legend.addTo(myMap);

}



