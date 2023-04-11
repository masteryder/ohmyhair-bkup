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

    // Updates a certain client
    app.post("/clients",function(req,res){
        console.log("post on /clients : "+new Date(Date.now()).toLocaleString());
        update_client(req,res);
    });
    // Deletes client with given id
    app.delete("/clients/:id", function(req,res){
        console.log("delete on /clients/"+req.params.id+" : "+new Date(Date.now()).toLocaleString());
        delete_client(req,res); 
    });
    // Returns a list of all the clients
    app.get("/clients",function(req,res){
        console.log("get on /clients : "+new Date(Date.now()).toLocaleString());
        get_all_clients(req,res);
    });

    // Returns a certain client, of a certain id
    app.get("/clients/:id",function(req,res){
        console.log("get on /clients/"+req.params.id)+" : "+new Date(Date.now()).toLocaleString();
        get_client(req,res);
    });
    // Adds a new client
    app.put("/clients",function(req,res){
        console.log("put on /clients : "+new Date(Date.now()).toLocaleString());
        add_client(req,res);
        //res.end();
    });

    // Returns the ids for the top [nb] of clients in terms of nb of services
    app.get("clients/top/:nb",function(req,res){
        console.log("get on /clients/top/"+req.params.nb+" : "+new Date(Date.now()).toLocaleString());
        get_top_clients(req,res);
    });
    // Returns total number of clients
    app.get("/clients/total",function(req,res){
        console.log("get on /clients/total/ : "+new Date(Date.now()).toLocaleString());
        get_total_clients(req,res);
    });


    //------------------------------------
    //------------FUNCTIONS---------------
    //------------------------------------

    function get_all_clients(req,res){
        pool.getConnection(function(err,connection){
            if (err) {
              return res.json({"code" : 100, "status" : "Error in connection database"});
            }   
            connection.query("select * from clients",function(err,rows){
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

    function update_client(req,res){
        var input = JSON.parse(JSON.stringify(req.body));
        pool.getConnection(function(err,connection){
            if (err) {
              return res.json({"code" : 100, "status" : "Error in connection database"});
            }               
    
            var data={
                id:    input.id,
                nom:           input.nom,
                prenom:       input.prenom,
                date_naissance:		input.date_naissance,
                telephone:				input.telephone,
                email:				input.email,
                rue:                input.rue,
                ville:              input.ville,
                npa:                input.npa
            };
    
    
            var sql=mysql.format("update clients set nom=?, prenom=?, date_naissance=?, telephone=?, email=?, rue=?, ville=?, npa=? where id=?",[data.nom,data.prenom,data.date_naissance,data.telephone,data.email,data.rue,data.ville,data.npa,data.id]);
            connection.query(sql,function(err,rows){
                connection.release();
                if(err) {
                   console.log("Error updating: %s",err);
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

    function add_client(req,res){
        var input = JSON.parse(JSON.stringify(req.body));
        pool.getConnection(function(err,connection){
            if (err) {
            return res.json({"code" : 100, "status" : "Error in connection database"});
            }   
            var data={
                nom:    input.nom,
                prenom:           input.prenom,
                date_naissance:       input.date_naissance,
                telephone:		input.telephone,
                email: input.email,
                rue: input.rue,
                ville: input.ville,
                npa: input.npa
            };
            var sql=mysql.format("insert into clients (nom, prenom, date_naissance, telephone, email, rue, ville, npa) values (?, ?, ?, ?, ?, ?, ?, ?) ",[data.nom,data.prenom,data.date_naissance,data.telephone,data.email,data.rue,data.ville,data.npa]);
            connection.query(sql,function(err,rows){
                connection.release();
                if(err) {
                console.log("Error inserting: %s",err);
                return res.json("error");
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

    function get_client(req,res){
        pool.getConnection(function(err,connection){
            if (err) {
                return res.json({"code" : 100, "status" : "Error in connection database"});
            }   

            connection.query("select * from clients where id=?",[req.params.id],function(err,rows){
                connection.release();
                if(!err) {
                    return res.json(rows);
                }
                else
                {
                    return res.json({"code":400,"status":"Entries not found"});
                }          
            });

            connection.on('error', function(err) {      
                return res.json({"code" : 100, "status" : "Error in connection database"});
                    
            });	
        });
    }

    function delete_client(req,res) {
    
        pool.getConnection(function(err,connection){
            if (err) {
              return res.json({"code" : 100, "status" : "Error in connection database"});
            }   
                
            var sql=mysql.format("delete from clients where id=?",[req.params.id]);
    
            connection.query(sql,function(err,rows){
                connection.release();
                if(!err) {
                    return res.json(rows);
                }
                else
                {
                    return res.end();
                }          
            });
    
            connection.on('error', function(err) {      
                  return res.json({"code" : 100, "status" : "Error in connection database"});
            });	
      });
    }

    function get_top_clients(req,res){

    }

    function get_total_clients(req,res){

    }
}