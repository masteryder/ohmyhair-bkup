import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Service } from '../classes/service';
import { Client } from "app/classes/client";
import { Product } from '../classes/product';
import { Observable } from 'rxjs/Rx';
import { ServiceClient } from "app/classes/service-client";
//import { DataServiceService } from "app/data-service.service";
import { Router } from '@angular/router'; 
import { ClientService } from '../client.service';
import { ProductService } from '../product.service';
import { ServiceService } from '../service.service';
import { ClientserviceService } from '../clientservice.service';


@Component({
  selector: 'app-caisse',
  templateUrl: './caisse.component.html',
  styleUrls: ['./caisse.component.css']  
})
export class CaisseComponent implements OnInit {

  ServiceClient: ServiceClient;

  missingFields: boolean;
  addSuccess: boolean;

  Clients: Client[];
  Services: Service[];
  Products: Product[];

  total: number;

  isEnfant: boolean;
  longueur:number;
  sexe:number;

  clientOptions: Array<any>;
  clientSelectValue: number;

  servicesOptions: Array<any>;
  servicesSelectValue: number;  
  currentServices: Array<any>;
  currentServicesNames: Array<string>;
  currentServicesPrices: Array<number>;

  paye_cash: boolean;
  rabais: number;
  supplement: number;
  commentaire: string;

  numProducts: number;
  numServices: number;

  produitsOptions: Array<any>;
  produitsSelectValue: number;
  currentProducts: Array<any>;
  currentProductsNames: Array<string>;
  currentProductsPrices: Array<number>;

  quantiteP: Array<number>;
  rabaisP: Array<number>;
  supplementP: Array<number>;
  commentaireP: Array<string>;
  
  rabaisS: Array<number>;
  supplementS: Array<number>;
  commentaireS: Array<string>;

  constructor(private http: Http, private router: Router, 
    private productservice:ProductService, private serviceservice:ServiceService,
    private clientservice:ClientService, private clientserviceservice:ClientserviceService) { 
      this.total = 0;
    }

  async ngOnInit() {

    this.paye_cash=true;
    this.rabais=0;
    this.supplement=0;
    this.commentaire="";
    this.isEnfant=false;
    this.longueur=0;
    this.sexe=0;

    this.quantiteP=[];
    this.rabaisP=[];
    this.supplementP=[];
    this.commentaireP=[];
    this.rabaisS=[];
    this.supplementS=[];
    this.commentaireS=[];

    console.log("clients.component.ts: ngOnInit(): Calling this.loadClients");
    await this.loadClients();
    console.log("clients.component.ts: ngOnInit(): Clients Loaded ");
    this.currentProducts=new Array<number>();
    this.currentProductsNames = new Array<string>();
    this.currentProductsPrices = new Array<number>();
    this.currentServices=new Array<number>();

    this.currentServicesNames = new Array<string>();
    this.currentServicesPrices = new Array<number>();
    await this.loadProducts();
    console.log("clients.component.ts: ngOnInit(): Products Loaded ");
    await this.loadServices();
    console.log("clients.component.ts: ngOnInit(): Services Loaded ");
  }
  toggleEnfant()
  {
    this.isEnfant=!this.isEnfant;
    this.updateLongueur();
  }
  updateLongueur()
  {
    this.servicesOptions=new Array<any>();
    this.Services.forEach(element=>{
      if(!this.isEnfant)
      {
        if(this.sexe==0)//MEN AND WOMEN
        {
            if(this.longueur==0 && !element.enfant)
            {

              this.servicesOptions.push({value:element.id,label:element.nom_service});
            }
            else
            {
                if(element.longueur==this.longueur && !element.enfant)
                  {
                    this.servicesOptions.push({value:element.id,label:element.nom_service});
                  }
            }
        }
        else if(this.sexe==1)
        {
          if(element.sexe==1)
          {
            this.servicesOptions.push({value:element.id,label:element.nom_service});
          }
        }
        else
        {
          if(this.longueur!=0)
          {
              if(element.sexe==this.sexe && element.longueur==this.longueur && !element.enfant)
              {
                this.servicesOptions.push({value:element.id,label:element.nom_service});
              }
          }
          else
          {
            if(element.sexe==this.sexe && !element.enfant)
            {
              this.servicesOptions.push({value:element.id,label:element.nom_service});
            }
          }
          
        }
        
      }
      else
      {
        if(this.sexe==0)
        {
            if(element.enfant)
            {
              this.servicesOptions.push({value:element.id,label:element.nom_service});
            }
        }
        else
        {
          if(element.enfant && element.sexe==this.sexe)
            {
              this.servicesOptions.push({value:element.id,label:element.nom_service});
            }
        }
          
      }
      
       
    });
    console.log("update longueur called");
  }
  deleteService(index: number)
  {
    this.currentServices.splice(index,1);
    this.currentServicesNames.splice(index,1);
    this.currentServicesPrices.splice(index,1);
    this.rabaisS.splice(index,1);
    this.supplementS.splice(index,1);
    this.commentaireS.splice(index,1);

    this.calculateTotal();
  }
  async addService()
  {
    console.log("services select value = "+this.servicesSelectValue);
    this.currentServices.push(this.servicesSelectValue);

    const serviceName=await this.serviceservice.getServiceName(this.servicesSelectValue);
    this.currentServicesNames.push(serviceName);
    
    const servicePrice=await this.serviceservice.getServicePrice(this.servicesSelectValue);
    this.currentServicesPrices.push(servicePrice);

    this.rabaisS.push(0);
    this.supplementS.push(0);

    this.calculateTotal();
  }
  deleteProduct(index: number)
  {
    this.currentProducts.splice(index,1);
    this.currentProductsNames.splice(index,1);
    this.currentProductsPrices.splice(index,1);
    this.rabaisP.splice(index,1);
    this.supplementP.splice(index,1);
    this.commentaireP.splice(index,1);

    this.calculateTotal();

  }
  async addProduct()
  {
    this.currentProducts.push(this.produitsSelectValue);

    const productName=await this.productservice.getProductName(this.produitsSelectValue);
    this.currentProductsNames.push(productName);

    const productPrice=await this.productservice.getProductPrice(this.produitsSelectValue);
    this.currentProductsPrices.push(productPrice);

    this.rabaisP.push(0);
    this.supplementP.push(0);
    this.quantiteP.push(1);

    this.calculateTotal();

  }
  async loadServices()
  {
    
    this.servicesOptions=new Array<any>();

      await this.serviceservice.loadServices().then(res=>{
      this.Services=res;
      for (let element of this.Services)
        {
          this.servicesOptions.push({value:element.id,label:element.nom_service});
        }
        return;
    });
  }
  async loadClients()
  {
    this.clientOptions=new Array<any>();
      await this.clientservice.loadClients().then(res=>{
      this.Clients=res;
      for (let element of this.Clients)
      {
          this.clientOptions.push({value:element.id,label:element.prenom+" "+element.nom});
      }
      return;
    });
  }
  async loadProducts()
  {
    this.produitsOptions=new Array<any>();
     await this.productservice.loadProducts().then(res=>{
      this.Products=res;
      for (let element of this.Products)
        {
          this.produitsOptions.push({value:element.id,label:element.nom_produit});
        }
        return;
    });
  }

  public async calculateTotal(): Promise<number>
  {
    var total: number=0;
    var iP: number=0;
    for (let p of this.currentProducts){
        const pp= await this.productservice.getProductPrice(p);
        total+=pp*this.quantiteP[iP];
        iP++;
    }
    for (let s of this.currentServices){
      const sp=await this.serviceservice.getServicePrice(s);
      total+=sp;
    }

    this.supplementP.forEach(element => {
      total+=element;
    });
    this.supplementS.forEach(element=>{
      total+=element;
    });
    this.rabaisP.forEach(element=>{
      total-=element;
    });
    this.rabaisS.forEach(element=>{
      total-=element;
    });
    total+=this.supplement;
    total-=this.rabais;
    this.total=total;
    return total;
  }

  async Validate(){
    var clientId=this.clientSelectValue;
    if(clientId!=undefined)
    {
      var services: Array<Service>= new Array<Service>();
      var products: Array<Product>=new Array<Product>();
      var indexServices=0;
      var indexProducts=0;

      this.currentServices.forEach(element => {
          services.push(new Service("",-1,-1,element,-1,false,this.rabaisS[indexServices],this.supplementS[indexServices],this.commentaireS[indexServices]));
          indexServices++;
      });
      this.currentProducts.forEach(element => {
        products.push(new Product("",-1,this.quantiteP[indexProducts],element,-1,this.rabaisP[indexProducts],this.supplementP[indexProducts],this.commentaireP[indexProducts]));
        indexProducts++;
      });

      this.ServiceClient=new ServiceClient(-1,clientId,new Date(),this.rabais,this.supplement,this.paye_cash,this.commentaire,services,products);
      /*
      var ServiceClientToAdd=JSON.stringify(this.ServiceClient);
      console.log("Sending : "+ServiceClientToAdd);
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      await this.http.put(this.ds.service_client_URL+"/"+clientId, ServiceClientToAdd, {headers: headers})
      .toPromise()
      .then(()=>{
        console.log("okei");
        this.missingFields=false;
        this.addSuccess=true;
        }).catch(()=>this.addSuccess=false);*/
      await this.clientserviceservice.addClientService(clientId,this.ServiceClient).then((result)=>
      {
        console.log("Calling ClientServiceService ADD CLIENT SERVICE");
        if(result==true)
        {
          console.log("Result = true");
          this.addSuccess=true;
          this.missingFields=false;
        }
        else
        {
          console.log("Result = false");
          this.addSuccess=false;
        }
        this.router.navigate(['/client-detail/'+clientId]);
      });
    }
    else
    {
        this.missingFields=true;
    }
  }


  

}
