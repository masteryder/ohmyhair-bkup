import { Injectable, OnInit } from '@angular/core';
import { Observable, Subject  } from 'rxjs/Rx';
import { Product } from './classes/product';
import { Service } from './classes/service';
import { Categorie } from './classes/categorie';
import { Client } from "./classes/client";
import { Http, Headers, RequestOptions } from '@angular/http';
import { ServiceClient } from "app/classes/service-client";

/**
 * contains calls to the API
 * serves list of objects (clients, services, products) to the pages
 */
@Injectable()
export class DataServiceService implements OnInit {

  async ngOnInit() {
    /*console.log("On init begin");
    await this.LoadEverything();
    console.log("On init end");*/
  }

  public readonly clients_URL="http://localhost:3000/clients";
  public readonly clients_services_URL="http://localhost:3000/client-services";
  public readonly month_services_URL="http://localhost:3000/month-services";
  public readonly date_services_URL="http://localhost:3000/date-services";
  public readonly service_client_URL="http://localhost:3000/client-services";

  public readonly services_URL="http://localhost:3000/services";
  public readonly products_URL="http://localhost:3000/products";
  public readonly categories_URL="http://localhost:3000/categories";

  //public productO: Subject<Product[]>;
  //public categorieO: Subject<Categorie[]>;
  //public clientO: Subject<Client[]>;
  //public serviceO: Subject<Service[]>;

  public Products: Product[];


  public Categories: Categorie[];
  public Clients: Client[];
  public Services: Service[];

  private categoriesLoaded: boolean = false;
  private productsLoaded: boolean = false;
  private servicesLoaded: boolean = false;
  private clientsLoaded: boolean = false;

  constructor(private http: Http) { 
    this.categoriesLoaded=false;
    this.clientsLoaded=false;
    this.productsLoaded=false;
    this.servicesLoaded=false;
    this.LoadEverything();
  }
  async LoadEverything(){
    
    if(!this.categoriesLoaded)
    {
      await this.loadCategories().then(()=>{
        this.categoriesLoaded=true;
      }).catch(()=>{
        this.categoriesLoaded=false;
        console.log("Unable to load categories");
      });
    }

    if(!this.servicesLoaded)
    {
      await this.loadServices().then(()=>{
          this.servicesLoaded=true;
      }).catch(()=>{
            this.servicesLoaded=false;
            console.log("Unable to load services");
      });
    }

    if(!this.clientsLoaded)
    {
      await this.loadClients().then(()=>{
          this.clientsLoaded=true;
      }).catch(()=>{
        this.clientsLoaded=false;
        console.log("clients not able to be loaded :/");
      });
    }

    if(!this.productsLoaded)
    {
      await this.loadProducts().then(()=>{
      this.productsLoaded=true;
      }).catch(()=>{
        this.productsLoaded=false;
        console.log("products not able to be loaded :(");
      });
    }
  }
    /** Receives date (String) returns list or all Services that were done in a certain month */
    public async loadClientServicesMonth(date: string): Promise<ServiceClient[]>
    {
      const res = await this.http.get(this.month_services_URL+"/"+date).first().map((res)=>res.json()).toPromise();
      return res;
    }
    public async loadClientServicesDay(date: string): Promise<ServiceClient[]>
    {
      const res = await this.http.get(this.date_services_URL+"/"+date).first().map((res)=>res.json()).toPromise();
      return res;
    }
    public async loadCategories(): Promise<Categorie[]>
    {
      const res= await this.http.get(this.categories_URL).first().map((res)=>res.json()).toPromise();
      this.categoriesLoaded=true;
      this.Categories=res;
      return res;
    }
    public async loadProducts(): Promise<Product[]>
    {
      const res= await this.http.get(this.products_URL).first().map((res)=>res.json()).toPromise();
      this.productsLoaded=true;
      this.Products=res;
      return res;
    }

    /**/
    public async loadClients(): Promise<Client[]>
    {
      const res= await this.http.get(this.clients_URL).first().map((res)=>res.json()).toPromise();
      this.clientsLoaded=true;
      this.Clients=res;
      return res;
    }
    public async loadServices(): Promise<Service[]>
    {
      const res= await this.http.get(this.services_URL).first().map((res)=>res.json()).toPromise();
      this.servicesLoaded=true;
      this.Services=res;
      return res;
    }
    public async getProductName(id:number): Promise<string>
    {
      if(!this.productsLoaded)
        {
          const res=await this.loadProducts();
          if(res)
            {
              this.productsLoaded=true;
            }
        }
      var toReturn: string;
        this.Products.forEach(element => {
          if(element.id==id)
          {
            toReturn=element.nom_produit;
          }
      });
      return toReturn;
    }

    public async getProductPrice(id:number):Promise<number>
    {
      if(!this.productsLoaded)
        {
          await this.loadProducts().then(()=>{
            this.productsLoaded=true;
            console.log("Inside GetProductPrice, loaded products succesfully");
          }).catch((e)=>{
            this.productsLoaded=false;
            console.log("Inside GetProductPrice, error: "+e);
          });
        }
      var toReturn:number;
      this.Products.forEach(element => {
        if(element.id==id)
        {
          toReturn=element.prix;
        }
      });
      return toReturn;
    }

    public async getServicePrice(id:number):Promise<number>
    {
      if(!this.servicesLoaded)
        {
          const res=await this.loadServices();
          if(res)
            {
              this.servicesLoaded=true;
            }
            else
            {
              console.log("Unable to load services");
              return -1;
            }
        }
      var toReturn:number;
      this.Services.forEach(element => {
        if(element.id==id)
        {
          toReturn=element.prix;
        }
      });
      return toReturn;
    }

    public async deleteClientService(clientServiceId: number){
      if(confirm("Êtes-vous sûr(e) de vouloir supprimer ce service ?")) {
        const res = await this.http.delete(this.clients_services_URL+"/"+clientServiceId).first().map((res)=>res.json()).toPromise();;
        return res;
      }
    }

    /**
   * Receives an id, returns the id's name for the service
   * @param id 
   */
    public async getServiceName(id:number): Promise<string>
    {
      console.log("DataService.getServiceName called with param: "+id);
      if(!this.servicesLoaded)
        {
          console.log("DataService.getServiceName(): Services not loaded, waiting for this.loadServices");
          const res=await this.loadServices();
          if(res)
            {
              this.servicesLoaded=true;
            }
            else
            {
              console.log("Unable to load services");
              return "undefined";
            }
        }
        var toReturn: string;
        this.Services.forEach(element => {
          if(element.id==id)
          {
            toReturn=element.nom_service;
          }
      });
      console.log("DataService.GetServiceName(): returning"+ toReturn);
      return toReturn;
    }

  /**
   * Receives an id, returns the id's name for the client
   * @param id 
   */
  public async getClientName(id: number): Promise<string>{
    console.log("DataService.getClientName() with param: "+id);
    if(!this.clientsLoaded)
        {
          console.log("DataService.getClientName(): Clients not loaded, waiting for this.loadClients");
          const res=await this.loadClients();
          if(res)
            {
              this.clientsLoaded=true;
            }
            else
            {
              console.log("Unable to load clients");
              return "undefined";
            }
        }
    var toReturn: string;
    this.Clients.forEach(element=>{
      if(element.id==id)
      {
        toReturn=element.prenom+" "+element.nom;
      }
    });
    console.log("DataService.getClientName() returning : "+toReturn);

    return toReturn;
  }

  /**
   * Returns a date with bars
   */
  public textDate(hDate: string):string
    {
      var date=new Date(hDate);
      var day=date.getDate();
      var month=date.getMonth()+1;
      var year=date.getFullYear();
      return day+"/"+month+"/"+year;
    }

    /**
     * Returns date in a pretty format (ex: 12 avril 2016)
     * @param hDate date to convert
     */
    public prettyDate(hDate: string):string{
      var monthNames=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
      var date=new Date(hDate);
      var day=date.getDate();
      var month=date.getMonth();
      var year=date.getFullYear();      
      return day+" "+monthNames[date.getMonth()]+" "+year;
    }
    public async GetListClients(): Promise<Client[]>
    {
      if(!this.clientsLoaded)
      {
        console.log("DataService.GetListClients(): Clients NOT previously loaded, waiting for DataService.loadClients()");
        if(this.Clients!=null)console.log("-----------this.Clients!=null");
        else console.log("------------this.Clients==null");
        await this.loadClients();
        console.log("DataService.GetListClients(): Finished calling loadClients()");
        if(this.Clients!=null)console.log("-----------this.Clients!=null");
        else console.log("------------this.Clients==null");
        this.clientsLoaded=true;
      }
      else
      {
        console.log("DataService.GetListClients(): Clients previously loaded");
      }
      console.log("Data-service: GetListClients(): returning: "+this.Clients);
      return this.Clients;
    }
    public async GetListServices(): Promise<Service[]>
    {
      if(!this.servicesLoaded)
      {
        await this.loadServices();
        this.servicesLoaded=true;
      }
      console.log("Data-service: GetListServices(): returning: "+this.Services);
      return this.Services;
    }
    public async GetListProducts(): Promise<Product[]>
    {
      if(!this.productsLoaded)
      {
        await this.loadProducts();
        this.productsLoaded=true;
      }
      console.log("Data-service: GetListProducts(): returning: "+this.Products);
      return this.Products;
    }
    public async GetListCategories(): Promise<Categorie[]>
    {
      if(!this.categoriesLoaded)
      {
        await this.loadCategories();
        this.categoriesLoaded=true;
      }
      console.log("Data-service: GetListCategories(): returning: "+this.Categories);
      return this.Categories;
    }

}
