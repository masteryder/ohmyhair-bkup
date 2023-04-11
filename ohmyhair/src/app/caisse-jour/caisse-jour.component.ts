import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Client } from "../classes/client";
import { Product } from '../classes/product';
import { Categorie } from '../classes/categorie';
import { Service } from '../classes/service';
import { ServiceClient} from '../classes/service-client';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable} from 'rxjs/Rx';
import {Location} from '@angular/common';
import { DataServiceService } from "app/data-service.service";
declare var jsPDF: any;

@Component({
  selector: 'app-caisse-jour',
  templateUrl: './caisse-jour.component.html',
  styleUrls: ['./caisse-jour.component.css']
})
export class CaisseJourComponent implements OnInit {
  load: boolean;
  date: string;
    private sub: any;

    Clients: Client[];
    ClientNames: string[];

    Categories: Categorie[];
    Products: Product[];
    Services: Service[];
    ClientServices: ServiceClient[];
    
  
  constructor(private route: ActivatedRoute,private http: Http, private _location: Location,public ds:DataServiceService) { 
    
  }
  async generatePDF()
  {
      var doc=new jsPDF('p','pt');
      
      var columns=["Client","Total","Détails"];
      var rows: [
        [string, string, string]
      ]=[["","",""]];
      var index: number=0;
      var details="";
      for ( let element of this.ClientServices)
      {
        details="";
        if(element.services.length>0)
        { 
            var services: string="";
            details+="Services: ";
            element.services.forEach(element2=>{
                services+=this.getServiceName(element2.id)+". ";
            });
            details+=services;
            
            if(element.produits.length>0)details+="\r\n";
        }
        if(element.produits.length>0){
            var produits: string="";
            details+="Produits: ";
            element.produits.forEach(element2=>{
              if(element2.quantite>1){
                produits+=this.getProductName(element2.id)+"(x"+element2.quantite+") . ";
              }
              else
              {
                produits+=this.getProductName(element2.id)+". ";
              }
            });
            details+=produits;
        }

        const cName= await this.ds.getClientName(element.id_client);
        const total= await this.getTotal(index);

        rows[index]=[cName,total.toFixed(2)+" CHF",details];
        index++;
      }
      var imgData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIcAAACHCAYAAAA850oKAAAVEklEQVR4nO2dedQU1ZmHHxBxQUBlQEER+ICwCyrgOoZIIhFNMskMxj0zeIiJiRnHkEWjDmbcJtHMmMRljBpXVNziJGbUcY3iAon6AbJvRgSDCrIrguSPX127uvpWdVV3LV2des7p091V3VW3q9+6973vdqGgoKCgoKCgoKCgoKCgoKCgoKCg4G+VNu43w4cPz6odYegJ/BT4d2BBxm1pWlpbWz953TbDdkRlJPBVJBx55ATgWWDXrBsSljwJx6PAGuBk4AsZt6UWzgeOBnpl3ZCw5Ek4tgDXO6+vJl9tnwAcAbSSoyExTxcY4GbnuT9wSZYNiYgZCh/MtBURyZtwLAPudF5fCAzKsC1hOQ8Y4ry+N8uGRCVvwgFwo+v1TzJrRTi6Ueo1niJHQwrkUzieA/7gvD4BzWAalYuBTs7rO7JsSC3kUTigvPe4HNg5q4YEMBz4lvP6feA3GbalJvIqHFOBpc7rFmBKdk3x5VLX62lIQHJFXoVjB6WZC8AFwICM2mLjy2jIM0zNqiH1kFfhAPg18KHr/ZVZNcSCe5r9R2QZzR15Fo5VwO2u9/8AfCWjtrj5V2CY6/3dWTWkXvIsHAC/8ry/LJNWlOiCZiiGD8npkAL5F46ZwGOu9wOBH2XUFpBg7O16fx/wdkZtqZu8CweUT2tBM5c+GbRjGPAdz7bc2TbcNINwPAjMdb1vB/xHBu241PN+FvB4Bu2IjWYQDoCbPO9PBcaleP4vOg83uVVEDc0iHLcC6zzbLk/x/F4P8UeUHIS5pVmEYy0SEDcHA+ekcO5vAyM82x4AVqRw7kRpFuGAyqEF4MdA1wTPuTd20/3tlm25o5mEYw6Vzq09kYAkxUXItuFmNvB/CZ4zNZpJOAD+x7LtG8DoBM41CDjXsj3X01c3zSYcjwJ/smxPwu9imy5/SBMoooZmEw6w6x6fAc6I8RzHA/9o2X4f8vk0Bc0oHHcAf7Fs/zGwS0zn8DOyNc2QArIm1kMboAfQHSlmuzmPXYANwDYU5LIG/WGr6zxfGDYhd/4PPdt7Id9Hvb6XrwMHWba/SjoW0XbA/mgW1gUlSe2OouE2IBvLe+harwA+qOdEUegPfBpln40ADkTCEJYNyNQ9B2n1ryAdYXPEdlTjZiqFAxQUdDu1B/p2xD8lIgldY2/gUOAQYCgKPfwU0Xr8hegaz0RxJa+E/WKYXNnBwCQUyNvdsn8r8AbyPm5Af/QWFFjbHv3AfZG07+TTjpeRd/Ux4IWwja/CVJQd5+U+4MQaj/lTYLJl+2bk7Ku3Z2yHbr7PA+PRtbexCViOeuMtwEbUS3dCvfY+QG+gs+W7G5A/6kYs19qdKxskHF1R7OMY17bNqOt8HjmWFqGua5vPj3DTHglIH+RaH4EuRH/P5zYhC+M9SFg+DnFsG2OAp332fQH4XcTjDQTm+ey7BTgz4vEMbZAgnAF8iUq9aCa63q3O+ZcB76JQyWp0BfqhHv5w5zxuo+BcdKO8bjaEEY4W1P10Rn/OLc7jxRANikoX4O+Bz6LYyx6ufZtQd309ujhRmY7SEL3MQl10FO7BPw1iDNFDAQej6PSvAR1c25ei3u0JdGfHPeQOAU4HzkbDJMDnnPNVFY5uSCfoisaqkTE3rhqDgX8C/pnyuIwFwBVIWLaHPNbXqPS5GP4N+O+QxzmW8qAiNy8Dh4U8Diic8WLKldplaAo+DVgc4Vj1cj0yEoJ8Ua9WK8FwFaWupwXd1WkyF007W9DdfT3SuAegP3o9ip2wjade7kL6kI1L0NgcBm+shpswfpS26E5dDTyEBGMbmlUdhH7r5aQrGFCuQ/7Su9MrHIehLmcj8AiwF8oue51sgndnoYu6BxqTF6Bp24/QFPnnyH/ixzbKUxjcdCJcUNAkYJTPvnVUj9s4Dwn0teimW4m8xR2BicBrIdoQJ2bGtRXpOPOBt9Dwe5T7g17hONR5nonyLk5GJuHBSEnciO7kT1u+myTbkYFpIHAkpXTIc5C7/hokQDZuQRfCxiSC/S67E5wwdZdzfhsTkQBfjXSKhUin2g/dpTXbH2rks0iXWY+GtZ1R/u4gSkPvGPcXvH+wSQwy2us96KKfjaZOHdAY9QwSlHvRuH5ATD8gDC8g4RyCo0Sh2M112A1cbxFsg7giYN9FlCvIXmxDyjHoWt2Mhr7FyNw+gHRTIjuh3v52NH39f6TLgRT1o4Cxzvs3neeyxDCvcBiDlvtu2IZ6iz7IGHM1mr7uhqZBt6Jx/U00dz4DGWqSZi7SsochgWmLdIM16A51401hcHMMdr/Lp7Ab0gzPImXU0B39AU8ia+y7wEloqv77gOPERQfkQ5qCev51qLc/Hd3gK9Aw2oIEY7rruyZCfi/3Ab0W0o+cZ7/E5Fecx2R08Y5DBpuxyIYxyXngNO5ZYAbK+noFeCfEj4zKHDTUjEF3awsy8ryM/pzlwEvoTxtrPYLG4Lsp/X6onn97q+v1BZTnzFxI8jk0+yM1YBQSCtvwOBP1Vg/jsmVYMMbJslmgVziMRzFM3aqFzuMaJEyj0MzmKNTtd6Yy8HYFustbkbI5G//ZRFSeAfqiYe8adOGWobvlYvRn+QlHb+czFznvj8FuXTUsQcLRE43b/Zztv0XDrJ8eUivdkNFwBDItHI19pjUfhS08h67HmgjHB/lkPsFr55iI7r6oc3cvbZCiMwr9mCPQlK2N5bPrkYTPQtI9D81K3rN8Niy7o99xkvN+NopGvxn1djZ2oLtxJRLgwwOOfy4aRh9w3psh5Mk62gy6Pi3IjzIMCcOhTru8bHPaOR31jC9Se898Ger9LmltbZ1iNnp7DmMeHokucK3WuR1IJ5gL3OZs2xX94AOdxyHOoxO6o7139So0FBlhWYjM9WHiJTajO/9a4H7nvC8RXAahDfK4TidYMLahoGLTW/zK+V5UeiAFcBBSrs01sTkyP0ZT3pec5z+i4fQjy2drwViLyxyS3p6jM/pDWtAFeimmk/uxE7rIQyhdpEMIVmjXoV5mHhKWJcjkvBRp5TZ+SPCsxLAJXfAg24nhPTQLeTngM+3QTK4f+k0DkFng4IBzbEQ96Wuox5uNetQtIdpUK2+jYWpEq8tE6u051iEbgrGMJi0c25G0el3oHShdTPM8DF3Yzk7bbJbbFehCLkb6xp/Rb7gSKcdTkX7hR4eAfW7Opzz00HhB+yJBMAI/FDkcbWxz2voq6mHnOc/LCOdUi4uhqP1rkSB+gi2e4ynk1xiPXNRZsAldtFc929ujKXVfNEU0d+RQ1E3v7zxs2W5PoDG5d51tewF16VPQNepPcE+zCV30uegmmI+GyKX4G+fSxNxkT+LxgNuEw7i5x6ALuTyhRtXCVuw9DahH6eM8WpxHX9Tr9EYWwjg4As1K3HyMhrh56I9f7DyWIMU1zZ4gKsc6z094d9iEYwXKuzA2jBuSa1esrEPjtM1XsTsa+3shIRqHzNtR2OEcewmafpuh6w10A6VtDo+Dv0NeYrDMtPzCBO9HwnEa+RGOIDaj7ny+834aUgq9aYxBPIDKVDcTpm7Zi1g8wn7Os4eQ1n4kmj00IxXdaBVuSaQV2WLCJe+y7fQTjrWUssfOjrtFDcL6CJ+dRZOkOLoYQMkg+LDtA0FudzMGHRlnixqIKIVt0465SINvOs834VMRIEg4zHCSyzKJNbII+SX+FjBONt/pdJBwjHeeH4mtOY2F1/S8GBnZjkahks2OqXLoDW/4BD/h2Adp85BMxHkj0M3z/lFKKRbe8pBpB1mnwZ+QUbA7PpH4fsIx1HlOKgYja3anFBVlcK/dcrBn32Ci20XygAn48f5ewF84zOIxXvN1szARZeG5GYvsHxejeBAv3026URlg/l9rZp2fcJiY0KU++/PON3y2T0BRYTYHXDP2HnOc5wNtO/2Ew0SC/Tn25mTPiZR6xqgExZTmkZXOsy2YyFc4TInmd2NvTrbsS30lKPsDZ8XUlkbABBbvjyVKz084zAdrTWJuNPYAfoGiyPrWeazv4V8tIG+Y2q2dkJJeRjNW9nGzG0qtXINC++KgL3LLHxPT8bLEHUoQuucw0dNeW0Be2BUFzL6LIsrDmsq3Es713oLcCy9QvrZK3jBe+R1YktP9hGOR89ySRIsSpCNKbFqLIqorusoqPImMQouqfdDhcOSU+z31D1dZYKbzK7HEqPoJhzsKPQ/sB1xHKSVy1xqP8zSKUI9aFvs4ZH5/mHwJSW/neYltp59wmMDi4wkXiZ0Vo1GFnhXIy7jReURhJgoYHkgpZvYxVGHndOx1Tb28g6b9X0RC8ig+toMGwzhXrYVx/IRjAfKptCU48ysLdkHGqPkoLeB4Z/tVKGjFL9ve8BayhH4b9TijUSS5Ny51K0rAHonMy0EJS11RIRjjBh+HLviLxBe7mgTGuWqtwxZUE8xUxVmBusqsI6UPQYFHp1EK99+ChpPJKAl4FfZao+tQ3MId1FY+yjAaCWA/y74PkPFwNZo2f4vS9X0D2Vduo3xFyywZjW6urWjisQ7Kyz4FTWVvQ13q/mQXR9ob6RDLUZbXRCQYs1FmfEdK1f3OxC4YV6KhcTL1CQYoKbw/lio4SM953nltirNcgHSYXiiybiOqRDDU8v20Od95vpHKtWqA6nYOYw38F+C/YmpUNQYhM/UcFN19Kbq4m1B641A0nt9B+fTLFiw8jtJFiJNzsGfh90e1xkDtvQL1aBNQNFk7VIXA5LF8B0WAp81ESlHnvrlJYeqQnoiKtIAU1QnEu9BMFxRgMxY1eD/Xvu1oBnALiuEMsti2Uq4ETkQ1t5LElnA9g1KFJC9D0LqzZ1Deyz2NhP23JO+y+DIqUQHSu6517wxbh9TNMUgDN8akh9BQ8xzRcjj3RIGtQ5GS9xnK4yhAd9z/ovSIRwg3Ru+Lhh5zwV/EXmIybk7FXjVoJMGznJ1R1Z2z0DVwMwP9eU9UOUYtXAn8wHn9CypXs6xJOED29+uBU1zbTKLPbGRIWe/avhPqUrsivWUg/iWUZqKe4XH0x0b16XyO8rrj55HeMPi4c343piZIGLqg3vgkVNfEzUY0S5qOYi9mYy/6H0RP9J9NpjSEXYYKzFRQq3AYTAWfr+KpIRWSxeiOeAUpmTOIbpvwcjHlNclHI4FLg3GoV3VTa/3WzijLcByaotvcF+8hfWwJmp29i3rvzUhZ74CEoA8art312paiIc1d8qmMeoXDjak40xvFne6Beo02SF9Y4zzeRjmjy6hfEGw8Ral7Xuu0J0peSr08T2UKh7fuVi30d44zCukxw4nuEf4YmfevpVKIK3ALR71Laqwm+4V1e6I7xLCMdAUDZGvxCsfJ1C8ci5yHUazbI5tTb/S790G9xK7oxtyKdLa16GZ8HfXONdlW6hWORuAkyu+mOX4fTJCpaGrrLvJ/KhrXg6oJRWUr8nv5FeiPlbzHc7SlMjIrLV3Di3f5sD3Jecxp3oVjCpVe0DRqftr4NZX61IWEr6/ecORZOE6jVBrScC/ZRcy/Q+UqlHtRMjjljkbTOfZGthCjQ3yI7satlEzlvZEd4xTvl4GfJdy+alyGkqXcpvwjkC3oWNJZ4y42GkE4DkDe1uOQedk2VduKpmQ7++wHWSpnJNHAiEyiUu8ZjqbzV6PQgqiGrEyo185RDzuhuXccof7bUeG4RknCMsV+/XgZ+WXmI1f/vmg6ugFNQ/+CrKFx+rBCEaedo1YGoPLL3pTEWvkejSMYIEdhR/xXgjoUf+ecm8XIv3QdinhPlSwU0sPRHROXYDxCen6UKFyDfdXqKPRDXtwFKHotyjKtdZO2cAwk3mIwbyFjU6PyIJ7Vj+pgAoooSy2AOU3haI9c8dVySD5E2v39KExxZcBnJ+ATxdRATKf2dWy9dEVhEl1iOl4gaQrHTVSuIevmMbTeaxe0wsIEFIE2EntC97nkp7DMfWg9uiC2IUW0mrB3J9yig3WTlnCciML8bSxDdoHPozSDTZ79q1Ccg3v7M9hraDQy/4k9SPtxdDPsh5xpPdBNNBF/H8p4/K9nbKQhHLvgX2PrGZRVVy3wdznlU94k3P5J8z6V3uJnUOzGa8hA9hGKy1iMzPGD8V/tIfFyEGkIxw/QHeFlDpUhckHcRWkYsR2v0dlBeYTbDkpLngVxAZ44T4fBaOnPxEhaOLoB3/fZV8sCNnc4z13In19oC+VD4w2EX2T4+9itqvVOlQNJ+gJ/CXsJpbupTZk0NUL3RTGtecO9WNDvInxvM/Zl18eSoCEzaeHwCyi+tcbjLUddcztSNgjFhDsiy7YsSBC2iLseRCvuH4k0hhUva6l9CuouNpLHqkPLned1RM9PmUupTqqbxBxiSQuH7ccswH8ttmr0Rm3eQj5nLEZv6IwMWlF4H/tSoN3ralEASQuHLX6h1toZIHsAyIzstYfkAffCv30ifvcD7NdzP8u2WEhaOGzWvhHUXjHIaOdvBn6qcZnreu23AHIQNtdDxxrbUpWkhWO2z/ZarHvDKSX/Bi3X2ci8RikaPaqNohN2T3ZFLa+4SFo45mEvwDaF0hARlp+4Xt9fa4MyZj2lMg0DsYc6+jEB6SpeEku8TkPn8LvLnyP8EmHXUlrF8Hbqr7ORJe6VJX9GuBIMXZBvxkZiIYdpWBmn+WzvgLKxLgv4bj90p5mlxLbgkwCcI+6kpFjug3KGD/D/OKCoej83fdjKh5FJQzjuRMm/fpjqN3ei4eZCdEfNRD/cnWb4dfKrjBo2o0BjQ0+UFG1LgOqIbo4g5fX1gH11kVaA8WTqX936EuzVdPLKH6hccv0NFPuxCtUwOZngqf8cYi6Sm0WA8VVIZ/DWsQjLhQQPP3nkBJRK4S5j0YtSjbMwPBVrizyk6dkcT/Qp6AYU79BsggGauQzC7o4PS9S1cSORpnBsAw5DBeCqsRrFgexN9iUekmQHqsvVDS0QdBsKAFpEOPdAonktWSU17YmMQAch38BOKCNsKQrIzauRK07aIb3jTKSIt7d85mhiXuo0zso+BekxDRnC3FyHiuHGRtgitQWNxYkoSMrN2ag2WyIUwpEvTkFVF93cQ0KLJBfCkT/GUykg30VBVN+s/HjtFMKRT8ajQsFu9qS05kwsUemFcOSXr1AqO+6mE/AbYlBUC+HINyehVQ9s1J1gXghH/jkLu65Rt4OyEI7m4Abk9r8LWaIX4p9MVlBQUFBQUFBQUFBQUFBQUFBQUFBQUJW/AnTxYZVmjrd9AAAAAElFTkSuQmCC';
      doc.addImage(imgData, 'PNG',30,10,50,50);
      doc.text(100, 30, "Rapport de caisse pour le "+this.ds.prettyDate(this.date));
      doc.setFontSize(10);

      const revenue = await this.getRevenue();
      
      doc.text(100,50, "Total du jour: "+revenue.toFixed(2)+" CHF");
      doc.autoTable(columns, rows,{
              startY:70, 
              showHeader: 'firstPage',
              margin: {horizontal: 20}, 
              styles: {
                overflow: 'linebreak',
                columnWidth: 'wrap'
              },
              columnStyles: 
                {
                  2: {columnWidth: 'auto'}
                }
              });      
        doc.save("Rapport_caisse_"+this.date+".pdf");
  }
  backClicked() {
        this._location.back();
    }
   toggleLoad()
  {
    this.load=true;
  }
  async loadServices()
  {
    await this.ds.GetListServices().then(data=>{
      this.Services=data;
    });
  }
 async loadClients()
  {
    await this.ds.GetListClients().then(data=>{
      this.Clients=data;
    });
  }
  async loadProducts()
  {
    await this.ds.GetListProducts().then(data=>{
      this.Products=data;
    });

  }
  async loadCategories()
  {
    await this.ds.GetListCategories().then(data=>{
      this.Categories=data;
    });
  }
  async loadClientServices()
  {
    const res = await this.http.get(this.ds.date_services_URL+"/"+this.date).first().map((res)=>res.json()).toPromise();
    var servicesClientToAdd=new Array<ServiceClient>();
      for(var i=0;i<res.length;i++)
      {
        //var productsToAdd: Product[]=new Product[data[i].achat_client_produits.length]();
        var productsToAdd=new Array<Product>();
          for(var j=0;j<Object.keys(res[i].achat_client_produits).length;j++)
          { 
            productsToAdd[j]=new Product("undefined",0,res[i].achat_client_produits[j].quantite,
            res[i].achat_client_produits[j].id_produit,0,
            res[i].achat_client_produits[j].rabais,
            res[i].achat_client_produits[j].supplement,
            res[i].achat_client_produits[j].commentaire);
          }

        var servicesToAdd=new Array<Service>();
        //var servicesToAdd: Service[]=new Service[data[i].achat_clients_services.length]();
            for(var j=0;j<Object.keys(res[i].achat_clients_services).length;j++)
            {
              servicesToAdd[j]=new Service("undefined",0,0,
              res[i].achat_clients_services[j].id_service,0,false,
              res[i].achat_clients_services[j].rabais,
              res[i].achat_clients_services[j].supplement,
              res[i].achat_clients_services[j].commentaire);
            }
        servicesClientToAdd[i]=new ServiceClient(res[i].id, res[i].id_client,
        res[i].timestamp,
        res[i].rabais,
        res[i].supplement,
        res[i].paye_cash,
        res[i].commentaire,
        servicesToAdd,
        productsToAdd);
      }
      this.ClientServices=servicesClientToAdd;
      var index=0;
          this.ClientServices.forEach(element => {
             this.ds.getClientName(element.id_client).then(val=>
              {
                  this.ClientNames[index]=val;
                  console.log("client names index "+index+": "+this.ClientNames[index]);
                  index++;
                });
        });
  }
  getClientName(id: number): string{
      var toReturn: string;
      this.Clients.forEach(element=>{
        if(element.id==id)
        {
          toReturn=element.prenom+" "+element.nom;
        }
      });
      return toReturn;
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
    var index: number=0;
      this.ClientServices[id].produits.forEach(selement => {
        total+=this.getProductPrice(selement.id);
        total*=selement.quantite;
        total-=selement.rabais;
        total+=selement.supplement;
        index++;
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
  getRevenue():number
  {
    var revenu: number=0;
    var index: number=0;
    this.ClientServices.forEach(element=>{
      revenu+=this.getTotal(index);
      index++;
    });
    return revenu;
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
       
       if(params)
       {
        this.date = params['date'];
        if(!this.date || this.date=="")
        {
          this._location.back();
        }
        console.log(this.date);
        this.ClientNames=[];
        this.loadProducts();
        this.loadServices();
        this.loadClients();
        this.loadCategories();
        this.loadClientServices();
       }

       // In a real app: dispatch action to load the details here.
    });
  }

}
