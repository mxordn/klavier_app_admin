import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollectionFormComponent } from '../collection-form/collection-form.component';
import { authGuard } from '../auth/auth.guard';
import { UserHomeComponent } from '../user-home/user-home.component';
import { StartComponent } from '../start/start.component';
import { RegisterComponent } from '../register/register.component';
import { ImpressumComponent } from '../impressum/impressum.component';
//import { StartComponent } from '../start/start.component';

const routes: Routes = [
  { path: '', component: StartComponent },
  { path: 'register_user', component: RegisterComponent },
  { path: 'impressum', component: ImpressumComponent },
  { path: 'user_collections', component: UserHomeComponent, canActivate: [authGuard] },
  { path: 'create_collection', component: CollectionFormComponent, canActivate: [authGuard] },
  { path: 'user_home', component: UserHomeComponent, canActivate: [authGuard] }
];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class CollectionRoutingModule { }
