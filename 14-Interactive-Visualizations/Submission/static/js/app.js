// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let info = metadata.filter(x => x.id == sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for (const [key, value] of Object.entries(info)) {
      panel.append("h6").text(`${key}: ${value}`);
    }

  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let sampleData = data.samples;

    // Filter the samples for the object with the desired sample number
    let info = sampleData.filter(x => x.id == sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otu_id = info.otu_ids;
    let otu_label = info.otu_labels;
    let sample_value = info.sample_values;

    // Build a Bubble Chart
    let bubble_trace = {
      x: otu_id,
      y: sample_value,
      mode: 'markers',
      marker: {
        color: otu_id,
        size: sample_value,
        colorscale: "Picnic"
      },
      text: otu_label
      };
    
    let bubble_traces = [bubble_trace];

    // Render the Bubble Chart
    let bubble_layout = {
      title: 'Bacteria Cultures per Sample'
    };

    Plotly.newPlot('bubble', bubble_traces, bubble_layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    
    let bar_y = otu_id.map(x => `OTU: ${x}`);
    console.log(bar_y);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let bar_trace = {
      x: sample_value.slice(0, 10).reverse(),
      y: bar_y.slice(0, 10).reverse(),
      type: 'bar',
      marker: {
        colorscale: "Picnic",
        color: sample_value.slice(0, 10).reverse()
      },
      text: otu_label.slice(0, 10).reverse(),
      orientation: 'h'
    };
    let bar_traces = [bar_trace];

    // Render the Bar Chart
    let bar_layout = {
      title: 'Top 10 Bacteria Cultures Found'
    };

    Plotly.newPlot('bar', bar_traces, bar_layout);

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let nameData = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let i = 0; i < nameData.length; i++){
      let name = nameData[i];
      dropdown.append("option").text(name);
    }

    // Get the first sample from the list
    let default_name = nameData[0];


    // Build charts and metadata panel with the first sample
    buildCharts(default_name);
    buildMetadata(default_name);

  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
