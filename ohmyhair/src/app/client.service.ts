import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Client } from "./classes/client";

@Injectable()
export class ClientService {

  constructor(private http: Http) { }
  public readonly clients_URL="http://localhost:3000/clients";
  private clientsLoaded: boolean = false;
  public Clients: Client[];

  public async loadClients(): Promise<Client[]>
    {
      const res= await this.http.get(this.clients_URL).first().map((res)=>res.json()).toPromise();
      this.clientsLoaded=true;
      this.Clients=res;
      return res;
    }

    public async GetListClients(): Promise<Client[]>
    {
      if(!this.clientsLoaded)
      {
        console.log("ClientService.GetListClients(): Clients NOT previously loaded, waiting for DataService.loadClients()");
        if(this.Clients!=null)console.log("-----------this.Clients!=null");
        else console.log("------------this.Clients==null");
        await this.loadClients();
        console.log("ClientService.GetListClients(): Finished calling loadClients()");
        if(this.Clients!=null)console.log("-----------this.Clients!=null");
        else console.log("------------this.Clients==null");
        this.clientsLoaded=true;
      }
      else
      {
        console.log("ClientService.GetListClients(): Clients previously loaded");
      }
      console.log("ClientService: GetListClients(): returning: "+this.Clients);
      return this.Clients;
    }

  /**
   * Receives an id, returns the id's name for the client
   * @param id id of the client
   */
  public async getClientName(id: number): Promise<string>{
    console.log("clientservice.getClientName() with param: "+id);
    if(!this.clientsLoaded)
        {
          console.log("clientservice.getClientName(): Clients not loaded, waiting for this.loadClients");
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
    console.log("clientservice.getClientName() returning : "+toReturn);

    return toReturn;
  }


}
