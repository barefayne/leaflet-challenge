// Store our API endpoint as queryUrl.
var queryUrl =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create our map, giving it the streetmap and earthquakes layers to display on load.
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5,
});

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(myMap);

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  console.log(data);

  // Once we get a response, send the data.features object to the createFeatures function.
  function mapStyle(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: mapColor(feature.geometry.coordinates[2]),
      color: "#0D2E24",
      radius: mapRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5,
    };
    // Setting the marker radius size to reflect the magnitude of the earthquake
    function mapRadius(mag) {
        if (!mag) {
          return 1;
        }
        return mag * 4;
      }
      
    // Setting the marker color to reflect the depth of the earthquake
  }
  function mapColor(depth) {
    if (depth > 90) {
      return "#FF5F65";
    } else if (depth > 70) {
      return "#FCA35D";
    } else if (depth > 50) {
      return "#FDB72A";
    } else if (depth > 30) {
      return "#F7DB11";
    } else if (depth > 10) {
      return "#DCF400";
    } else {
      return "#A3F600";
    }
  }
  

  // Add earthquake data to the map
  L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: mapStyle,

    // Give each feature a popup that describes the mag, place and depth of the earthquake.
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`<b>Magnitude:</b> ${feature.properties.mag}<br>
                    <b>Depth:</b> ${feature.geometry.coordinates[2]}<br>
                    <b>Location:</b> ${feature.properties.place}<br>
                    `);
    },
  }).addTo(myMap);
    // Create a legend for the map
    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function () {
      var div = L.DomUtil.create("div", "info legend");
      var depths = [0, 10, 30, 50, 70, 90];
  
      for (var i = 0; i < depths.length; i++) {
        div.innerHTML +=
          '<i style="background:' +
          mapColor(depths[i] + 1) +
          '"></i> ' +
          depths[i] +
          (depths[i + 1] ? "&ndash;" + depths[i + 1] + "<br>" : "+");
      }
  
      return div;
    };
  
    legend.addTo(myMap);

});
