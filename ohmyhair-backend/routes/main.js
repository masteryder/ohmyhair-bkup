function get_all_categories(req,res){
	pool.getConnection(function(err,connection){
        if (err) {
          return res.json({"code" : 100, "status" : "Error in connection database"});
        }   
        //console.log('connected as id ' + connection.threadId);
        
        connection.query("select * from categories",function(err,rows){
            connection.release();
            if(!err) {
                //console.log("backend.get_all_categories, returning: "+JSON.stringify(rows));
                return res.json(rows);
            }else{
                //console.log("backend.get_all_categories ERR, returning: "+err);
                return res.json(err);
            }
        });

        connection.on('error', function(err) {      
              return res.json({"code" : 100, "status" : "Error in connection database"});    
        });
  });
}
function get_all_clients(req,res){
    pool.getConnection(function(err,connection){
        if (err) {
          return res.json({"code" : 100, "status" : "Error in connection database"});
        }   
        //console.log('connected as id ' + connection.threadId);       
        connection.query("select * from clients",function(err,rows){
            connection.release();
            if(!err) {
                //console.log("backend.get_all_clients, returning: "+JSON.stringify(rows));
                return res.json(rows);
            }else{
                //console.log("backend.get_all_clients ERR, returning: "+err);
                return res.json(err);
            }           
        });

        connection.on('error', function(err) {      
              return res.json({"code" : 100, "status" : "Error in connection database"});
        });
		
  });
}
//Calls the database, gets list of all services
function get_all_services(req,res){
     pool.getConnection(function(err,connection){
        if (err) {
          return res.json({"code" : 100, "status" : "Error in connection database"});
        }   

        //console.log('connected as id ' + connection.threadId);
        
        connection.query("select * from services",function(err,rows){
            connection.release();
            if(!err) {
                //console.log("backend.get_all_services, returning: "+JSON.stringify(rows));
                return res.json(rows);
            }    
            else{
                console.log("backend.get_all_services ERR, returning: "+err);
                return res.json(err);
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

        //console.log('connected as id ' + connection.threadId);
        
        connection.query("select id, nom_produit, quantite, prix, categorie from produits",function(err,rows){
            connection.release();
            if(!err) {
                //console.log("backend.get_all_products, returning: "+JSON.stringify(rows));
                return res.json(rows);
            }else{
                //console.log("backend.get_all_services ERR, returning: "+err);
                return res.json(err);
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

        //console.log('connected as id ' + connection.threadId);
        

        var data={
            nom_produit:    input.nom_produit,
            prix:           input.prix,
            quantite:       input.quantite,
			categorie:		input.categorie,
			id:				input.id
        };


        var sql=mysql.format("update produits set nom_produit=?, prix=?, quantite=? where id=?",[data.nom_produit,data.prix,data.quantite,data.id]);
        //console.log(sql);
        connection.query(sql,function(err,rows){
            connection.release();
            if(err) {
               //console.log("Error updating: %s",err);
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
function update_service_price(req,res){
	var input = JSON.parse(JSON.stringify(req.body));
    pool.getConnection(function(err,connection){
        if (err) {
          return res.json({"code" : 100, "status" : "Error in connection database"});
        }   
        //console.log('connected as id ' + connection.threadId);
        var data={
            prix:           input.prix,
			id:				input.id
        };


        var sql=mysql.format("update services set prix=? where id=?",[data.prix,data.prix,data.id]);
        //console.log(sql);
        connection.query(sql,function(err,rows){
            connection.release();
            if(err) {
               //console.log("Error updating: %s",err);
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


/*function update_client(req,res){
	var input = JSON.parse(JSON.stringify(req.body));
    pool.getConnection(function(err,connection){
        if (err) {
          return res.json({"code" : 100, "status" : "Error in connection database"});
        }   

        console.log('connected as id ' + connection.threadId);
        

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
        console.log(sql);
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
}*/


/*function add_client(req,res){
    var input = JSON.parse(JSON.stringify(req.body));
    pool.getConnection(function(err,connection){
        if (err) {
          return res.json({"code" : 100, "status" : "Error in connection database"});
        }   

        console.log('connected as id ' + connection.threadId);
        

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
        //console.log(sql);
        connection.query(sql,function(err,rows){
            connection.release();
            if(err) {
               console.log("Error inserting: %s",err);
               return res.json("error");
            }else{
                return res.json("ok");
            }     
        });

        connection.on('error', function(err) {      
              return res.json({"code" : 100, "status" : "Error in connection database"});                
        });
		
  });
}*/
function add_client_services(req,res){
    var input = JSON.parse(JSON.stringify(req.body));
    pool.getConnection(function(err,connection){
        if (err) {
          return res.json({"code" : 100, "status" : "Error in connection database"});
          
        }   

        //console.log('connected as id ' + connection.threadId);
        var data={
            id_client:    req.params.id,
            timestamp:          new Date(input.timestamp),
            rabais:       input.rabais,
			paye_cash:		input.paye_cash,
            supplement: input.supplement,
            commentaire: input.commentaire,
            achat_client_produits: input.produits,
            achat_client_services: input.services
        };
        


        var insertedId;
        connection.query("INSERT INTO achat_client (id_client,timestamp,rabais,paye_cash,commentaire,supplement) VALUES (?,?,?,?,?,?)",[data.id_client,data.timestamp,data.rabais,data.paye_cash,data.commentaire,data.supplement],function(err,results,rows){
            if(!err) {
                insertedId=results.insertId;
                //console.log("First query went through, we added achat_client "+insertedId);

                var products=[];
                var services=[];
                data.achat_client_produits.forEach(function(element) {
                    products.push([insertedId,element.id,element.quantite,element.rabais,element.supplement,element.commentaire]);
                }, this);
                //console.log("Products: "+JSON.stringify(products));

                data.achat_client_services.forEach(function(element) {
                    services.push([insertedId,element.id,element.rabais,element.supplement,element.commentaire]);
                }, this);
                //console.log("Services: "+JSON.stringify(services));



                /*data.achat_client_services.forEach(function(element) {
                    console.log("foreach 1");*/
                    if(services.length>0)
                    {
                        var sql=mysql.format("INSERT INTO achat_client_services (id_achat_client,id_service,rabais,supplement,commentaire) VALUES ?",[services]);
                        //console.log(sql);
                        connection.query("INSERT INTO achat_client_services (id_achat_client,id_service,rabais,supplement,commentaire) VALUES ?",[services],function(err,rows){
                            if(err)
                            {   
                                //console.log(err.code+": "+err.message);
                                return res.json({"code" : 100, "status" : "Error in connection database"});
                            }
                        });
                    }

                    if(products.length>0)
                    {
                        var sql=mysql.format("INSERT INTO achat_client_produits (id_achat_client,id_produit,quantite,rabais,supplement,commentaire) VALUES ?",[products]);
                        connection.query("INSERT INTO achat_client_produits (id_achat_client,id_produit,quantite,rabais,supplement,commentaire) VALUES ?",[products],function(err,rows){
                        //console.log(sql);
                            if(err)
                            {
                                //console.log(err.code+": "+err.message);

                                return res.json({"code" : 100, "status" : "Error in connection database"});
                            }
                        });
                    }
                /*}, this);*/
            
            connection.release();
            return res.json("ok");
            }
            else
            {
                //console.log(err.code+": "+err.message);
                return res.json({"code":400,"status":"Entries not found"});
            }          
        });

        connection.on('error', function(err) {      
              return res.json({"code" : 100, "status" : "Error in connection database"});  
        });	
  });
}

function add_product(req,res){
    var input = JSON.parse(JSON.stringify(req.body));
    pool.getConnection(function(err,connection){
        if (err) {
          return res.json({"code" : 100, "status" : "Error in connection database"});
        }   

        //console.log('connected as id ' + connection.threadId);
        

        var data={
            nom_produit:    input.nom_produit,
            prix:           input.prix,
            quantite:       input.quantite,
			categorie:		input.categorie
        };


        var sql=mysql.format("insert into produits (nom_produit, prix, quantite, categorie) values (?, ?, ?, ?) ",[data.nom_produit,data.prix,data.quantite,data.categorie]);
        //console.log(sql);
        connection.query(sql,function(err,rows){
            connection.release();
            if(err) {
               //console.log("Error inserting: %s",err);
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
/*function get_client(req,res){
    pool.getConnection(function(err,connection){
        if (err) {
          return res.json({"code" : 100, "status" : "Error in connection database"});
        }   

        console.log('connected as id ' + connection.threadId);
        
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
}*/
function get_client_services(req,res){
    pool.getConnection(function(err,connection){
        if (err) {
          return res.json({"code" : 100, "status" : "Error in connection database"});
          
        }   
        var toReturn;
        //console.log('connected as id ' + connection.threadId);
        var query1=connection.query("select * from achat_client where id_client=? order by timestamp DESC",[req.params.id],function(err,rows){
            //connection.release();
            if(!err) {
                //console.log(rows);
                toReturn=rows;
                async.forEachOf(rows,function(dataElement,i,inner_callback){
                    var query2=connection.query("select id_service,rabais,supplement,commentaire from achat_client_services where id_achat_client=?",[rows[i].id],function(err,rows1){
                        if(!err)
                        {
                            toReturn[i].achat_clients_services=rows1;
                            var query3=connection.query("select * from achat_client_produits where id_achat_client=?",[rows[i].id],function(err,rows2){
                                if(!err)
                                {
                                    //console.log("Achat_client_produits("+i+"): "+rows2);
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
function get_brand_products(req,res) {
    
    pool.getConnection(function(err,connection){
        if (err) {
          return res.json({"code" : 100, "status" : "Error in connection database"});
        }   

        //console.log('connected as id ' + connection.threadId);
        
        var sql=mysql.format("select * from produits inner join marques on produits.marque=marques.id where nom_marque=?",[req.params.brandname]);
        connection.query(sql,function(err,rows){
            connection.release();
            if(!err) {
                return res.json(rows);
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

        //console.log('connected as id ' + connection.threadId);
        
        var sql=mysql.format("delete from produits where id=?",[req.params.id]);
		//console.log(sql);

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

/*function delete_client(req,res) {
    
    pool.getConnection(function(err,connection){
        if (err) {
          return res.json({"code" : 100, "status" : "Error in connection database"});
        }   

        console.log('connected as id ' + connection.threadId);
        
        var sql=mysql.format("delete from clients where id=?",[req.params.id]);
		console.log(sql);

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
}*/

function getDateServices(req,res){
    pool.getConnection(function(err,connection){
        if (err) {
          return res.json({"code" : 100, "status" : "Error in connection database"});
          
        }   
        var toReturn;
       // console.log('connected as id ' + connection.threadId);
        var query1=connection.query("select * from achat_client where timestamp=?",[req.params.date],function(err,rows){
            //connection.release();
            if(!err) {
                //console.log(rows);
                toReturn=rows;
                async.forEachOf(rows,function(dataElement,i,inner_callback){
                    var query2=connection.query("select id_service,rabais,supplement,commentaire from achat_client_services where id_achat_client=?",[rows[i].id],function(err,rows1){
                        if(!err)
                        {
                            toReturn[i].achat_clients_services=rows1;
                            var query3=connection.query("select * from achat_client_produits where id_achat_client=?",[rows[i].id],function(err,rows2){
                                if(!err)
                                {
                                    //console.log("Achat_client_produits("+i+"): "+rows2);
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
        //console.log("min date: "+minDate+" max date: "+maxDate);
            var toReturn;
            console.log('connected as id ' + connection.threadId);
            var query1=connection.query("select * from achat_client where timestamp>=? AND timestamp < ? order by timestamp DESC",[minDate,maxDate],function(err,rows){
                //connection.release();
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
                                        //console.log("Achat_client_produits("+i+"): "+rows2);
                                        toReturn[i].achat_client_produits=rows2;

                                        if(i==rows.length-1){
                                           // console.log(JSON.stringify(toReturn));
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


// Returns all products
app.get("/products",function(req,res){
        console.log("get on /products");
		get_all_products(req,res);
});
// UNUSED. Returns all brands
app.get("/brands",function(req,res){
    get_all_brands(req,res);
});
// UNUSED. Returns all products of given brand
app.get("/brands/:brandname",function(req,res){
        get_brand_products(req,res);
});
// Adds a new product to the catalog
app.put("/products",function(req,res){
	console.log("put on /products");
    add_product(req,res);
});

// Updates a certain client
/*app.post("/clients",function(req,res){
	console.log("post on /clients");
	update_client(req,res);
});*/
// Updates a certain service price 
app.post("/services/price/:id",function(req,res){
	console.log("post on /services/price/"+req.params.id);
	update_service_price(req,res);
});
// Deletes client with given id
/*app.delete("/clients/:id", function(req,res){
   console.log("delete on /clients/"+req.params.id);
   delete_client(req,res); 
});*/

// Updates a certain product 
app.post("/products",function(req,res){
	console.log("post on /products");
	update_product(req,res);
});
// Deletes a product of a certain ID
app.delete("/products/:id",function(req,res){
	console.log("delete on /products/"+req.params.id);
	delete_product(req,res);
});
// Returns the list of existing categories
app.get("/categories",function(req,res){
	console.log("get on /categories");
    get_all_categories(req,res);
});

// Returns a list of all existing services
app.get("/services",function(req,res){
    console.log("get on /services");
    get_all_services(req,res);
});
// Returns the services for a given client
app.get("/client-services/:id",function(req,res){
    console.log("get on /client-services/"+req.params.id);
	get_client_services(req,res);
});
// Returns a list of all the clients
/*app.get("/clients",function(req,res){
    console.log("get on /clients");
    get_all_clients(req,res);
});*/

// Returns a certain client, of a certain id
/*app.get("/clients/:id",function(req,res){
    console.log("get on /clients/"+req.params.id);
    get_client(req,res);
});*/

// Adds a new client
/*app.put("/clients",function(req,res){
    console.log("put on /clients");
    add_client(req,res);
    //res.end();
});*/

// Adds a new service done by client with id="id"
app.put("/client-services/:id",function(req,res){
    console.log("put on /clients-services/"+req.params.id);
    add_client_services(req,res);
    //res.end();
});
// Returns all the services that were done at a certain date
app.get("/date-services/:date", function(req,res){
    console.log("get on /date-services/"+req.params.date);
    getDateServices(req,res);
});
// Returns all the services that were done in a certain month
app.get("/month-services/:date", function(req,res){
    console.log("get on /month-services/"+req.params.date);
    getMonthServices(req,res);
});

module.exports = routes;