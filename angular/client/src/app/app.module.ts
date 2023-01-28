import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

// components
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { ActionPanelComponent } from './components/action-panel/action-panel.component';
import { TodosComponent } from './components/todos/todos.component';
import { TodoComponent } from './components/todo/todo.component';
import { PageLoaderComponent } from './ui-common/page-loader/page-loader.component';
import { NotificationComponent } from './ui-common/notification/notification.component';
import { SimpleDialogComponent } from './ui-common/simple-dialog/simple-dialog.component';
import { TestComponent } from './components/test/test.component';

// dialogs
import { WrapperDialog } from './ui-common/wrapper/wrapper.dialog';
import { AddTodoDialog } from './components/dialogs/add-todo/add-todo.dialog';
import { EditTodoDialog } from './components/dialogs/edit-todo/edit-todo.dialog';
import { TodoHistoryDialog } from './components/dialogs/todo-history/todo-history.dialog';
import { BranchManagerDialog } from './components/dialogs/branch-manager/branch-manager.dialog';
import { PullDialog } from './components/dialogs/pull/pull.dialog';

// controllers
import { CommitController } from './controllers/commit.controller';
import { BranchController } from './controllers/branch.controller';

// services
import { CommitService } from './services/commit.service';
import { PageLoaderService } from './ui-common/page-loader.service';
import { NotificationService } from './ui-common/notification.service';
import { PushService } from './services/push.service';
import { TodoService } from './services/todo.service';
import { DialogService } from './ui-common/dialog.service';
import { BranchService } from './services/branch.service';
import { NotificationLogsComponent } from './components/notification-logs/notification-logs.component';

// pipes
import { TodoEventDetailsPipe } from './pipes/todo-event-details.pipe';
import { FormatDatePipe } from './pipes/format-date.pipe';
import { TodoStatePreviewComponent } from './components/todo-state-preview/todo-state-preview.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ActionPanelComponent,
    TodosComponent,
    TodoComponent,
    PageLoaderComponent,
    TestComponent,
    NotificationComponent,
    SimpleDialogComponent,
    NotificationLogsComponent,
    
    // dialogs
    TodoHistoryDialog,
    WrapperDialog,
    AddTodoDialog,
    EditTodoDialog,
    BranchManagerDialog,
    PullDialog,

    // pipes
    TodoEventDetailsPipe,
    FormatDatePipe,
    TodoStatePreviewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
      // controllers
      BranchController,
      CommitController,
      
      // ui services
      PageLoaderService,
      NotificationService,
      DialogService,
      
      // services logic
      CommitService,
      BranchService,
      PushService,
      TodoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
