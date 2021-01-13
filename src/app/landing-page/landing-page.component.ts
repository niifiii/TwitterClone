import { Component, OnInit } from '@angular/core';
import { NewsService } from '../news.service';

interface INumber {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  articlesGetResponseHeaders = []
  articlesGetResponseBody = []

  selectedValue = ''

  numbers: INumber[] = [
    {value: 5, viewValue: '5'},
    {value: 10, viewValue: '10'},
    {value: 15, viewValue: '15'},
    {value: 20, viewValue: '20'},
    {value: 25, viewValue: '25'},
    {value: 30, viewValue: '30'},
  ];

  constructor(private _news: NewsService) { }

  ngOnInit(): void {
    this._news.getNews().subscribe(resp => {
      // display its headers
      const keys = resp.headers.keys();
      this.articlesGetResponseHeaders = keys.map(key =>
        `${key}: ${resp.headers.get(key)}`);

      // access the body directly, which is typed as `??`.
      this.articlesGetResponseBody = [ ...resp.body ];
    });
  }

  getArticles() {
    this._news.getNewsWithQueryString(this.selectedValue).subscribe(resp => {
      // display its headers
      const keys = resp.headers.keys();
      this.articlesGetResponseHeaders = keys.map(key =>
        `${key}: ${resp.headers.get(key)}`);

      // access the body directly, which is typed as `??`.
      this.articlesGetResponseBody = [ ...resp.body ];
      //this.toggleSpinner()
    });
  } 
}
