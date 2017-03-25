import {Component} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'index',
  templateUrl: 'index.component.html'
})

export class IndexComponent {

  constructor(
    private _router: Router
  ) {}

  goAbout() {
    this._router.navigate(['about']);
  }
}
