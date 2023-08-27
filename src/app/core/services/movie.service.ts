import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { api_url } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private readonly baseUrl: string;
  constructor(private http: HttpClient, private router: Router) {
    this.baseUrl = api_url.base_url;
  }

  getMovieById(id: string) {
    const url = `${this.baseUrl}/movie/id/${id}`;
    return this.http.get(url);
  }

  getMovieByTitle(title: string) {
    const url = `${this.baseUrl}/movie/title/${title}`;
    return this.http.get(url);
  }

  toggleMovie(imdbID: string, starredValue: boolean) {
    const url = `${this.baseUrl}/movie/toggle/${imdbID}`;
    const body = { starred: starredValue };
    return this.http.post(url, body);
  }
}