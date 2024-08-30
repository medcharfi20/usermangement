import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SuperAdminComponent } from './super-admin/super-admin.component';
import { RoleComponent } from './role/role.component';
import { UpdateRoleComponent } from './update-role/update-role.component';
import { RoleListComponent } from './role-list/role-list.component';
import { AddRoleComponent } from './add-role/add-role.component';

// Import Angular Material modules
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SuperAdminProfileComponent } from './super-admin-profile/super-admin-profile.component';
import { UpdateSuperAdminComponent } from './update-super-admin/update-super-admin.component';
import { AdminComponent } from './admin/admin.component';
import { AddAdminComponent } from './add-admin/add-admin.component';
import { AdminListComponent } from './admin-list/admin-list.component';
import { UpdateAdminComponent } from './update-admin/update-admin.component';
import { UserComponent } from './user/user.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { UserListComponent } from './user-list/user-list.component';
import { AddUserComponent } from './add-user/add-user.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { LoginComponent } from './login/login.component';
import { ToastrModule } from 'ngx-toastr';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';
import { UpdateAdminProfileComponent } from './update-admin-profile/update-admin-profile.component';
import { LoginUserComponent } from './login-user/login-user.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UpdateUserProfileComponent } from './update-user-profile/update-user-profile.component';
import { ForgetComponent } from './forget/forget.component';
import { ForgetAdminComponent } from './forget-admin/forget-admin.component';
import { ForgetUserComponent } from './forget-user/forget-user.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SuperAdminComponent,
    RoleComponent,
    UpdateRoleComponent,
    RoleListComponent,
    AddRoleComponent,
    SuperAdminProfileComponent,
    UpdateSuperAdminComponent,
    AdminComponent,
    AddAdminComponent,
    UpdateAdminComponent,
    AdminListComponent,
    UserComponent,
    AdminPageComponent,
    UserListComponent,
    AddUserComponent,
    UpdateUserComponent,
    LoginComponent,
    LoginAdminComponent,
    AdminProfileComponent,
    UpdateAdminProfileComponent,
    LoginUserComponent,
    UserProfileComponent,
    UpdateUserProfileComponent,
    ForgetComponent,
    ForgetAdminComponent,
    ForgetUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule, 
    ToastrModule,
    HttpClientModule,
    BrowserAnimationsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatAutocompleteModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
