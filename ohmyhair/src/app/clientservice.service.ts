import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { ServiceClient } from "app/classes/service-client";


@Injectable()
export class ClientserviceService {

  constructor(private http: Http) { }
  public readonly clients_services_URL="http://localhost:3000/client-services";
  public readonly month_services_URL="http://localhost:3000/month-services";
  public readonly date_services_URL="http://localhost:3000/date-services";

  public async loadClientServices(clientId:any):Promise<ServiceClient>
  {
    const res = await this.http.get(this.clients_services_URL+"/"+clientId).map((res)=>res.json()).toPromise();
    return res;
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

   public async addClientService(clientId:any,serviceClientToAdd:ServiceClient):Promise<boolean>
   {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    var serviceClientToAddJSON = JSON.stringify(serviceClientToAdd);
    console.log("JSON TO ADD :"+JSON.stringify(serviceClientToAdd));
    
    const res=await this.http.put(this.clients_services_URL+"/"+clientId,serviceClientToAddJSON,{headers:headers})
    .toPromise().then(()=>{
      return true;
    }).catch(()=>{
      return false;
    });
    return false;
   }

   public async deleteClientService(clientServiceId: number){
     const res = await this.http.delete(this.clients_services_URL+"/"+clientServiceId);
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
}

