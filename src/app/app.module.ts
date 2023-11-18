import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PanelModule } from 'primeng/panel';
import { MenuModule } from 'primeng/menu';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';
import { TabViewModule } from 'primeng/tabview';
import { AccordionModule } from 'primeng/accordion';
import { FileUploadModule } from 'primeng/fileupload';
import { DividerModule } from 'primeng/divider';
import { ImageModule } from 'primeng/image';

import { AppComponent } from './app.component';
import { ReactiveFormsModule }  from  '@angular/forms';
import { CollectionFormComponent } from './collection-form/collection-form.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { CollectionRoutingModule } from './app-routing/app-routing.module';
import { UserHomeComponent } from './user-home/user-home.component';
import { ChapterOverviewComponent } from './user-home/chapter-views/chapter-overview/chapter-overview.component';
import { TabDescriptionComponent } from './user-home/chapter-views/tab-description/tab-description.component';
import { NewTabPanelComponent } from './user-home/chapter-views/new-tab-panel/new-tab-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    CollectionFormComponent,
    LoginComponent,
    UserHomeComponent,
    ChapterOverviewComponent,
    TabDescriptionComponent,
    NewTabPanelComponent
  ],
  imports: [
    CollectionRoutingModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    PasswordModule,
    MenuModule,
    CardModule,
    ToolbarModule,
    PanelModule,
    DialogModule,
    AccordionModule,
    TabViewModule,
    FileUploadModule,
    OverlayPanelModule,
    DividerModule,
    ImageModule
  ],
  providers: [DialogService],
  bootstrap: [AppComponent]
})
export class AppModule { }
