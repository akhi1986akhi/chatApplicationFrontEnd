import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserScreenComponent } from './user-screen/user-screen.component';
import { AdminScreenComponent } from './admin-screen/admin-screen.component';

const routes: Routes = [
  {
    path:'', component:UserScreenComponent
  },
  {
    path:'admin', component:AdminScreenComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
