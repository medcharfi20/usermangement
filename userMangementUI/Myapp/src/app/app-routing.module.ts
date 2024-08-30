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
import { AuthAdminGuard } from './auth-admin.guard';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';
import { UpdateAdminProfileComponent } from './update-admin-profile/update-admin-profile.component';
import { LoginUserComponent } from './login-user/login-user.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UpdateUserProfileComponent } from './update-user-profile/update-user-profile.component';
import { AuthUserGuard } from './auth-user.guard';
import { ForgetComponent } from './forget/forget.component';
import { ForgetAdminComponent } from './forget-admin/forget-admin.component';
import { ForgetUserComponent } from './forget-user/forget-user.component';
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
  {path:'login',component:LoginComponent},
  {path:'loginadmin',component:LoginAdminComponent },
  { path:'profileadmin/:id', component: AdminProfileComponent,canActivate:[AuthAdminGuard] },
  {path:'updateprofileadmin/:id',component:UpdateAdminProfileComponent},
  {path:'loginuser',component:LoginUserComponent},
  { path:'profileuser/:id', component: UserProfileComponent,canActivate:[AuthUserGuard] },
  {path:'updateprofileuser/:id',component:UpdateUserProfileComponent},
  {path:'forget',component:ForgetComponent},
  {path:'forgetadmin',component:ForgetAdminComponent},
  {path:'forgetuser',component:ForgetUserComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
