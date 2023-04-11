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

    // Returns all products
    app.get("/products",function(req,res){
        console.log("get on /products : "+new Date(Date.now()).toLocaleString());
        get_all_products(req,res);
    });
    // Returns the list of existing categories
    app.get("/categories",function(req,res){
        console.log("get on /categories : "+new Date(Date.now()).toLocaleString());
        get_all_categories(req,res);
    });
    // Adds a new product to the catalog
    app.put("/products",function(req,res){
        console.log("put on /products : "+new Date(Date.now()).toLocaleString());
    add_product(req,res);
    });
    // Updates a certain product 
    app.post("/products",function(req,res){
        console.log("post on /products : "+new Date(Date.now()).toLocaleString());
        update_product(req,res);
    });
    // Deletes a product of a certain ID
    app.delete("/products/:id",function(req,res){
        console.log("delete on /products/"+req.params.id+" : "+new Date(Date.now()).toLocaleString());
        delete_product(req,res);
    });

    //------------------------------------
    //------------FUNCTIONS---------------
    //------------------------------------
    
    function add_product(req,res){
        var input = JSON.parse(JSON.stringify(req.body));
        pool.getConnection(function(err,connection){
            if (err) {
              return res.json({"code" : 100, "status" : "Error in connection database"});
            }   
    
            var data={
                nom_produit:    input.nom_produit,
                prix:           input.prix,
                quantite:       input.quantite,
                categorie:      input.categorie
            };
    
            var sql=mysql.format("insert into produits (nom_produit, prix, quantite, categorie) values (?, ?, ?, ?) ",[data.nom_produit,data.prix,data.quantite,data.categorie]);
            connection.query(sql,function(err,rows){
                connection.release();
                if(err) {
                    return res.json("error: "+ err);
                }
                else{
                    return res.json("add ok");
                }       
            });
    
            connection.on('error', function(err) {      
                  return res.json({"code" : 100, "status" : "Error in connection database"});    
            });
            
      });
    }
    function delete_product(req,res) {
    
        pool.getConnection(function(err,connection){
            if (err) {
              return res.json({"code" : 100, "status" : "Error in connection database"});
            }   
                
            var sql=mysql.format("delete from produits where id=?",[req.params.id]);
    
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
    function update_product(req,res){
        var input = JSON.parse(JSON.stringify(req.body));
        pool.getConnection(function(err,connection){
            if (err) {
              return res.json({"code" : 100, "status" : "Error in connection database"});
            }               
    
            var data={
                nom_produit:    input.nom_produit,
                prix:           input.prix,
                quantite:       input.quantite,
                categorie:      input.categorie,
                id:             input.id
            };
    
            var sql=mysql.format("update produits set nom_produit=?, prix=?, quantite=? where id=?",[data.nom_produit,data.prix,data.quantite,data.id]);
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

    //Calls the database, gets list of all products
    function get_all_products(req,res) {
    
        pool.getConnection(function(err,connection){
            if (err) {
              return res.json({"code" : 100, "status" : "Error in connection database"});
            }   
            connection.query("select id, nom_produit, quantite, prix, categorie from produits",function(err,rows){
                connection.release();
                if(!err) {
                    return res.json(rows);
                }else{
                    return res.json(err);
                }        
            });
    
            connection.on('error', function(err) {      
                  return res.json({"code" : 100, "status" : "Error in connection database"});
            }); 
      });
    }
    function get_all_categories(req,res){
        pool.getConnection(function(err,connection){
            if (err) {
              return res.json({"code" : 100, "status" : "Error in connection database"});
            }   
            
            connection.query("select * from categories",function(err,rows){
                connection.release();
                if(!err) {
                    return res.json(rows);
                }else{
                    return res.json(err);
                }
            });
    
            connection.on('error', function(err) {      
                  return res.json({"code" : 100, "status" : "Error in connection database"});    
            });
      });
    }
}