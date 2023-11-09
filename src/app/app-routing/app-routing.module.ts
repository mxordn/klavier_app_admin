import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollectionFormComponent } from '../collection-form/collection-form.component';
import { authGuard } from '../auth.guard';
import { UserHomeComponent } from '../user-home/user-home.component';

const routes: Routes = [
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
