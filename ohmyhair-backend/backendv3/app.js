const app = require('express')();

const clientRoutes = require('./routes/clients')(app);
const productRoutes = require('./routes/products')(app);
const serviceRoutes = require('./routes/services')(app);
const clientserviceRoutes = require('./routes/clientservices')(app);

const PORT = process.env.PORT || 3000;

//var mysql = require('mysql');
var bodyParser = require('body-parser');
var cors = require('cors');
var async = require('async');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());


app.listen(PORT,()=>{
	console.log('App listening on port '+PORT);
});