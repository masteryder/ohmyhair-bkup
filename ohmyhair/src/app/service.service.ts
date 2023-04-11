import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Service } from './classes/service';

@Injectable()
export class ServiceService {

  constructor(private http: Http) { }
  public readonly services_URL="http://localhost:3000/services";
  public Services: Service[];
  private servicesLoaded: boolean = false;

  public async loadServices(): Promise<Service[]>
  {
    
    const res= await this.http.get(this.services_URL).first().map((res)=>res.json()).toPromise();
    this.servicesLoaded=true;
    this.Services=res;
    return res;
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

  /**
   * Receives an id, returns the id's name for the service
   * @param id id of the service
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

}
