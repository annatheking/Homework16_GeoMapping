// Create the map 
var map = L.map("map-id", {
  center: [3.7923, -18.1432],
  zoom: 2
});

// Create the tile layer that will be the background of our map
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});

lightmap.addTo(map);

function colorScale(mag){
  if (mag < 5.5) return '#ffa474';
  else if (mag < 6.5) return '#f47461'; 
  else if (mag < 7.5) return '#db4551';
  else if (mag < 8.5) return '#b81b34';
  else return '#8b0000';
};

function createMarkers(response){
  L.geoJSON(response, {

    style: function(feature) {
      return{
        radius: feature.properties.mag * 3,
        fillColor: colorScale(feature.properties.mag),
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
        color: 'white'
      };
    },

    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng);
    },

    onEachFeature: function(feature, layer){
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><hr><p>coordinates: (${feature.geometry.coordinates[0]}, ${feature.geometry.coordinates[1]})</p>`);
    }

  }).addTo(map);

};

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [3.5, 4.5, 5.5, 6.5, 7.5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colorScale(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson").then(createMarkers);