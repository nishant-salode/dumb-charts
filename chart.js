(function (root,factory) {
    if (typeof define === "function" && define.amd) {
        define(factory);
    } else if (typeof exports === "object") {
        module.exports = factory();
    } else {
        root.dumbChart = factory();
    }
}(this, function () {
    // this is where I defined my module implementation
    if(document.readyState === "complete") {
        // Fully loaded!
        onInit();
    }
    else if(document.readyState === "interactive") {
        onInit();
        // DOM ready! Images, frames, and other subresources are still downloading.
    }
    else {
        // Loading still in progress.
        // To wait for it to complete, add "DOMContentLoaded" or "load" listeners.
    
        window.addEventListener("DOMContentLoaded", () => {
            // DOM ready! Images, frames, and other subresources are still downloading.
            onInit();
        });
    
        window.addEventListener("load", () => {
            // Fully loaded!
            // onInit();
        });
    }
  
    dumbChart = { 
        generate: function(){}
    };
            var marginTop = 70;
            var marginLeft = 20;
            var marginBottom = 30;
            var marginRight = 40;
            var container_Width = 0;
            var container_Height = 0;
            var chart_Width = 0;
            var chart_Height = 0;
            var maxY_value = 0;
            var minY_value = 0;

    function onInit(){
        
        console.log("init initiated..");
        
        dumbChart.generate = function(params){
            console.log("generate ",params);
            
            /**
             * Common variable declarations :
             */

            container_Width = params.width;
            container_Height = params.height;

            chart_Width = container_Width - (marginLeft + marginRight);
            chart_Height = container_Height - (marginTop + marginBottom);            

            var svg_container =  document.createElementNS("http://www.w3.org/2000/svg", "svg");
            // svg_container.setAttribute("id",params.config.id);
            svg_container.setAttribute("class","chart");
            
            if(params.config.type === "linear_bar"){
                svg_container.setAttribute("width",container_Width);
                svg_container.setAttribute("height",container_Height);
                
                svg_container.setAttribute("class","chart");
                svg_container.setAttribute("aria-labelledby","title desc");
                svg_container.setAttribute("role","img");
                
                getMinMaxValue(params.data);
                console.log(maxY_value,minY_value)
                createAxis(svg_container);
                plotBarChartPoints(params,svg_container);
            }

            console.log(svg_container);
            document.body.append(svg_container);
        };
        
        createAxis = function(svg_container){
                /* H: 200 .... W: 100
                    Actual chart width = W - ML - MR
                    Actual chart height = H - MT - MB
                */
                // <marker id="arrow" viewBox="0 -5 10 10" refX="5" refY="0" markerWidth="4" markerHeight="4" orient="auto">
                var y_Marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
                y_Marker.setAttribute("id","arrow");
                y_Marker.setAttribute("markerWidth","4");
                y_Marker.setAttribute("markerHeight","4");
                y_Marker.setAttribute("refX","5");
                y_Marker.setAttribute("refY","0");
                y_Marker.setAttribute('viewBox', '0 0 15 15');
                y_Marker.setAttribute("orient","auto");
                var y_Path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                y_Path.setAttribute('d', 'M0,0 L0,6 L9,3 z');
                y_Marker.append(y_Path);
                svg_container.append(y_Marker);

                // svg_container.append('marker')
				// 		.attr('id', 'arrow')
				// 		.attr('viewBox', '0 0 15 15')
				// 		.attr('markerUnits','strokeWidth')
				// 		.attr('refX', 0)
				// 		.attr('refY', 3)
				// 		.attr('markerWidth', 20)
				// 		.attr('markerHeight', 20)
				// 		.attr('orient', 'auto')
				// 	  .append('path')
				// 		.attr('d', 'M0,0 L0,6 L9,3 z')
				// 		.style('stroke','black')
				// 		.style('stroke-width',0.5)
				// 		.style('fill','darkslategrey');


                var y_Axis = document.createElementNS("http://www.w3.org/2000/svg", "path");
                y_Axis.setAttribute("id","yAxis");
                y_Axis.setAttribute("stroke","black");
                y_Axis.setAttribute("stroke-width","2");
                y_Axis.setAttribute("fill","none");
                // d="M 10 10 l 0 180"
                y_Axis.setAttribute("d","M "+ marginLeft +" "+ marginTop + " l " +" 0 " + (container_Height-marginTop-marginBottom));
                

                var x_Axis = document.createElementNS("http://www.w3.org/2000/svg", "path");
                x_Axis.setAttribute("id","xAxis");
                x_Axis.setAttribute("stroke","black");
                x_Axis.setAttribute("stroke-width","2");
                x_Axis.setAttribute("fill","none");
                x_Axis.setAttribute("d","M "+ marginLeft +" "+ (container_Height - marginBottom) + " l "+ (container_Width-marginLeft-marginRight) +" 0");
                // x_Axis.setAttribute("marker-end","url(#arrowhead)");
                svg_container.append(y_Axis);
                svg_container.append(x_Axis);
                
        }

        getMinMaxValue = function(dataSet){
            let tempArr = [];
            dataSet.map(function(item){
                tempArr.push(item.value);
            })
            maxY_value = Math.max.apply(null, tempArr);
            minY_value = Math.min.apply(null, tempArr);
        }
         
        plotBarChartPoints = function(params,svg_container){
            var oneUnitOfYaxis = chart_Height/ (Math.ceil(maxY_value));
            var xAxisSpace = 0;
            var widthOfBar = Math.round(chart_Width / params.data.length);

            params.data.forEach((point,index) => {
            let elem_G =  document.createElementNS("http://www.w3.org/2000/svg", "g");
            elem_G.setAttribute("class","bar");

            let elem_rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            elem_rect.setAttribute("width",widthOfBar);
            elem_rect.setAttribute("height",oneUnitOfYaxis*point.value);
            elem_rect.setAttribute("fill","#"+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0'));

            elem_rect.setAttribute("x", marginLeft + index*widthOfBar);
            // elem_rect.setAttribute("y", marginBottom + (oneUnitOfYaxis * ( point.value - 1)));
            elem_rect.setAttribute("y", marginTop + (oneUnitOfYaxis * ( maxY_value - point.value)));
            
            
            let elem_text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            elem_text.setAttribute("x",marginLeft + index*widthOfBar);
            elem_text.setAttribute("y",container_Height);
            elem_text.setAttribute("dx",3.5);
            elem_text.innerHTML = point.key;
            
            elem_G.append(elem_rect);
            elem_G.append(elem_text);

            svg_container.append(elem_G);
            });
        
            
        };
    }  
  
    return dumbChart;
}));