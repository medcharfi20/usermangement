// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RoleComponent } from './role/role.component';
import { UpdateRoleComponent } from './update-role/update-role.component';
import { RoleListComponent } from './role-list/role-list.component';
import { SuperAdminComponent } from './super-admin/super-admin.component';
import { SuperAdminProfileComponent } from './super-admin-profile/super-admin-profile.component';
import { UpdateSuperAdminComponent } from './update-super-admin/update-super-admin.component';
import { AdminComponent } from './admin/admin.component';
import { AdminListComponent } from './admin-list/admin-list.component';
import { UpdateAdminComponent } from './update-admin/update-admin.component';
import { AddAdminComponent } from './add-admin/add-admin.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { UserComponent } from './user/user.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'role', component: RoleComponent },
  { path: 'role-list', component: RoleListComponent },
  { path: 'updateRole/:id', component: UpdateRoleComponent },
  { path: 'superAdmin', component: SuperAdminComponent ,canActivate: [AuthGuard]},
  { path: 'superAdminProfile/:id', component: SuperAdminProfileComponent},
  { path: 'updateSuperAdmin/:id', component: UpdateSuperAdminComponent },
  {path:'admin',component:AdminComponent},
  { path: 'admin-list', component: AdminListComponent },
  { path: 'updateadmin/:id', component: UpdateAdminComponent },
  {path:'add-admin',component:AddAdminComponent},
  {path:'adminpage',component:AdminPageComponent},
  {path:'users',component:UserComponent},
  {path:'updateuser/:id',component:UpdateUserComponent},
  {path:'login',component:LoginComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
