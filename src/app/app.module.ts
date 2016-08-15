import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

import { routes } from './app.routes';
import { AppComponent }  from './app.component';

@NgModule({
  imports: [BrowserModule, HttpModule, RouterModule.forRoot(routes)],
  declarations: [AppComponent],
  providers: [{
    provide: APP_BASE_HREF,
    useValue: '/'
  }, {
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
