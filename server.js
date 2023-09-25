const express = require('express');
const port = 3000;
const app = express();
var bodyParser = require('body-parser');
const { json } = require('express');
var localStorage = [];
const fs = require('fs');

// // Below statements must be wrapped inside the 'async' function:
fs.readFile(__dirname + '/data.json', "utf-8", function (err, data) {
    if (err) {
        console.error(err);
    }
    data = data.toString();
    localStorage = (data !== '') ? JSON.parse(data) : [];
});

app.set('view engine', 'ejs');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index', { data: localStorage });
});

app.get('/finish', (req, res) => {
    objIndex = localStorage.findIndex((obj => obj.id == req.query.id));
    localStorage[objIndex].status = 1;

    saveData(localStorage);

    res.redirect('/');
});

app.get('/delete', (req, res) => {
    localStorage = localStorage.filter((item) => {
        console.log(item.id != req.query.id);
        return item.id != req.query.id;
    });

    saveData(localStorage);

    res.redirect('/');
});


app.post('/add', (req, res) => {
    const object = {
        id: ((localStorage.length > 0) ? localStorage[localStorage.length - 1].id : 0) + 1,
        task: req.body.task,
        status: 0,
    };
    localStorage.push(object);

    saveData(localStorage);

    res.redirect('/');
});

app.listen(port, (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log(`Please open http://localhost:${port} on your browser`);
    }
});

/**
 * 
 * @param {json} data 
 * It will save the data into a local file
 */
function saveData(data) {
    var jsonContent = JSON.stringify(data);

    fs.writeFile(__dirname + '/data.json', jsonContent, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
        console.warn("JSON file has been saved.");
    });
}