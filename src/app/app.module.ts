import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {APP_BASE_HREF, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {RouterModule} from '@angular/router';
import {HttpModule, Http} from '@angular/http';
import {AppComponent }  from './app.component';
import {AboutComponent }  from './about/index';
import {IndexComponent }  from './index/index';

import {routes} from './app.routes';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(routes)
  ],
  declarations: [
    AppComponent,
    AboutComponent,
    IndexComponent
  ],
  providers: [{
    provide: APP_BASE_HREF,
    useValue: '/'
  }, {
    provide: LocationStrategy,
    useClass: PathLocationStrategy
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
