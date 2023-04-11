import { Component, OnInit } from '@angular/core';
import { Service } from '../classes/service';
import { ServiceService } from '../service.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  Services: Service[];
  ServiceTerm: any;

  constructor(private serviceservice: ServiceService) { }
  async loadServices()
  {
    await this.serviceservice.loadServices().then(data=>{
      this.Services=data;
      console.log("LOAD SERIVCES, DATA: "+JSON.stringify(this.Services));
    });
  }
  ngOnInit() {
    this.loadServices();
  }

}
