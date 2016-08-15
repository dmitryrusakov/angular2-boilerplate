import { provideRouter, RouterConfig, Routes } from '@angular/router';

import { AboutComponent } from './about/index';
import { IndexComponent } from './index/index';

// const routes: RouterConfig = [
//   {path: '', component: IndexComponent},
//   {path: '/about', component: AboutComponent}
// ];

// export const APP_ROUTER_PROVIDERS = [
//   provideRouter(routes),
// ];
export const routes: Routes = [
  {path: '', component: IndexComponent},
  {path: 'about', component: AboutComponent}
];