import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  load = false;
  settings = false;
  constructor(
    public router: Router
  ) { }

  ngOnInit() {
  }
  showSettings() {
    this.settings === false ? this.settings = true : this.settings = false;
  }
  logout() {
    this.load = false;
    localStorage.clear();
    setTimeout(() => {
      this.load = true;
      location.reload;
      this.router.navigate(['/login']);
    }, 1000);
  }

}
