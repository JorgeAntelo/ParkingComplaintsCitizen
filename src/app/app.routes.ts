import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AbanlistComponent } from './complaint/components/abanlist/abanlist.component';
import { AbanComponent } from './complaint/components/aban/aban.component';
import { NotifyOwnerLienComponent } from './complaint/components/notify-owner-lien/notify-owner-lien.component';
import { ComplaintComponent } from './complaint/components/complaint/complaint.component';
import { SearchComponent } from './complaint/components/search/search.component';
import { TokenabanComponent } from './complaint/components/tokenaban/tokenaban.component';
import { CitizenabanComponent } from './complaint/components/citizenaban/citizenaban.component';

export const routes: Routes = [
    { path: 'list', component: AbanlistComponent },
    { path: 'list?UserId=', component: AbanlistComponent },
    { path: 'list?UserId=&Ia', component: AbanlistComponent },
    { path: 'list?UserId=&Ic=', component: AbanlistComponent },
    { path: 'list?UserId=&Ic=&Ia', component: AbanlistComponent },
    { path: 'aban', component: AbanComponent },
    { path: 'aban?Id=&UserId=&Ic=', component: AbanComponent },
    { path: 'aban?Id=&UserId=&Ic=&Ia=', component: AbanComponent },
    { path: 'aban?Id=&UserId=&Ic=&Token=&Ia=', component: AbanComponent },
    { path: 'notifyownerlien', component: NotifyOwnerLienComponent },
    { path: 'complaint', component: ComplaintComponent },
    { path: 'complaint?compno=', component: ComplaintComponent },
    { path: 'search', component: SearchComponent },
    { path: 'search?Ic=', component: SearchComponent },
    { path: 'tokenaban', component: TokenabanComponent },
    { path: 'tokenaban?Id=&UserId=&Ic=&Token=&Ia=', component: TokenabanComponent },
    { path: '', component: CitizenabanComponent },
    { path: 'citizenaban', component: CitizenabanComponent },
    { path: 'citizenaban?Id=&UserId=&Ic=&Token=&Ia=', component: CitizenabanComponent },
    { path: 'home', component: CitizenabanComponent },
    { path: 'home?Token=&Ic=', component: CitizenabanComponent }
];

export const AppRoutes = RouterModule.forRoot(routes);
