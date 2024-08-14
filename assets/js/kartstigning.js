var options = {
center: [68.21, 13.74],
zoom: 10.5,
zoomSnap: .4,
zoomControl: false,
maxZoom: 25
};

// data import
// eiendommer med takst 0,-
var negativ = null;
$.ajax({
    'async': false,
    'global': false,
    'url': "assets/json/negativ.json",
    'dataType': "json",
    'success': function (data) {
        negativ = data;
    }
});
var positiv = null;
$.ajax({
    'async': false,
    'global': false,
    'url': "assets/json/positiv1000.json",
    'dataType': "json",
    'success': function (data) {
        positiv = data;
    }
});
var positivStor = null;
$.ajax({
    'async': false,
    'global': false,
    'url': "assets/json/positivresten.json",
    'dataType': "json",
    'success': function (data) {
        positivStor = data;
    }
});
var map = L.map('map', options);
L.control.zoom({ position: 'bottomright'}).addTo(map);
// load a tile layer
var topo = L.tileLayer('https://cache.kartverket.no/v1/wmts/1.0.0/topo/default/webmercator/{z}/{y}/{x}.png', {
		attribution: '<a href="http://www.kartverket.no/">Kartverket</a>',
		maxZoom: 25
	}).addTo(map);
var wmsLayer = L.tileLayer.wms('http://openwms.statkart.no/skwms1/wms.matrikkel?', {
	layers: ['eiendomsgrense'],
	  transparent: true,
	  format: "image/png",
	  version:'1.3.0',
	  zIndex: 100,
	  minZoom: 13,
	  projection: 'EPSG:3857'
}).addTo(map);

drawMap(negativ, positiv, positivStor);
//drawMap(geojson10pluss);

function drawMap(data, data2, data3) {
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
	punkter3= L.geoJson(data3, options2)

	var overlayMaps = {
		"Negativ stigning": punkter,
		"Positiv < 1000%": punkter2,
		"Positiv > 1000%": punkter3
	};
	var baseMaps = {
		// "Topografisk Norgeskart": topo,
	};
	L.control.layers(baseMaps,overlayMaps,{collapsed:false}).addTo(map);
	punkter.addTo(map);
	punkter2.addTo(map);
}
function pointToLayer(feature, latlng) {
	// function will take Point Feature geometry
	// and convert to a Leaflet layer by returning
	// a Leaflet marker or SVG such as circle or circleMarker
	if (feature.properties.Stigning === null) {
			return L.circleMarker(latlng, {
				radius: 3
			});
	} else if (feature.properties.Stigning === 0) {
			return L.circleMarker(latlng, {
				radius: 3
			});
		}
	else {
		return L.circleMarker(latlng, {
				radius: calcRadius(feature.properties.Stigning*-1)
			}); 
	}
}
function pointToLayer2(feature, latlng) {
	// function will take Point Feature geometry
	// and convert to a Leaflet layer by returning
	// a Leaflet marker or SVG such as circle or circleMarker
	if (feature.properties.Stigning === null) {
			return L.circleMarker(latlng, {
				radius: 3
			});
	} else if (feature.properties.Stigning === 0) {
			return L.circleMarker(latlng, {
				radius: 3
			});
		}
	else {
		return L.circleMarker(latlng, {
				radius: calcRadius(feature.properties.Stigning)
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
	if (feature.properties.Stigning === null) {
		styleOptions.fillColor = '#66cd00';
	} else if (feature.properties.Stigning <= 1000) {
		styleOptions.fillColor = '#fdc6af';
	} else if (feature.properties.Stigning > 1000 && feature.properties.Stigning <= 5000) {
		styleOptions.fillColor = '#fc8161';
	} else if (feature.properties.Stigning > 5000 && feature.properties.Stigning <= 10000) {
		styleOptions.fillColor = '#f85d42';
	} else if (feature.properties.Stigning > 10000 && feature.properties.Stigning <= 50000) {
		styleOptions.fillColor = '#eb362a';
	} else if (feature.properties.Stigning > 50000 && feature.properties.Stigning <= 100000) {
		styleOptions.fillColor = '#cc181d';
	} else if (feature.properties.Stigning > 100000 && feature.properties.Stigning <= 200000) {
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
	if (feature.properties.Stigning === null) {
		styleOptions.fillColor = '#FF0000';
	} else if (feature.properties.Stigning === 0) {
		styleOptions.fillColor = '#66cd00';
	} else if (feature.properties.Stigning < 0 && feature.properties.Stigning >= -500) {
		styleOptions.fillColor = '#c8ddf0';
	} else if (feature.properties.Stigning < -500 && feature.properties.Stigning >= -1000) {
		styleOptions.fillColor = '#a3cce3';
	} else if (feature.properties.Stigning < -1000 && feature.properties.Stigning >= -1500) {
		styleOptions.fillColor = '#73b3d8';
	} else if (feature.properties.Stigning < -1500 && feature.properties.Stigning >= -2000) {
		styleOptions.fillColor = '#4a97c9';
	} else if (feature.properties.Stigning < -2000 && feature.properties.Stigning >= -2500) {
		styleOptions.fillColor = '#2879b9';
	} else if (feature.properties.Stigning < -2500 && feature.properties.Stigning >= -3000) {
		styleOptions.fillColor = '#0d58a1';
	} else {
		styleOptions.fillColor = '#08306b';
	}
	return styleOptions;
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
				layer.setStyle({
				color: "yellow",
				weight: 3
			});

		},
		mouseout: function () {

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
	if (feature.properties.takst === null) {
		var toolTipInfo = "<h1>Ingen data</h1>" +
		"<b>Adresse:</b> " + adresse+"<br>" +
		"<b>Postnr og -sted:</b> "+feature.properties.postnummer +" "+feature.properties.poststed + "<br>" +
		"<b>Eiendom:</b> "+feature.properties.eiendom
	}else {
		var toolTipInfo = "<h1>Stigning: " + numberWithCommas(feature.properties.Stigning) + "%</h1>" +
		"<h2>Takst: " + numberWithCommas(feature.properties.takst) + ",- / "+(feature.properties.a2019_Takst)+",-</h2>" +
		"<b>Skatt:</b> " + numberWithCommas(feature.properties.skatt_skatt) + ",-<b> / </b>"+numberWithCommas(feature.properties.a2019_Skatt)+",-<br>" +
		"<b>Skattenivå:</b> " + (feature.properties.skatt_skattenivå*100)+"%<b> / </b>"+(feature.properties.a2019_Skattenivå)+"<br>"+
		"<b>Bunnfradrag:</b> " + numberWithCommas(feature.properties.skatt_bunnfradrag) + ",-<b> / </b>"+(feature.properties.a2019_Bunnfradrag)+",-<br>" +
		"<b>Grunnlag:</b> " + numberWithCommas(feature.properties.skatt_grunnlag) + ",-<b> / </b>"+(feature.properties.a2019_Grunnlag)+",-<br>" +
		"<b>Promille:</b> 3‰<b> / </b>"+(feature.properties.a2019_Promillesats)+"<br>" +
		"<b>Fritak:</b> " +feature.properties.skatt_fritak +"<b> / </b>"+feature.properties.a2019_Fritak+ "<br><br>" +
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
	if (val <= 10) {
		return radius * 3
	} else if (val > 10 && val <= 50) {
		return radius * 1.5;
	} else if (val > 50 && val < 600) {
		return radius *0.75
	} else {
	return radius * .4;
}
}
