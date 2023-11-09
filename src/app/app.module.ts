import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PanelModule } from 'primeng/panel';
import { ListboxModule } from 'primeng/listbox';
import { MenuModule } from 'primeng/menu';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';

import { AppComponent } from './app.component';
import  { ReactiveFormsModule  }  from  '@angular/forms';
import { CollectionFormComponent } from './collection-form/collection-form.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { CollectionRoutingModule } from './app-routing/app-routing.module';
import { UserHomeComponent } from './user-home/user-home.component';
import { ChapterOverviewComponent } from './user-home/chapter-views/chapter-overview/chapter-overview.component';
import { ChapterDetailsComponent } from './user-home/chapter-views/chapter-details/chapter-details.component';

@NgModule({
  declarations: [
    AppComponent,
    CollectionFormComponent,
    LoginComponent,
    UserHomeComponent,
    ChapterOverviewComponent,
    ChapterDetailsComponent
  ],
  imports: [
    CollectionRoutingModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ButtonModule,
    ToggleButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    PasswordModule,
    ListboxModule,
    MenuModule,
    CardModule,
    ToolbarModule,
    PanelModule,
    ListboxModule,
    DialogModule,
    OverlayPanelModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
