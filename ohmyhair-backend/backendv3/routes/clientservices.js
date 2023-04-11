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

    // Returns the services for a given client
    app.get("/client-services/:id",function(req,res){
        console.log("get on /client-services/"+req.params.id+" : "+new Date(Date.now()).toLocaleString());
        get_client_services(req,res);
    });
    // Adds a new service done by client with id="id"
    app.put("/client-services/:id",function(req,res){
        console.log("put on /clients-services/"+req.params.id+" : "+new Date(Date.now()).toLocaleString());
        add_client_services(req,res);
    });
    app.delete("/client-services/:id", function (req, res){
        console.log("delete on /client-services/"+req.params.id+" : "+new Date(Date.now()).toLocaleString());
        delete_client_service(req, res);
    });
    // Returns all the services that were done at a certain date
    app.get("/date-services/:date", function(req,res){
        console.log("get on /date-services/"+req.params.date+" : "+new Date(Date.now()).toLocaleString());
        getDateServices(req,res);
    });
    // Returns all the services that were done in a certain month
    app.get("/month-services/:date", function(req,res){
        console.log("get on /month-services/"+req.params.date+" : "+new Date(Date.now()).toLocaleString());
        getMonthServices(req,res);
    });



    function delete_client_service(req, res){
        pool.getConnection(function(err, connection){
            if (err) {
                console.log(err);
                return res.json({"code" : 100, "status" : "Error in connection database"});
            } 

            connection.query("DELETE FROM achat_client WHERE id = ?", [req.params.id],function(err, rows){
                if(!err) {
                    var deleteClientServiceServicesReq = mysql.format("DELETE FROM achat_client_services WHERE id_achat_client = ?", [req.params.id]);
                    connection.query(deleteClientServiceServicesReq,function(err,rows){
                        if(err) {
                            return res.json({"code" : 100, "status" : "Error in connection database"});
                        }        
                    });
                    connection.release
                    return res.json("ok");
                }
                else
                {
                    console.log(err);
                    connection.release();         
                    return res.json({"code":400,"status":"Entries not found"});
                }          
            });

            connection.on('error', function(err) {      
                return res.json({"code" : 100, "status" : "Error in connection database"});  
          }); 
           
        });
    }

    function get_client_services(req,res){
        pool.getConnection(function(err,connection){
            if (err) {
              return res.json({"code" : 100, "status" : "Error in connection database"});
            }   
            var toReturn;
            var query1=connection.query("select * from achat_client where id_client=? order by timestamp DESC",[req.params.id],function(err,rows){
                connection.release();  
                if(!err) {
                    toReturn=rows;
                    async.forEachOf(rows,function(dataElement,i,inner_callback){
                        var query2=connection.query("select id_service,rabais,supplement,commentaire from achat_client_services where id_achat_client=?",[rows[i].id],function(err,rows1){
                            if(!err)
                            {
                                toReturn[i].achat_clients_services=rows1;
                                var query3=connection.query("select * from achat_client_produits where id_achat_client=?",[rows[i].id],function(err,rows2){
                                    if(!err)
                                    {
                                        toReturn[i].achat_client_produits=rows2;
    
                                        if(i==rows.length-1){
                                            return res.json(toReturn);
                                        }
                                        inner_callback(null);
                                    }
                                    else
                                    {
                                        inner_callback(err);
                                    }
                                });
                            }
                            else
                            {
                                inner_callback(err);
                            }
                            
                        });
                        
                    }),
                    {

                    }
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

    function add_client_services(req,res){
        var input = JSON.parse(JSON.stringify(req.body));
        pool.getConnection(function(err,connection){
            if (err) {
                console.log(err);
              return res.json({"code" : 100, "status" : "Error in connection database"});
            }   
            var data={
                id_client:    req.params.id,
                timestamp:          new Date(input.timestamp),
                rabais:       input.rabais,
                paye_cash:      input.paye_cash,
                supplement: input.supplement,
                commentaire: input.commentaire,
                achat_client_produits: input.produits,
                achat_client_services: input.services
            };

            var insertedId;
            connection.query("INSERT INTO achat_client (id_client,timestamp,rabais,paye_cash,commentaire,supplement) VALUES (?,?,?,?,?,?)",[data.id_client,data.timestamp,data.rabais,data.paye_cash,data.commentaire,data.supplement],function(err,results,rows){
                if(!err) {
                    insertedId=results.insertId;
                    var products=[];
                    var services=[];

                    data.achat_client_produits.forEach(function(element) {
                        products.push([insertedId,element.id,element.quantite,element.rabais,element.supplement,element.commentaire]);
                    }, this);
                    data.achat_client_services.forEach(function(element) {
                        services.push([insertedId,element.id,element.rabais,element.supplement,element.commentaire]);
                    }, this);

                    if(services.length>0)
                    {
                        var sql=mysql.format("INSERT INTO achat_client_services (id_achat_client,id_service,rabais,supplement,commentaire) VALUES ?",[services]);
                        connection.query("INSERT INTO achat_client_services (id_achat_client,id_service,rabais,supplement,commentaire) VALUES ?",[services],function(err,rows){
                            if(err)
                            {   
                                console.log(err);
                                return res.json({"code" : 100, "status" : "Error in connection database"});
                            }
                        });
                    }

                    if(products.length>0)
                    {
                        var sql=mysql.format("INSERT INTO achat_client_produits (id_achat_client,id_produit,quantite,rabais,supplement,commentaire) VALUES ?",[products]);
                        connection.query("INSERT INTO achat_client_produits (id_achat_client,id_produit,quantite,rabais,supplement,commentaire) VALUES ?",[products],function(err,rows){
                            if(err)
                            {
                                return res.json({"code" : 100, "status" : "Error in connection database"});
                            }
                        });
                    }
                    connection.release();         
                    return res.json("ok");
                }
                else
                {
                    console.log(err);
                    connection.release();         
                    return res.json({"code":400,"status":"Entries not found"});
                } 
            });
    
            connection.on('error', function(err) {      
                  return res.json({"code" : 100, "status" : "Error in connection database"});  
            }); 
      });
    }

    function getDateServices(req,res){
        pool.getConnection(function(err,connection){
            if (err) {
              return res.json({"code" : 100, "status" : "Error in connection database"});
            }   
            var toReturn;
            var query1=connection.query("select * from achat_client where timestamp=?",[req.params.date],function(err,rows){
                connection.release();  
                if(!err) {
                    toReturn=rows;
                    async.forEachOf(rows,function(dataElement,i,inner_callback){
                        var query2=connection.query("select id_service,rabais,supplement,commentaire from achat_client_services where id_achat_client=?",[rows[i].id],function(err,rows1){
                            if(!err)
                            {
                                toReturn[i].achat_clients_services=rows1;
                                var query3=connection.query("select * from achat_client_produits where id_achat_client=?",[rows[i].id],function(err,rows2){
                                    if(!err)
                                    {
                                        toReturn[i].achat_client_produits=rows2;
    
                                        if(i==rows.length-1){
                                            return res.json(toReturn);
                                        }
                                        inner_callback(null);
                                    }
                                    else
                                    {
                                        inner_callback(err);
                                    }
                                });
                            }
                            else
                            {
                                inner_callback(err);
                            }
                        }); 
                    }),
                    {
                    }
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

    function getMonthServices(req,res){
        pool.getConnection(function(err,connection){
            if (err) {
                return res.json({"code" : 100, "status" : "Error in connection database"});
            }   
            var minDate=new Date(req.params.date);
            minDate.setDate(1);
            var maxDate=new Date(req.params.date);
            if(maxDate.getMonth()==12)
            {
                maxDate.setMonth(1);
            }
            else
            {
                maxDate.setMonth(maxDate.getMonth()+1);
            }
            maxDate.setDate(1);
                var toReturn;
                var query1=connection.query("select * from achat_client where timestamp>=? AND timestamp < ? order by timestamp DESC",[minDate,maxDate],function(err,rows){
                    connection.release();  
                    if(!err) {
                        toReturn=rows;
                        async.forEachOf(rows,function(dataElement,i,inner_callback){
                            var query2=connection.query("select id_service,rabais,supplement,commentaire from achat_client_services where id_achat_client=?",[rows[i].id],function(err,rows1){
                                if(!err)
                                {
                                    toReturn[i].achat_clients_services=rows1;
                                    var query3=connection.query("select * from achat_client_produits where id_achat_client=?",[rows[i].id],function(err,rows2){
                                        if(!err)
                                        {
                                            toReturn[i].achat_client_produits=rows2;

                                            if(i==rows.length-1){
                                                return res.json(toReturn);
                                            }
                                            inner_callback(null);
                                        }
                                        else
                                        {
                                            inner_callback(err);
                                        }
                                    });
                                }
                                else
                                {
                                    inner_callback(err);
                                }
                            });  
                        }),{}
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
}