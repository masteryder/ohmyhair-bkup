var pool = require('../pool');
var async = require('async');
var cors = require('cors');
var bodyParser = require('body-parser');
var mysql = require('mysql');


module.exports = function(app){
    app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());


    //------------------------------------
    //--------------ROUTES----------------
    //------------------------------------

    // Returns a list of all existing services
    app.get("/services",function(req,res){
        console.log("get on /services : "+new Date(Date.now()).toLocaleString());
        get_all_services(req,res);
    });
    // Updates a certain service price 
    app.post("/services/price/:id",function(req,res){
        console.log("post on /services/price/"+req.params.id+" : "+new Date(Date.now()).toLocaleString());
        update_service_price(req,res);
    });


    //------------------------------------
    //------------FUNCTIONS---------------
    //------------------------------------

    //Calls the database, gets list of all services
    function get_all_services(req,res){
        pool.getConnection(function(err,connection){
           if (err) {
             return res.json({"code" : 100, "status" : "Error in connection database"});
           }   
           
           connection.query("select * from services",function(err,rows){
               connection.release();
               if(!err) {
                   return res.json(rows);
               }    
               else{
                   return res.json(err);
               }       
           });
   
           connection.on('error', function(err) {      
                 return res.json({"code" : 100, "status" : "Error in connection database"});
           });
           
     });
   }

    function update_service_price(req,res){
        var input = JSON.parse(JSON.stringify(req.body));
        pool.getConnection(function(err,connection){
            if (err) {
              return res.json({"code" : 100, "status" : "Error in connection database"});
            }   

            var data={
                prix:           input.prix,
                id:       input.id
            };
    
    
            var sql=mysql.format("update services set prix=? where id=?",[data.prix,data.prix,data.id]);
            connection.query(sql,function(err,rows){
                connection.release();
                if(err) {
                    return res.json(err);
                }     
                else
                {
                    return res.json("ok");
                }      
            });
    
            connection.on('error', function(err) {      
                  return res.json({"code" : 100, "status" : "Error in connection database"});
            });
            
      });
    }
}