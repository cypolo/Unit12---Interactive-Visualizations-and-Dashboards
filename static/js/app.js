function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // Use d3 to select the panel with id of `#sample-metadata`
  d3.json(`/metadata/${sample}`).then((data) => {
    var panel = d3.select("#sample-metadata")
    // clear existing data in the panel if there is any
    panel.html("")

    // Add key value pairs to the panel
    Object.entries(data).map(([key,value]) => {
      panel.append("div").text(key + ": " + value);
    });
    console.log(data.WFREQ);

    buildGauge(data.WFREQ);
  });
}


// function to build the pie chart
function buildPie(data) {
  var pieData = {
    labels: data.otu_ids.slice(0,10),
    values: data.sample_values.slice(0,10),
    hovertext: data.otu_labels.slice(0,10),
    hoverinfo: "hovertext",
    type: "pie"
  };

  var pieLayout = {
    margin: { t: 0, l: 0 }
  };
  
  Plotly.newPlot("pie", [pieData], pieLayout);
}


// function to build the bubble chart
function buildBubble(data) {
  var bubbleData = {
    x: data.otu_ids,
    y: data.sample_values,
    hovertext: data.otu_labels,
    mode: "markers",
    marker: {
      size: data.sample_values,
      color: data.otu_ids,
      colorscale: "Earth"
    }
  };

  var bubbbleLayout = {
    title: "OTU ID",
    margin: { t: 0 },
    hovermode: "closest",
    showlegend: false
  };
  
  Plotly.newPlot("bubble", [bubbleData], bubbbleLayout);
}



// Bonus part: create a gauge chart
function buildGauge(WFREQ) {
  // Enter the washing frequency between 0 and 180
  var level = parseFloat(WFREQ) * 20;

  // Trig to calc meter point
  var degrees = 180 - level;
  var radius = .5;
  var radians = (degrees * Math.PI) / 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  // Path: may have to change to create a better triangle
  var mainPath = 'M -.0 -0.05 L .0 0.025 L';
      pathX = String(x);
      space = ' ';
      pathY = String(y);
      pathEnd = ' Z';
  var path = mainPath.concat(pathX,space,pathY,pathEnd);
 
  var gaugeData = [
    {
      type: 'scatter',
      x: [0], 
      y:[0],
      marker: {size: 18, color:'850000'},
      showlegend: false,
      name: 'Frequency',
      text: level,
      hoverinfo: 'text+name'
    },
    {
      values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
      rotation: 90,
      text: ['8-9', '7-8', '6-7', '5-6','4-5', '3-4', '2-3','1-2','0-1',''],
      textinfo: 'text',
      textposition:'inside', 
      marker: {
        colors: [
          "rgba(0, 105, 11, .5)",
          "rgba(10, 120, 22, .5)",
          "rgba(14, 127, 0, .5)",
          "rgba(110, 154, 22, .5)",
          "rgba(170, 202, 42, .5)",
          "rgba(202, 209, 95, .5)",
          "rgba(210, 206, 145, .5)",
          "rgba(232, 226, 202, .5)",
          "rgba(240, 230, 215, .5)",
          "rgba(255, 255, 255, 0)"
        ]
      },
      labels: ['8-9', '7-8', '6-7', '5-6','4-5', '3-4', '2-3','1-2','0-1',' '],
      hoverinfo: 'label',
      hole: .5,
      type: 'pie',
      showlegend: false
    }
  ];

  var gaugeLayout = {
    shapes:[
      {
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {
          color: '850000'
        }
      }
    ],
    title: '<b>Belly Button Washing Frequency</b> <br>Scrubs per Week',
    height: 500,
    width: 500,
    xaxis: {
      zeroline:false, 
      showticklabels:false,
      showgrid: false, 
      range: [-1, 1]
    },
    yaxis: {
      zeroline:false, 
      showticklabels:false,
      showgrid: false, 
      range: [-1, 1]
    }
  };

  var GAUGE = document.getElementById("gauge");
  Plotly.newPlot(GAUGE, gaugeData, gaugeLayout);
}


function buildCharts(sample) {
  d3.json(`/samples/${sample}`).then((data) => {
    buildPie(data);
    buildBubble(data);    
  });
}


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];

    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
