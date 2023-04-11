import { Component, OnInit } from '@angular/core';
import { Product } from '../classes/product';
import { Categorie } from '../classes/categorie';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { Http, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import 'rxjs/Rx';
import { DataServiceService } from "app/data-service.service";

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {
  public titleSup: string = 'Confirmation de la suppression';
  public messageSup: string = 'Voulez-vous vraiment supprimer ce produit?';

  public titleUp: string = 'Confirmation de la modification';
  public messageUp: string = 'Voulez-vous vraiment modifier ce produit?';

  nomToAdd: string;
  prixToAdd: number;
  qteToAdd: number;
  categorieToAdd: Categorie;

  //Messages de feedback
  missingFieldsAdd: boolean;
  missingFieldsUpdate: boolean;
  addSuccess: boolean;
  updateSuccess: boolean;
  deleteSuccess: boolean;

  Products: Product[];
  Categories: Categorie[];
  constructor(private http: Http, private ds: DataServiceService) { }

  async loadProducts()
  {
    await this.ds.GetListProducts().then(res=>{
      this.Products=res;
    });
  }
  async loadCategories()
  {
    await this.ds.GetListCategories().then(res=>{
      this.Categories=res;
    });
  }
  ngOnInit() {
    this.missingFieldsAdd=false;
    this.addSuccess=false;
    this.missingFieldsUpdate=false;
    this.deleteSuccess=true;
    this.loadCategories();
    this.loadProducts();
  }
  async delete(id)
  {
      this.http.delete(this.ds.products_URL+"/"+id)
      .subscribe((data)=>{
        this.deleteSuccess=true;
        this.ds.loadProducts();
        this.ds.GetListProducts().then(data=>{
          this.Products=data;
        });
      },(err)=>{
        this.deleteSuccess=false;
        console.log(err);
      });
  }

  // Updates existing product (called from html button)
  async save(id, nom, prix, qte)
  {
    if(id==undefined || nom==undefined || nom=='' || prix==undefined || qte==undefined)
    {
      this.missingFieldsUpdate=true;
      this.updateSuccess=false;
    }
    else
    {
      this.missingFieldsAdd=false;

      var productToUpdate=JSON.stringify(new Product(nom,prix,qte,id,0));
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

     this.http.post(this.ds.products_URL,productToUpdate, {headers: headers})
      .subscribe((data)=>{
        this.updateSuccess=true;
        this.ds.loadProducts();
        this.ds.GetListProducts().then(value=>{
          this.Products=value;
        });
        },(err)=>{
          this.updateSuccess=false;
          console.log(err);
        });
    }
  }

  //Adds new product (called from html button)
  addNew()
  {
    if(this.nomToAdd==undefined || this.nomToAdd=='' || this.prixToAdd==undefined || this.qteToAdd==undefined || this.categorieToAdd==undefined)
    {
      console.log("undefined stuff");
      this.missingFieldsAdd=true;
      this.addSuccess=false;
    }
    else
    {
      this.missingFieldsAdd=false;

      var productToAdd=JSON.stringify(new Product(this.nomToAdd,this.prixToAdd,this.qteToAdd,0,this.categorieToAdd.id));
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      this.http.put(this.ds.products_URL, productToAdd, {headers: headers})
      .subscribe((data)=>{
        //location.reload();
        this.addSuccess=true;
        this.ds.loadProducts();
        this.ds.GetListProducts().then(val=>{
          this.Products=val;
        });
        },(err)=>{
          this.addSuccess=false;
          console.log(err);
        });
    }
  }

}
