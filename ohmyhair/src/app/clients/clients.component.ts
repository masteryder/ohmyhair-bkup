import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Client } from '../classes/client';
import {Observable} from 'rxjs/Rx';
import { DataServiceService } from "app/data-service.service";

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
  public titleSup: string = 'Confirmation de la suppression';
  public messageSup: string = 'Voulez-vous vraiment supprimer ce client?';


  public titleUp: string = 'Confirmation de la modification';
  public messageUp: string = 'Voulez-vous vraiment modifier ce client?';


  prenomToAdd: string;
  nomToAdd: string;
  telephoneToAdd: string;
  emailToAdd: string;
  rueToAdd: string;
  npaToAdd: string;
  villeToAdd: string;
  dateToAdd: string;
  addSuccess: boolean;
  missingFields: boolean;
  Clients: Client[];
  CleintTerm: any;

  constructor(private http: Http,private ds: DataServiceService) { }

async loadClients()
  {
    await this.ds.GetListClients().then(data=>{
      this.Clients=data;
    });
  }

  calculateAge(birthDate:string): number
  {
    var date=new Date(birthDate);
    var timeDiff = Math.abs(Date.now() - date.valueOf());
    return Math.floor((timeDiff / (1000 * 3600 * 24))/365);
  }
  addClient()
  {
    if(this.nomToAdd==undefined || this.prenomToAdd==undefined)
    {
      this.missingFields=true;
      this.addSuccess=false;
    }
    else
    {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
          var clientToAdd=JSON.stringify(new Client(this.nomToAdd,this.prenomToAdd,this.dateToAdd,0,this.telephoneToAdd,this.emailToAdd,this.rueToAdd,this.villeToAdd,this.npaToAdd));
      this.http.put(this.ds.clients_URL,clientToAdd,{headers: headers})
      .toPromise()
      .then(()=>{
        this.loadClients();
        this.missingFields=false;
        this.addSuccess=true;
      }).catch(()=>this.addSuccess=false);
    }
    
  }

  async saveClient(id, nom, prenom, rue, npa, ville, email, telephone, date_naissance)
  {

      var clientToUpdate=JSON.stringify(new Client(nom, prenom,date_naissance,id, telephone,email,rue,ville,npa));
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

     this.http.post(this.ds.clients_URL,clientToUpdate, {headers: headers})
      .subscribe((data)=>{
        this.ds.loadClients();
        this.ds.GetListClients().then(value=>{
          this.Clients=value;
        });
        },(err)=>{
          console.log(err);
        });
  }
  async deleteClient(id)
  {
      this.http.delete(this.ds.clients_URL+"/"+id)
      .subscribe((data)=>{
        this.ds.loadClients();
        this.ds.GetListClients().then(data=>{
          this.Clients=data;
        });
      },(err)=>{
        //this.deleteSuccess=false;
        console.log(err);
      });
  }

  async ngOnInit() {
    await this.loadClients();
  }
  getTotalClients():number{
    return this.Clients.length;
  }

}
