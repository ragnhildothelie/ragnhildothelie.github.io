var options = {
center: [68.21, 13.74],
zoom: 10.5,
zoomSnap: .4,
zoomControl: false
};

// data import
// eiendommer med takst 0,-
var eiendom_0 = null;
$.ajax({
    'async': false,
    'global': false,
    'url': "assets/json/eiendom0.json",
    'dataType': "json",
    'success': function (data) {
        eiendom_0 = data;
    }
});
var eiendom_0_mp = null;
$.ajax({
    'async': false,
    'global': false,
    'url': "assets/json/eiendom_0_mp.json",
    'dataType': "json",
    'success': function (data) {
        eiendom_0_mp = data;
    }
});
// eiendommer med takst null
var eiendom_null = null;
$.ajax({
    'async': false,
    'global': false,
    'url': "assets/json/eiendom_null.json",
    'dataType': "json",
    'success': function (data) {
        eiendom_null = data;
    }
});
var eiendom_null_mp = null;
$.ajax({
    'async': false,
    'global': false,
    'url': "assets/json/eiendom_null_mp.json",
    'dataType': "json",
    'success': function (data) {
        eiendom_null_mp = data;
    }
});
// eiendommer med takst <= 10 mill
var eiendom_10 = null;
$.ajax({
    'async': false,
    'global': false,
    'url': "assets/json/eiendom10.json",
    'dataType': "json",
    'success': function (data) {
        eiendom_10 = data;
    }
});
var eiendom_10_mp = null;
$.ajax({
    'async': false,
    'global': false,
    'url': "assets/json/eiendom10_mp.json",
    'dataType': "json",
    'success': function (data) {
        eiendom_10_mp = data;
    }
});
// eiendommer med takst > 10 mill
var eiendom_11 = null;
$.ajax({
    'async': false,
    'global': false,
    'url': "assets/json/eiendom11.json",
    'dataType': "json",
    'success': function (data) {
        eiendom_11 = data;
    }
});
var eiendom_11_mp = null;
$.ajax({
    'async': false,
    'global': false,
    'url': "assets/json/eiendom11_mp.json",
    'dataType': "json",
    'success': function (data) {
        eiendom_11_mp = data;
    }
});
var map = L.map('map', options);
L.control.zoom({ position: 'bottomright'}).addTo(map);
// load a tile layer
var topo = L.tileLayer('https://cache.kartverket.no/v1/wmts/1.0.0/topo/default/webmercator/{z}/{y}/{x}.png', {
		attribution: '<a href="http://www.kartverket.no/">Kartverket</a>'
	}).addTo(map);
var nib = L.tileLayer.wms('https://wms.geonorge.no/skwms1/wms.nib?', {
	layers: ['ortofoto'],
	  transparent: true,
	  format: "image/png",
	  version:'1.3.0',
	  zIndex: 100,
	  minZoom: 13,
	  projection: 'EPSG:3857'
});
var wmsLayer = L.tileLayer.wms('http://openwms.statkart.no/skwms1/wms.matrikkel?', {
	layers: ['eiendomsgrense'],
	  transparent: true,
	  format: "image/png",
	  version:'1.3.0',
	  zIndex: 100,
	  minZoom: 13,
	  projection: 'EPSG:3857'
}).addTo(map);

drawMap(eiendom_10, eiendom_11, eiendom_0,eiendom_null);
//drawMap(geojson10pluss);

function drawMap(data, data2, data3, data4) {
	var options = {
		pointToLayer: pointToLayer,
		style: style,
		onEachFeature: onEachFeature
	}
	var options2 = {
		pointToLayer: pointToLayer2,
		style: style2,
		onEachFeature: onEachFeature
	}
	punkter = L.geoJson(data, options)//.addTo(map);
	punkter2= L.geoJson(data2, options2)
	punkter3= L.geoJson(data3, options)
	punkter4= L.geoJson(data4, options)

	var overlayMaps = {
		"Boliger takst <= 10 000 000,-": punkter,
		"Boliger takst > 10 000 000,-": punkter2,
		"Takst 0,-": punkter3,
		"Ingen data": punkter4
	};
	var baseMaps = {
		//"Topografisk Norgeskart": topo,
	};
	L.control.layers(baseMaps,overlayMaps,{collapsed:false}).addTo(map);
	punkter.addTo(map);
}
function pointToLayer(feature, latlng) {
	// function will take Point Feature geometry
	// and convert to a Leaflet layer by returning
	// a Leaflet marker or SVG such as circle or circleMarker
	if (feature.properties.TAKST === null) {
			return L.circleMarker(latlng, {
				radius: 3
			});
	} else if (feature.properties.TAKST === 0) {
			return L.circleMarker(latlng, {
				radius: 3
			});
		}
	else {
		return L.circleMarker(latlng, {
				radius: calcRadius(feature.properties.TAKST/25)
			}); 
	}
}
function pointToLayer2(feature, latlng) {
	// function will take Point Feature geometry
	// and convert to a Leaflet layer by returning
	// a Leaflet marker or SVG such as circle or circleMarker
	if (feature.properties.TAKST === null) {
			return L.circleMarker(latlng, {
				radius: 3
			});
	} else if (feature.properties.TAKST === 0) {
			return L.circleMarker(latlng, {
				radius: 3
			});
		}
	else {
		return L.circleMarker(latlng, {
				radius: calcRadius(feature.properties.TAKST/40)
			}); 
	}
}
function pointToLayerMP(feature, latlng) {
	// function will take Point Feature geometry
	// and convert to a Leaflet layer by returning
	// a Leaflet marker or SVG such as circle or circleMarker
	return L.circleMarker(latlng, {
				radius: 3
			});
}
function style2(feature) {
	var styleOptions = {
		fillOpacity: .5,
		color: "black",
		weight: 1
	}
	if (feature.properties.TAKST === null) {
		styleOptions.fillColor = '#66cd00';
	} else if (feature.properties.TAKST <= 10000000) {
		styleOptions.fillColor = '#fdc6af';
	} else if (feature.properties.TAKST > 10000000 && feature.properties.TAKST <= 20000000) {
		styleOptions.fillColor = '#fc8161';
	} else if (feature.properties.TAKST > 20000000 && feature.properties.TAKST <= 30000000) {
		styleOptions.fillColor = '#f85d42';
	} else if (feature.properties.TAKST > 30000000 && feature.properties.TAKST <= 40000000) {
		styleOptions.fillColor = '#eb362a';
	} else if (feature.properties.TAKST > 40000000 && feature.properties.TAKST <= 50000000) {
		styleOptions.fillColor = '#cc181d';
	} else if (feature.properties.TAKST > 50000000 && feature.properties.TAKST <= 100000000) {
		styleOptions.fillColor = '#a90f15';
	} else {
		styleOptions.fillColor = '#67000d';
	}
	return styleOptions;
}
function style(feature) {
	var styleOptions = {
		fillOpacity: .9,
		color: "black",
		weight: 1
	}
	if (feature.properties.TAKST === null) {
		styleOptions.fillColor = '#FF0000';
	} else if (feature.properties.TAKST === 0) {
		styleOptions.fillColor = '#66cd00';
	} else if (feature.properties.TAKST > 0 && feature.properties.TAKST <= 1000000) {
		styleOptions.fillColor = '#c8ddf0';
	} else if (feature.properties.TAKST > 1000000 && feature.properties.TAKST <= 2000000) {
		styleOptions.fillColor = '#a3cce3';
	} else if (feature.properties.TAKST > 2000000 && feature.properties.TAKST <= 3000000) {
		styleOptions.fillColor = '#73b3d8';
	} else if (feature.properties.TAKST > 3000000 && feature.properties.TAKST <= 4000000) {
		styleOptions.fillColor = '#4a97c9';
	} else if (feature.properties.TAKST > 4000000 && feature.properties.TAKST <= 5000000) {
		styleOptions.fillColor = '#2879b9';
	} else if (feature.properties.TAKST > 5000000 && feature.properties.TAKST <= 10000000) {
		styleOptions.fillColor = '#0d58a1';
	} else {
		styleOptions.fillColor = '#08306b';
	}
	return styleOptions;
}
function finnMP(code, takst) {
	if (takst === null) {
		return eiendom_null_mp.filter(
		  function(data){ return data.properties.id == code }
	  );
	} else if (takst === 0) {
		return eiendom_0_mp.filter(
		  function(data){ return data.properties.id == code }
	  );
	} else if (takst > 0 && takst <= 10000000) {
		return eiendom_10_mp.filter(
		  function(data){ return data.properties.id == code }
	  );
	} else {
		return eiendom_11_mp.filter(
	  function(data){ return data.properties.id == code }
  );
	};
}
function onEachFeature(feature, layer) {
	styleMP = {
		fillOpacity: .9,
		fillColor: "#black",
		color: "yellow",
		weight: 3,
		radius: 5
	}
	layer.on({
		mouseover: function () {
			multipunkt = L.geoJson(finnMP(feature.properties.id, feature.properties.TAKST),{pointToLayer: function (feature, latlng) {return L.circleMarker(latlng, styleMP);}}).addTo(map);
			layer.setStyle({
				color: "yellow",
				weight: 3
			});

		},
		mouseout: function () {
			multipunkt.removeFrom(map);

			layer.setStyle({
				color: "black",
				weight: 1
			});
		}
	});
	if (feature.properties.offisielladressetext=== null) {
		var adresse = ''
	} else {
		var adresse = feature.properties.offisielladressetext
	}
	if (feature.properties.TAKST === null) {
		var toolTipInfo = "<h1>Ingen data</h1>" +
		"<b>Adresse:</b> " + adresse+"<br>" +
		"<b>Postnr og -sted:</b> "+feature.properties.postnummer +" "+feature.properties.poststed + "<br>" +
		"<b>Eiendom:</b> "+feature.properties.eiendom
	}else {
		var toolTipInfo = "<h1>Takst: " + numberWithCommas(feature.properties.TAKST) + ",-</h1>" +
		"<h2>Skatt: " + numberWithCommas(feature.properties.skatt_skatt) + ",-</h2>" +
		"<b>Skattenivå:</b> " + (feature.properties.skatt_skattenivå*100)+"%<br>"+
		"<b>Bunnfradrag:</b> " + numberWithCommas(feature.properties.skatt_bunnfradrag) + ",-<br>" +
		"<b>Grunnlag:</b> " + numberWithCommas(feature.properties.skatt_grunnlag) + ",-<br>" +
		"<b>Fritak:</b> " +feature.properties.skatt_fritak + "<br><br>" +
		"<b>Adresse:</b> " + adresse+"<br>" +
		"<b>Postnr og -sted:</b> "+feature.properties.postnummer +" "+feature.properties.poststed + "<br>" +
		"<b>Eiendom:</b> "+feature.properties.eiendom    
	}           
	layer.bindTooltip(toolTipInfo, { sticky: true, opacity: 0.85 });
}

function numberWithCommas(x) {
	if (x === null) {
		return x
	} else {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");}
}
function calcRadius(val) {
	var radius = Math.sqrt(val / Math.PI);
	return radius * .04;
}
