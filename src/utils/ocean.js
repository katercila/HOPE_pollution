const request = require('request');

//Call API here
 const oceanPlastic = (address, callback) =>{
    const url = 'Goes here'

    request({url: url, json: true}, (error, { body }) => {
        if (error) {
            callback('Unable to connect to location services!', undefined)
        } else if (body.features.length === 0) {
            callback('Unable to find location. Try another search.', undefined)
        } else {
            callback(undefined, {})
        } 
    })
 }




module.exports = oceanPlastic