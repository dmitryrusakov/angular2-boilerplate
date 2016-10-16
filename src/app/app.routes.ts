import {Routes} from '@angular/router';

import {AboutComponent} from './about/index';
import {IndexComponent} from './index/index';

export const routes: Routes = [
  {path: '', component: IndexComponent},
  {path: 'about', component: AboutComponent},
  {path: '**', component: IndexComponent}
];