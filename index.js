const express = require("express");
const path = require('path');
const hbs = require('hbs');
const request = require('request');
const mysql = require('mysql2');
const pool = require('./database.js');
const app = express();

// Set the views directory and view engine for the app
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


//sets middleware for body parser
 app.use(express.urlencoded({extended:false}));


 //This function calls the articles in the Climate News API
function call_article(finishedAPI, ticker='aapl'){
  const options = {
    method: 'GET',
    url: 'https://climate-news-feed.p.rapidapi.com/',
    qs: {
      source: 'The Guardian',
      limit: '2'
    },
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
}

//using a 3rd party api to pull cordinates
function location(address = 'charlotte', callback) {
  const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(address) + '.json?access_token=pk.eyJ1IjoiY3ZhbmciLCJhIjoiY2xlMXAxYWd2MW15azNvbGdldGRkdmw3aiJ9.kI1WaYQ89vhzF-j9hOw5Xw'
  request({ url: url, json: true }, (error, { body }) => {
    if (error) {
      callback('Unable to connect to location services!', undefined)
    } else if (body.features.length === 0) {
      callback('Unable to find location. Try another search.', undefined)
    } else {
      callback(undefined, {
        lat: body.features[0].center[1],
        lng: body.features[0].center[0]
      })
    }
  })
}

// Brandon's API key 1 'e881ff5c-b841-11ed-a654-0242ac130002-e882009c-b841-11ed-a654-0242ac130002';
// Brandon's API key 2 = '6bd03f1a-b930-11ed-bc36-0242ac130002-6bd03f92-b930-11ed-bc36-0242ac130002';
// Ching's API key for Elevation- 8bd4a394-bd88-11ed-a654-0242ac130002-8bd4a448-bd88-11ed-a654-0242ac130002
function elevation(lat, lng, finishedAPI) {
  const url = `https://api.stormglass.io/v2/elevation/point?lat=${lat}&lng=${lng}`;

  const options = {
    method: 'GET',
    url: url,
    headers: {
      'Authorization': '6bd03f1a-b930-11ed-bc36-0242ac130002-6bd03f92-b930-11ed-bc36-0242ac130002',
      useQueryString: true
    },
    json: true
  }

 request(options, function (error, response, body) {
    if (error) throw new Error(error);
    if (response.statusCode === 200) { finishedAPI(body) }
  });
}

const apiUrl = 'https://services3.arcgis.com/pI4ewELlDKS2OpCN/arcgis/rest/services/SDG_14_1_1_Plastic_debris_density/FeatureServer/0/query';

const getLitterData = async (latitude=41.3601, longitude=-71.0589, radius=500) => {
  const params = new URLSearchParams({
    where: '1=1',
    outFields: '*',
    outSR: '4326',
    f: 'json',
    geometry: `${longitude},${latitude}`,
    geometryType: 'esriGeometryPoint',
    inSR: '4326',
    spatialRel: 'esriSpatialRelIntersects',
    distance: radius,
    units: 'esriSRUnit_Meter'
  });

  const response = await fetch(`${apiUrl}?${params.toString()}`);
  const data = await response.json();

  if (!data || !data.features || data.features.length === 0) {
    return null;
  } else {
    return data;
  }
};

// Define a route handler for the root URL
// This renders the "main.hbs" view using the Handlebars templating engine
app.get('/', function(req, res) {
  let newsData, elevationData, trashData;
  call_article(function (doneAPI) {
    newsData = doneAPI;
    if (elevationData && trashData) {
      res.render('./layouts/main', {
        news: newsData,
        elevation: elevationData,
        trash: trashData
      });
    }
  });
  location(req.body.location, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      elevation(data.lat, data.lng, (data) => {
        elevationData = data;
        if (newsData && trashData) {
          res.render('./layouts/main', {
            news: newsData,
            elevation: elevationData,
            trash: trashData
          });
        }
      });
      getLitterData(data.lat, data.lng)
        .then((data) => {
          trashData = data;
          if (newsData && elevationData) {
            res.render('./layouts/main', {
              news: newsData,
              elevation: elevationData,
              trash: trashData
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  });
});
app.post('/', function(req, res) {
  let newsData, elevationData, trashData;
  call_article(function (doneAPI) {
    newsData = doneAPI;
    if (elevationData && trashData) {
      res.render('./layouts/main', {
        news: newsData,
        elevation: elevationData,
        trash: trashData
      });
    }
  });
  location(req.body.location, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      elevation(data.lat, data.lng, (data) => {
        elevationData = data;
        if (newsData && trashData) {
          res.render('./layouts/main', {
            news: newsData,
            elevation: elevationData,
            trash: trashData
          });
        }
      });
      getLitterData(data.lat, data.lng)
        .then((data) => {
          trashData = data;
          if (newsData && elevationData) {
            res.render('./layouts/main', {
              news: newsData,
              elevation: elevationData,
              trash: trashData
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  });
});



// this takes you to the home page
app.get('/home', (req, res) => {
  let newsData, elevationData,trashData;

  call_article(function(doneAPI) {
    newsData = doneAPI;
    if (elevationData) {
      res.render('home', {
        news: newsData,
        elevation: elevationData,
        trash: trashData
      });
    }
  });

  location(req.body.location, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      elevation(data.lat, data.lng, (data) => {
        elevationData = data;
        if (newsData) {
          res.render('home', {
            news: newsData,
            elevation: elevationData,
            trash:trashData
          });
        }
      });
    }
  });
  location(req.body.location, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      getLitterData(data.lat, data.lng, (data) => {
        trashData = data;
        if (newsData) {
          res.render('home', {
            news: newsData,
            elevation: elevationData,
            trash: trashData
          });
        }
      });
    }
  });
});

app.post('/home', (req, res) => {
  let newsData, elevationData, trashData;

  call_article(function (doneAPI) {
    newsData = doneAPI;
    if (elevationData && trashData) {
      res.render('home', {
        news: newsData,
        elevation: elevationData,
        trash: trashData
      });
    }
  });

  location(req.body.location, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      elevation(data.lat, data.lng, (data) => {
        elevationData = data;
        if (newsData && trashData) {
          res.render('home', {
            news: newsData,
            elevation: elevationData,
            trash: trashData
          });
        }
      });
      
      getLitterData(data.lat, data.lng)
        .then((data) => {
          trashData = data;
          if (newsData && elevationData) {
            res.render('home', {
              news: newsData,
              elevation: elevationData,
              trash: trashData
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  });
});

//index.html
app.use(express.static(path.join(__dirname, 'public')));

// Parse JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false}));

app.get('/', (req, res) => {
  res.render('main');
});
app.get('/home', (req, res) => {
  res.render('home');
});

// Define a route handler for the form submission endpoint that inserts data into the MySQL database
app.post('/main', async (req, res) => {
  const { firstname, lastname, email, feedback } = req.body;
  console.log(`New feedback form submission: ${firstname}, ${lastname}, ${email}, ${feedback}`);

  try {
    // Execute an INSERT query with the form data
    const [rows, fields] = await pool.execute(
      'INSERT INTO feedback (first_name, last_name, email, feedback) VALUES (?, ?, ?, ?)',
      [firstname, lastname, email, feedback]
    );
    console.log(`Inserted ${rows.affectedRows} row(s)`);
    // Release the MySQL connection
    // pool.releaseConnection(connect);  //ends 
    // connect.release();
    res.send('Thanks for your feedback!');
  
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(8000, () => {
  console.log('Listening on port 8000');
});
