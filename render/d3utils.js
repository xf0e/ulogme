var d3utils = {};

(function(global) {
    "use strict";

    // convenience function
    var getopt = function(opt, field_name, default_value) {
        return typeof opt[field_name] !== 'undefined' ? opt[field_name] : default_value;
    }


    function drawPieChart(d3div, chart_data) {
        // chart_data.data is a list of data elements.
        // each should contain fields: val, col, name

        d3div.html(""); // clear the div
        var title = getopt(chart_data, 'title', '');

        // desired width and height of chart
        var w = getopt(chart_data, 'width', 300);
        var h = getopt(chart_data, 'height', 300);
        var pad = getopt(chart_data, 'pad', 50);
        var textmargin = getopt(chart_data, 'textmargin', 20);
        var r = Math.min(w, h) / 2 - pad; // radius of pie chart

        var div = d3div.append('div');
        if(title !== '') {
            div.append('p').attr('class', 'pietitle').text(title);
        }

        var arc = d3.svg.arc()
            .outerRadius(r)
            .cornerRadius(20)
            .innerRadius(150);

        var arcLarge = d3.svg.arc()
            .innerRadius(150)
            .cornerRadius(20)
            .outerRadius(r + 50);

        var toggleArc = function(p){
            p.state = !p.state;
            var dest = p.state ? arcLarge : arc;


            d3.select(this).select("path").transition()
                .duration(160)
                .attr("d", dest);};

        var pie = d3.layout.pie()
            .padAngle(.03)
            .sort(null)
            .value(function(d) { return d.val; });

        var svg = d3.select("#piechart").append("svg")
            .attr("width", w)
            .attr("height", h)
            .append("g")
            .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

        var g = svg.selectAll(".arc")
            .data(pie(chart_data.data))
            .enter().append("g")
            .attr("class", "arc")
            .attr("stroke", "#999")
            //.attr("id",function(d){return d.data;})
            .attr("id", function(d,i) { return "arc_"+i; })
            .on("mouseover",toggleArc)
            .on("mouseout",toggleArc);

        g.append("path")
            .attr("d", arc)
            .style("fill", function(d) { return d.data.col; });

        var legendRectSize = 18;
        var legendSpacing = 4;
        var legend = svg.selectAll('.legend')
            .data(chart_data.data)
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr("id",function(d){return d.data;})
            .attr('transform', function(d, i) {
                var height = legendRectSize + legendSpacing;
                var offset =  height * chart_data.data.length / 2;
                var horz = -6 * legendRectSize;
                var vert = i * height - offset;
                return 'translate(' + horz + ',' + vert + ')';
            });


        legend.append('rect')
            .data(chart_data.data)
            .attr('width', legendRectSize)
            .attr('height', legendRectSize)
            .style('fill', function(d) { return d.col; });



        legend.append("text")
            .attr('x', legendRectSize + legendSpacing)
            .attr('y', legendRectSize - legendSpacing)
            .text(function(d) { return d.name; });
    }

    function drawHorizontalBarChart(d3div, chart_data) {
        // chart_data.data is a list of data elements.
        // each should contain fields: val, col, name, fn (text next to bar)

        d3div.html(""); // clear the div
        var div = d3div.append('div');

        var title = getopt(chart_data, 'title', '');
        if(title !== '') {
            div.append('p').attr('class', 'hbtitle').text(title);
        }

        // desired width and height of chart
        var w = getopt(chart_data, 'width', 300);
        var bh = getopt(chart_data, 'barheight', 30);
        var textmargin = getopt(chart_data, 'textmargin', 20);
        var textpad = getopt(chart_data, 'textpad', 100);
        var textoffy = getopt(chart_data, 'textoffy', 8);

        var h = chart_data.data.length * bh;
        var sx = (w - textmargin - textpad) / d3.max(chart_data.data, function(x){ return x.val; }); // for scaling to fit

        var svg = div.append("svg")
            .attr("width", w)
            .attr("height", h);

        var g = svg.selectAll(".b")
            .data(chart_data.data)
            .enter().append("g")
            .attr("class", "b")
            .on('mouseover', function(d){
                var nodeSelection = d3.select(this).style({opacity:'0.8'});
                nodeSelection.select("b").style({opacity:'0.9'});
            })
            .on('mouseout', function(d){
                var nodeSelection1 = d3.select(this).style({opacity:'1.0'});
                nodeSelection1.select("b").style({opacity:'1.0'});
            });

        g.append("rect")
            .attr("x", function(d) { return 0.0; } )
            .attr("width", function(d) { return d.val * sx; } )
            .attr("y", function(d,i) { return i * bh; })
            .attr("height", bh-3)
            .attr("stroke", "black")
            .attr("fill", function(d) { return d.col; });

        g.append("text")
            .attr("transform", function(d, i) { return "translate(" + (d.val * sx + textmargin) + "," + ((i+1) * bh - textoffy) + ")"; })
            .text(function(d) { return d.text });
    }

    // exports
    global.drawPieChart = drawPieChart;
    global.drawHorizontalBarChart = drawHorizontalBarChart;

})(d3utils);
