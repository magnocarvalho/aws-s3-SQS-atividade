import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InputComponent } from './input/input.component';


const routes: Routes = [
  {
    path: '', component: InputComponent
  },
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '**', component: InputComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
