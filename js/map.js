function initializeMap() {

	var shopLeftLat = jQuery('#shop_left_lat').val() || 49.998443; // ludwigstrasse
	var shopLeftLng = jQuery('#shop_left_lng').val() || 8.268542;
	var shopRightLat = jQuery('#shop_right_lat').val() || 49.999381; // marktplatz
	var shopRightLng = jQuery('#shop_right_lng').val() || 8.274593;
	var centerLat = jQuery('#shop_center_lat').val() || 49.999216; // staatstheater in der mitte
	var centerLng = jQuery('#shop_center_lng').val() || 8.271461;

	var mitte = new google.maps.LatLng(centerLat,centerLng); //staatstheater liegt in der mitte
	var ludwig = new google.maps.LatLng(shopLeftLat,shopLeftLng); //ludwigstrasse
	var markt = new google.maps.LatLng(shopRightLat,shopRightLng); //marktplatz

    var myOptions = {
	zoom: 16,
	center: mitte,
	disableDefaultUI: true, //alle controls ausschalten
	panControl: false,
	zoomControl: false,
	scaleControl: false,
	scrollwheel: false,
	navigationControl: false,
	mapTypeControl: false,
	scaleControl: false,
	draggable: true,
	mapTypeId: google.maps.MapTypeId.ROADMAP
};

	var image = new google.maps.MarkerImage(
	'themes/hussong/images/hussong_marker.png',
	new google.maps.Size(52,52),
	new google.maps.Point(0,0)
);

/*
	var shadow = new google.maps.MarkerImage(
	'img/hussong_marker.png',
	new google.maps.Size(52,52),
	new google.maps.Point(0,0),
	new google.maps.Point(20,35)
);
*/

/*
	var shape = {
	  coord: [24,1,25,2,26,3,26,4,26,5,26,6,26,7,25,8,24,9,25,10,26,11,26,12,27,13,27,14,27,15,27,16,27,17,27,18,27,19,27,20,27,21,27,22,27,23,27,24,27,25,26,26,25,27,25,28,25,29,25,30,25,31,24,32,24,33,23,34,20,34,17,33,16,32,16,31,16,30,16,29,15,28,15,27,15,26,15,25,13,24,13,23,13,22,13,21,13,20,13,19,13,18,13,17,13,16,14,15,14,14,14,13,15,12,15,11,16,10,17,9,18,8,18,7,17,6,17,5,17,4,18,3,18,2,19,1,24,1],
	  type: 'poly'
};
*/
    var map = new google.maps.Map(document.getElementById("map"), myOptions);

	var ludwigstrasse = new google.maps.Marker({
	draggable: true,
	animation: google.maps.Animation.DROP, //oder drop
	raiseOnDrag: false,
	icon: image,
	//shadow: shadow,
	//shape: shape,
	//position: new google.maps.LatLng(50.030624,8.258968),
    position: ludwig,
	map: map,
	});
	
	var marktplatz = new google.maps.Marker({
	draggable: true,
	animation: google.maps.Animation.DROP, //oder drop
	raiseOnDrag: false,
	icon: image,
	//shadow: shadow,
	//shape: shape,
	//position: new google.maps.LatLng(50.030624,8.258968),
    position: markt,
	map: map,
	});

/* farben */
/*
   var modernStyle= [
	{
		featureType: 'road',
		elementType: 'all',
		stylers: [
			{ hue: '#999999' },
			{ saturation: -100 },
			{ lightness: -2 },
			{ visibility: 'on' }

		]
	},{
		featureType: 'landscape.natural',
		elementType: 'all',
		stylers: [
			{ hue: '#efefef' },
			{ saturation: -100 },
			{ lightness: -1 },
			{ visibility: 'on' },
			{ saturation: -66 },
	      	{ lightness: 26 },
			{ gamma: 2.17 }
		]
	},{
		featureType: 'landscape.man_made',
		elementType: 'all',
		stylers: [
			{ hue: '#efefef' },
			{ saturation: -100 },
			{ lightness: -1 },
			{ visibility: 'on' },
			{ saturation: -66 },
	      	{ lightness: 26 },
			{ gamma: 2.17 }
		]	
	},{
		featureType: 'poi',
		elementType: 'all',
		stylers: [
			{ hue: '#efefef' },
			{ saturation: -100 },
			{ lightness: -1 },
			{ visibility: 'on' },
			{ saturation: -66 },
	      	{ lightness: 26 },
			{ gamma: 2.17 }
		]	
	},{
		featureType: 'road.highway',
		elementType: 'all',
		stylers: [
			{ hue: '#999999' },
			{ saturation: -100 },
			{ lightness: -2 },
			{ visibility: 'on' }
		]
	},{
		featureType: 'road.arterial',
		elementType: 'all',
		stylers: [
			{ hue: '#999999' },
			{ saturation: -100 },
			{ lightness: -19 },
			{ visibility: 'on' }
		]
	},{
		featureType: 'road.local',
		elementType: 'all',
		stylers: [

		]
	},{
		featureType: 'poi.park',
		elementType: 'all',
		stylers: [
			{ hue: '#999999' },
			{ saturation: -100 },
			{ lightness: -23 },
			{ visibility: 'on' }
		]
	},{
		featureType: 'water',
		elementType: 'all',
		stylers: [

		]
	}
];
map.setOptions({styles: modernStyle});*/
}
//go

jQuery(document).ready(function(){
	if(jQuery('.laeden').length > 0){
		initializeMap();
		jQuery('#map-wrapper').show();
	}
});