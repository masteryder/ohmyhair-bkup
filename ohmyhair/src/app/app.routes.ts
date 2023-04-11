import { RouterModule, Routes } from '@angular/router'
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './login/login.component';
import { RapportComponent } from './rapport/rapport.component';
import { StockComponent } from './stock/stock.component';
import { CaisseComponent } from './caisse/caisse.component';
import { ClientsComponent } from './clients/clients.component';
import {ClientDetailComponent} from './client-detail/client-detail.component';
import {CaisseJourComponent} from './caisse-jour/caisse-jour.component';
import {CaisseMoisComponent} from './caisse-mois/caisse-mois.component';
import { ServicesComponent } from './services/services.component';
const routes: Routes=([
    {path: 'home',        component: HomepageComponent },
     {path: 'login',        component: LoginComponent },
     {path: 'caisse', component:CaisseComponent},
     {path: 'stock', component:StockComponent},
     {path: 'rapport', component:RapportComponent},
     {path: 'clients', component:ClientsComponent},
     {path: 'client-detail/:id', component:ClientDetailComponent},
     {path: 'caisse-mois/:monthnb', component:CaisseMoisComponent},
     {path: 'caisse-jour/:date', component:CaisseJourComponent},
     {path: 'services', component:ServicesComponent},
  {path: '',
    redirectTo: '/caisse',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/notfound',
    pathMatch: 'full'
  }
])
export const routing = RouterModule.forRoot(routes);