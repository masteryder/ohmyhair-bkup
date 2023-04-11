import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Client } from "app/classes/client";
import { Product } from '../classes/product';
import { Categorie } from '../classes/categorie';
import { Service } from '../classes/service';
import { ServiceClient} from '../classes/service-client';
import { Http, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { ServiceService } from '../service.service';
import { ProductService } from '../product.service';
import { ClientserviceService } from '../clientservice.service';
import { ClientService } from '../client.service';
import { DataServiceService } from 'app/data-service.service';
//import { DataServiceService } from "app/data-service.service";

@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.css']
})
export class ClientDetailComponent implements OnInit {
  id: number;
  private sub: any;

  clientName: Promise<string>; 

  client: Client;
  Categories: Categorie[];
  Products: Product[];
  Services: Service[];
  ClientServices: ServiceClient[];

  load: boolean;



  constructor(private route: ActivatedRoute,private http: Http, private ds: DataServiceService,
  private serviceservice:ServiceService,private productservice:ProductService,
  private clientserviceservice:ClientserviceService,private clientservice:ClientService,
  private router: Router) { 
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.ngOnInit();
      }
    });
  }
  toggleLoad()
  {
    this.load=true;
  }

  async loadServices()
  {
    await this.serviceservice.loadServices().then(res=>{
      this.Services=res;
      return res;
    });
  }

  async loadProducts()
  {
    await this.productservice.loadProducts().then(res=>{
      this.Products=res;
      return res;
    });

  }
  async loadCategories()
  {
    await this.productservice.loadCategories().then(res=>{
      this.Categories=res;
      return res;
    });
  }
  async loadClientServices()
  {
    var data;
    await this.clientserviceservice.loadClientServices(this.id).then(res=>{
      data=res;
    });

    var servicesClientToAdd = new Array<ServiceClient>();
    for(var i=0;i<data.length;i++)
    {
      var productsToAdd=new Array<Product>();
        for(var j=0;j<Object.keys(data[i].achat_client_produits).length;j++)
        { 
          productsToAdd[j]=new Product("undefined",0,data[i].achat_client_produits[j].quantite,
          data[i].achat_client_produits[j].id_produit,0,
          data[i].achat_client_produits[j].rabais,
          data[i].achat_client_produits[j].supplement,
          data[i].achat_client_produits[j].commentaire);
        }
        
        var servicesToAdd=new Array<Service>();
          for(var j=0;j<Object.keys(data[i].achat_clients_services).length;j++)
          {
            servicesToAdd[j]=new Service("undefined",0,0,
            data[i].achat_clients_services[j].id_service,0,false,
            data[i].achat_clients_services[j].rabais,
            data[i].achat_clients_services[j].supplement,
            data[i].achat_clients_services[j].commentaire);
          }
      servicesClientToAdd[i]=new ServiceClient(data[i].id, data[i].id_client,
      data[i].timestamp,
      data[i].rabais,
      data[i].supplement,
      data[i].paye_cash,
      data[i].commentaire,
      servicesToAdd,
      productsToAdd);
    }
    this.ClientServices=servicesClientToAdd;
    // console.log("End result: "+JSON.stringify(this.ClientServices));
    return data;
  }
  getProductName(id:number):string
  {
    var toReturn:string;
    this.Products.forEach(element => {

      if(element.id==id)
      {
        toReturn=element.nom_produit;
      }
    });
    return toReturn;
  }
  getProductPrice(id:number):number
  {
    var toReturn:number;
    this.Products.forEach(element => {

      if(element.id==id)
      {
        toReturn=element.prix;
      }
    });
    return toReturn;
  }
  getServiceName(id:number):string
  {
    var toReturn:string;
    while(!this.Services);
    this.Services.forEach(element=>{

      if(element.id==id)
      {
        toReturn= element.nom_service;
      }
    });
    return toReturn;
  }
  getTotalServices(id:number):number
  { 
    var total:number=0;
      this.ClientServices[id].services.forEach(selement => {
        total+=this.getServicePrice(selement.id);
        total-=selement.rabais;
        total+=selement.supplement;
      });
    return total;
  }
  getTotalProduits(id:number):number
  {
    var total:number=0;
      this.ClientServices[id].produits.forEach(selement => {
        total+=this.getProductPrice(selement.id)*selement.quantite;
        total-=selement.rabais;
        total+=selement.supplement;
      });
    return total;
  }
  getTotal(id:number):number
  {
    var total:number=0;
    total+=this.getTotalServices(id);
    total+=this.getTotalProduits(id);
    total+=this.ClientServices[id].supplement;
    total-=this.ClientServices[id].rabais;
    return total;
  }
  getOverallTotal():number
  {
    var overallTotal:number=0;
    var i:number=0;
    this.ClientServices.forEach(element => {
      overallTotal+=this.getTotal(i);
      i++;
    });
    return overallTotal;
  }
  getNumberVisits():number
  {
    var numberVisits:number=0;
    this.ClientServices.forEach(element => {
      numberVisits++;
    });
    return numberVisits;
  }
  getServicePrice(id:number):number
  {
    var toReturn:number;
    this.Services.forEach(element=>{
        if(element.id==id)
        {
          toReturn= element.prix;
        }
      });
      return toReturn;
  }
 
  async ngOnInit() {

    console.log("Init being called inside Client Detail Component");
    this.sub = await this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
      this.clientName=this.clientservice.getClientName(this.id);
      });
      await this.loadProducts();
      await this.loadServices();
      await this.loadCategories();
      await this.loadClientServices() ;         

  }

}
