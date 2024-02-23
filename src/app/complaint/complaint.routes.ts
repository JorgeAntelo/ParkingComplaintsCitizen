import { RouterModule, Routes } from '@angular/router';
import { AbanlistComponent } from './components/abanlist/abanlist.component';
import { AbanComponent } from './components/aban/aban.component';
import { NotifyOwnerLienComponent } from './components/notify-owner-lien/notify-owner-lien.component';
import { ComplaintComponent } from './components/complaint/complaint.component';
import { SearchComponent } from './components/search/search.component';
import { TokenabanComponent } from './components/tokenaban/tokenaban.component';
import { CitizenabanComponent } from './components/citizenaban/citizenaban.component';
const routes: Routes = [
    { path: 'list', component: AbanlistComponent },
    { path: 'list?UserId=', component: AbanlistComponent },
    { path: 'list?UserId=&Ia', component: AbanlistComponent },
    { path: 'list?UserId=&Ic=', component: AbanlistComponent },
    { path: 'list?UserId=&Ic=&Ia', component: AbanlistComponent },
    { path: '', component: CitizenabanComponent },
    { path: 'home', component: CitizenabanComponent },
    { path: 'home?Token=&Ic=', component: CitizenabanComponent },
    { path: 'viewcomplaint?Id=&UserId=&Ic=', component: AbanComponent },
    { path: 'details', component: AbanComponent },
    { path: 'details?Id=&UserId=&Ic=', component: AbanComponent },
    { path: 'details?Id=&UserId=&Ic=&Ia=', component: AbanComponent },
    { path: 'details?Id=&UserId=&Ic=&Token=&Ia=', component: AbanComponent },
    { path: 'notifyownerlien', component: NotifyOwnerLienComponent },
    { path: 'complaint', component: ComplaintComponent },
    { path: 'complaint?compno=', component: ComplaintComponent },
    { path: 'search', component: SearchComponent },
    { path: 'search?Ic=', component: SearchComponent },
    { path: 'tokenaban', component: TokenabanComponent },
    { path: 'tokenaban?Id=&UserId=&Ic=&Token=&Ia=', component: TokenabanComponent },
    { path: 'citizenaban', component: CitizenabanComponent },
    { path: 'citizenaban?Id=&UserId=&Ic=&Token=&Ia=', component: CitizenabanComponent },
   
];
export const ComplaintRoutes = RouterModule.forChild(routes);
