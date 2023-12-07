import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule }  from  '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ListboxModule } from 'primeng/listbox';
import { PasswordModule } from 'primeng/password';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PanelModule } from 'primeng/panel';
import { MenuModule } from 'primeng/menu';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { AccordionModule } from 'primeng/accordion';
import { FileUploadModule } from 'primeng/fileupload';
import { DividerModule } from 'primeng/divider';
import { ImageModule } from 'primeng/image';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { OrderListModule } from 'primeng/orderlist';

import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';

import { AppComponent } from './app.component';
import { CollectionFormComponent } from './collection-form/collection-form.component';
import { LoginComponent } from './login/login.component';
import { CollectionRoutingModule } from './app-routing/app-routing.module';
import { UserHomeComponent } from './user-home/user-home.component';
import { ChapterOverviewComponent } from './user-home/chapter-views/chapter-overview/chapter-overview.component';
import { TabDescriptionComponent } from './user-home/tab-views/tab-description/tab-description.component';
import { NewTabPanelComponent } from './user-home/tab-views/new-tab-panel/new-tab-panel.component';
import { NewChapterComponent } from './user-home/chapter-views/new-chapter/new-chapter.component';
import { NewCollectionComponent } from './user-home/collection-overview/new-collection/new-collection.component';
import { EditCollectionComponent } from './user-home/collection-overview/edit-collection/edit-collection.component';
import { TabOverviewComponent } from './user-home/tab-views/tab-overview/tab-overview.component';

import { MarkdownPipe } from './markdown.pipe';
import { EditChapterComponent } from './user-home/chapter-views/edit-chapter/edit-chapter.component';

@NgModule({
  declarations: [
    AppComponent,
    CollectionFormComponent,
    LoginComponent,
    UserHomeComponent,
    ChapterOverviewComponent,
    TabDescriptionComponent,
    NewTabPanelComponent,
    NewChapterComponent,
    NewCollectionComponent,
    EditCollectionComponent,
    TabOverviewComponent,
    MarkdownPipe,
    EditChapterComponent
  ],
  imports: [
    BrowserModule,
    CollectionRoutingModule,
    ConfirmPopupModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    ListboxModule,
    PasswordModule,
    MenuModule,
    CardModule,
    ToolbarModule,
    PanelModule,
    DialogModule,
    AccordionModule,
    TabViewModule,
    ToastModule,
    FileUploadModule,
    OverlayPanelModule,
    OrderListModule,
    DividerModule,
    ImageModule,
    DropdownModule
  ],
  providers: [
    DialogService,
    ConfirmationService,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
