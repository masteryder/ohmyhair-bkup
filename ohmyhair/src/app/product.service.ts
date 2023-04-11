import { Injectable } from '@angular/core';
import { Product } from './classes/product';
import { Categorie } from './classes/categorie';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class ProductService {

  constructor(private http: Http) { }
  public readonly products_URL="http://localhost:3000/products";
  public readonly categories_URL="http://localhost:3000/categories";
  public Products: Product[];
  public Categories: Categorie[];
  private productsLoaded: boolean = false;


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
          }).catch((e)=>{
            this.productsLoaded=false;
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
  public async loadProducts(): Promise<Product[]>
    {
      const res= await this.http.get(this.products_URL).first().map((res)=>res.json()).toPromise();
      this.productsLoaded=true;
      this.Products=res;
      return res;
    }
    public async loadCategories(): Promise<Categorie[]>
    {
      const res= await this.http.get(this.categories_URL).first().map((res)=>res.json()).toPromise();
      //this.categoriesLoaded=true;
      this.Categories=res;
      return res;
    }
}
