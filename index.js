//needed npm express, path, hbs 

const express = require("express");
const path = require('path');
const hbs = require('hbs');
const request = require('request');
const bodyParser = ('body-parser')

const app = express();

// Set the views directory and view engine for the app
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//sets middleware for body parser
 app.use(express.urlencoded({extended:false}));


 function call_article(finishedAPI, ticker='aapl'){
  const options = {
    method: 'GET',
    url: 'https://climate-news-feed.p.rapidapi.com/page/1',
    qs: {limit: '5'},
    headers: {
      'X-RapidAPI-Key': '13d1b5e584mshf26bb79cd8c3801p1aba3fjsn419eecd14937',
      'X-RapidAPI-Host': 'climate-news-feed.p.rapidapi.com',
      useQueryString: true
    },
    json:true
  }
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    if(response.statusCode === 200){finishedAPI(body)}
  });
  // request('https://climate-news-feed.p.rapidapi.com/?rapidapi-key=13d1b5e584mshf26bb79cd8c3801p1aba3fjsn419eecd14937', {json:true},(err,res,body)=>{
  //     if(err){return console.log(err);}
  //     if(res.statusCode === 200){finishedAPI(body)}
  // });
}

const API_KEY = '6bd03f1a-b930-11ed-bc36-0242ac130002-6bd03f92-b930-11ed-bc36-0242ac130002';

const getElevationData = async (lat, lng) => {
  const url = `https://api.stormglass.io/v2/elevation/point?lat=${lat}&lng=${lng}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': API_KEY
    }
  });

  const data = await response.json();

  return data;
};

const getLocationData = async (location) => {
  const url = `https://nominatim.openstreetmap.org/search?q=${location}&format=json&limit=1`;

  const response = await fetch(url);
  const data = await response.json();

  return data[0];
};

const handleGetElevationClick = async () => {
  const locationInput = document.getElementById('location-input');
  const elevationOutput = document.getElementById('elevation-output');

  const location = locationInput.value;

  try {
    // Use the OpenStreetMap Nominatim API to get the latitude and longitude of the location
    const locationData = await getLocationData(location);
    const latLng = {
      lat: locationData.lat,
      lng: locationData.lon
    };

    // Get the elevation data from the Stormglass API
    const elevationData = await getElevationData(latLng.lat, latLng.lng);
    console.log(elevationData)
    console.log(typeof elevationData.data)
    elevationOutput.textContent = `Elevation: ${elevationData.data.elevation}`;
  } catch (error) {
    elevationOutput.textContent = `Error: ${error.message}`;
  }
};

// const getElevationBtn = document.getElementById('get-elevation-btn');
// getElevationBtn.addEventListener('click', handleGetElevationClick);


// Define a route handler for the root URL
// This renders the "main.hbs" view using the Handlebars templating engine
app.get('/', function(req, res) {
  call_article(function(doneAPI) {
    res.render('home', {
      news: doneAPI
    });
  })
});

// this takes you to the home page
app.get('/home', (req, res) => {
  call_article(function(doneAPI){
    res.render('home', {
        news: doneAPI
    })
  })
});

app.post('/home', (req, res) => {
  call_article(function(doneAPI){
    res.render('home', {
        news: doneAPI
    })
  })
});


// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));
app.listen(8000, () => {
  console.log('Server listening on port 8000');
});


// trash api
// const apiUrl = 'https://services3.arcgis.com/pI4ewELlDKS2OpCN/arcgis/rest/services/SDG_14_1_1_Plastic_debris_density/FeatureServer/0/query';

// const handleGetLitterClick = async () => {
//   const latitudeInput = document.getElementById('latitude-input');
//   const longitudeInput = document.getElementById('longitude-input');
//   const radiusInput = document.getElementById('radius-input');
//   const litterOutput = document.getElementById('litter-output');

//   const latitude = latitudeInput.value;
//   const longitude = longitudeInput.value;
//   const radius = radiusInput.value;

//   const params = new URLSearchParams({
//     where: '1=1',
//     outFields: '*',
//     outSR: '4326',
//     f: 'json',
//     geometry: `${longitude},${latitude}`,
//     geometryType: 'esriGeometryPoint',
//     inSR: '4326',
//     spatialRel: 'esriSpatialRelIntersects',
//     distance: radius,
//     units: 'esriSRUnit_Meter'
//   });

//   const response = await fetch(`${apiUrl}?${params.toString()}`);
//   const data = await response.json();

//   if (!data || !data.features || data.features.length === 0) {
//     litterOutput.textContent = 'No litter data found for this location';
//   } else {
//     const numItems = data.features.length;
//     litterOutput.textContent = `Number of items found: ${numItems}`;
//   }
// };

// const getLitterBtn = document.getElementById('get-litter-btn');
// getLitterBtn.addEventListener('click', handleGetLitterClick);

//ocean elavation api

// const API_KEY = 'e881ff5c-b841-11ed-a654-0242ac130002-e882009c-b841-11ed-a654-0242ac130002';
