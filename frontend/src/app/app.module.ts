import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BaseModule } from './base/base.module';
import { ContentModule } from './content/content.module';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptorService } from './shared/auth-interceptor.service';
import { AuthGuard } from './shared/auth-guard.service';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BaseModule,
    ContentModule,
    SharedModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    AuthGuard
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
