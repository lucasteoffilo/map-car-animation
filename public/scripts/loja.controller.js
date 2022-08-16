(function () {
	'use strict';

	angular.module('app')
		.controller('LojaController', function ($scope) {
			const view = new ol.View({
				center: ol.proj.fromLonLat([-43.4056066666667, -22.90199]),
				zoom: 15
			})
			var socket = io();
			var feature = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([-117.1610838, 32.715738])));
			$scope.map = new ol.Map({
				layers: [
					new ol.layer.Tile({
						source: new ol.source.OSM(),
					}),
					new ol.layer.Vector({ // VectorLayer({
						source: new ol.source.Vector({ // VectorSource({
							features: [feature]
						}),
						style: new ol.style.Style({
							image: new ol.style.Icon( /** @type {module:ol/style/Icon~Options} */ ({
								anchor: [0.5, 46],
								anchorXUnits: 'fraction',
								anchorYUnits: 'pixels',
								opacity: 0.95,
								src: 'https://i.ibb.co/nnND9Td/car.png'
							})),
							stroke: new ol.style.Stroke({
								width: 3,
								color: [255, 0, 0, 1]
							}),
							fill: new ol.style.Fill({
								color: [0, 0, 255, 0.6]
							})
						})
					})
				],
				target: 'map',
				view: view,
			});
			init();
			var oldCoordinates = 0;

			function init() {
				socket.on('coordenadas', function (pedido) {
					console.log(pedido.coordenadas);
					if (oldCoordinates == 0) {
						var coordinate = ol.proj.transform(pedido.coordenadas, 'EPSG:4326', 'EPSG:3857');
						var geometry = new ol.geom.Point();
						geometry.setCoordinates(coordinate);
						feature.setGeometry(geometry);
					}
					if (oldCoordinates != null) {
						var line = new ol.geom.LineString([oldCoordinates, pedido.coordenadas]);
						var step = 0;
						var key = setInterval(function () {
							if (step < 100) {
								step++;
								console.log(step);
								console.log(line.getCoordinateAt(step / 100));

								var coordinate = ol.proj.transform(line.getCoordinateAt(step / 100), 'EPSG:4326', 'EPSG:3857');
								var geometry = new ol.geom.Point();
								geometry.setCoordinates(coordinate);
								feature.setGeometry(geometry);
								// var coordinate = ol.proj.transform(pedido.coordenadas, 'EPSG:4326', 'EPSG:3857');
								// var geometry = new ol.geom.Point(line.getCoordinateAt(step / 100));
								// geometry.setCoordinates(coordinate);
								// feature.setGeometry(geometry);
							} else {
								clearInterval(key);
							}
						}, 2);
					}

					oldCoordinates = pedido.coordenadas;
					// view.animate({
					// 	center: ol.proj.fromLonLat([pedido.coordenadas[0], pedido.coordenadas[1]]),
					// 	duration: 2000,
					// });
				});
			}
		});
})();