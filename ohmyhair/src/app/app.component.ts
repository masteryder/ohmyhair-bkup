import { Component, HostBinding, Host } from '@angular/core';
import {DataServiceService} from './data-service.service';
import { ClientService } from './client.service';
import { ClientserviceService } from './clientservice.service';
import { ProductService } from './product.service';
import { ServiceService } from './service.service';
import { StockService } from './stock.service';

declare var jsPDF: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(/*private ds: DataServiceService,*/
  private clientservice:ClientService,private clientserviceservice:ClientserviceService,
  private productservice:ProductService, private serviceservice:ServiceService,
  private stockservice:StockService){}
  title = 'Oh My Hair! Management';
}
