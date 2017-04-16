angular.module('MainCtrl', []).controller('MainController', function($scope, $http, $compile, $parse) {

	var vm = this;

	vm.getAllData = function(){

		// vm.result = {
		// 	data : [ 
		// 		{ x: 517623.6521026902, y: 5694120 },
		// 		{ x: 1288392.9336555135, y: 2783654 },
		// 		{ x: 2047833.999834561, y: 5567321 },
		// 		{ x: 3060428.9562457157, y: 5567389 },
		// 		{ x: 3982972.5933386884, y: 4588898 } 
		// 	]
		// }
		vm.showloaderall = true;
		$http.get('/allAppData').then(function (result){
			vm.result = result;
			console.log(result);
			createHisto(vm.result.data, 600, 600);
			circles(vm.result.data);
			vm.showloaderall = false;
		},function (error){
			vm.showloaderall = false;
			alert('Something went wrong please try again.')
			console.log(error);
		});
	}

	vm.change= function(v){
		var histoEl = angular.element( document.querySelector( '#histo' ) );
		histoEl.empty();
		createHisto(vm.result.data, vm.histoSlider.value, vm.histoSlider.value);
	}

	vm.histoSlider = {
		value: 600,
		options: {
			floor: 0,
			ceil: 1000,
			showSelectionBar: true,
			id: 'histoSlider',
			onChange: vm.change
		}
	}

	function createHisto(data, width, height){
		var margin = {top: 20, right: 20, bottom: 70, left: 40};
			height = height/ 2;

		var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

		var y = d3.scale.linear().range([height, 0]);

		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom")
			.ticks(10);

		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left")
			.ticks(10);

		var svg = d3.select("div#histo")
		.append("svg")
			.attr("width", width)
			.attr("height", height + margin.top + margin.bottom + 50)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			
		x.domain(data.map(function(d) { return d.x; }));
		y.domain([0, d3.max(data, function(d) { return d.y; })]);

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)
		.selectAll("text")
			.style("text-anchor", "end")
			.attr("dx", "-.8em")
			.attr("dy", "-.55em")
			.attr("transform", "rotate(-90)" );

		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
		.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("Y");

		svg.selectAll("bar")
			.data(data)
		.enter().append("rect")
			.style("fill", "steelblue")
			.attr("x", function(d) { return x(d.x); })
			.attr("width", x.rangeBand())
			.attr("y", function(d) { return y(d.y); })
			.attr("height", function(d) { return height - y(d.y); });

	}

	function circles(data){
		for(var i = 0; i < data.length; i++){
			var dia = (data[i].x + data[i].y) / 100000;
			var rad = dia / 2;

			var spaceCircles = [rad];

			var the_string = i;

			vm['change' + the_string] = function(v){
				circleChange(vm[parseInt(v.split('slider')[1])].value, parseInt(v.split('slider')[1]));
			}


			vm[the_string] = {
				value: rad,
				options: {
					floor: 0,
					ceil: 200,
					showSelectionBar: true,
					id: 'slider' + the_string,
					onChange: vm['change' + the_string]
				}
			}

			var h = `<rzslider rz-slider-model="vm[${i}].value" rz-slider-options="vm[${i}].options"></rzslider>`

			d3.select("#circle").append('div').attr('id', 'o'+i).style("width", rad).classed("margin-top", true);

			var myEl = angular.element( document.querySelector( '#o'+i ) );

			var scope = $scope;

			$compile(myEl.append(h))(scope);

			var svgContainer = d3.select('#o' + i).append("svg")
				.attr("width", ((rad*2) + 10))
				.attr("height", ((rad*2) + 10));

			var circles = svgContainer.selectAll("circle")
				.data(spaceCircles)
				.enter()
				.append("circle");

			var circleAttributes = circles
				.attr("cx", function (d) { return d; })
				.attr("cy", function (d) { return d; })
				.attr("r", [rad] )
				.style("fill", "red");
		}
	}

	function circleChange(rad, i){
		var spaceCircles = [rad];

		var svgContainer = d3.select('#o' + i).style("width", rad)
			.select("svg")
			.attr("width", ((rad*2) + 10))
			.attr("height", ((rad*2) + 10));

		var circles = svgContainer.selectAll("circle");

		var circleAttributes = circles
			.attr("cx", rad)
			.attr("cy", rad)
			.attr("r", [rad] )
			.style("fill", "red");
	}
});