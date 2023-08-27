import { Component, OnInit } from '@angular/core';
import { MovieService } from '../core/services/movie.service';
import { LoadingService } from '../core/services/loading.service';

@Component({
  selector: 'app-movie-search',
  templateUrl: './movie-search.component.html',
  styleUrls: ['./movie-search.component.scss'],
})
export class MovieSearchComponent implements OnInit {
  searchQuery: string = '';
  selectedMovie: any = {};

  constructor(
    private movieService: MovieService,
    private loadingService: LoadingService
  ) {}
  ngOnInit(): void {}

  searchMovies() {
    if (this.searchQuery) {
      console.log('Search Query:', this.searchQuery);
      this.loadingService.on();

      this.movieService
        .getMovieByTitle(this.searchQuery.replace(/ /g, '+'))
        .subscribe(
          (data: any) => {
            this.selectedMovie = data.data || {};
            console.log(this.selectedMovie);

            this.loadingService.off();
          },
          (error) => {
            console.error('Error fetching movie data:', error);
            this.loadingService.off();
          }
        );
    }
  }

  toggleFavorite(imdbID: string) {
    this.movieService.toggleMovie(imdbID, true).subscribe(() => {});
  }

  isFavorite(imdbID: string): boolean {
    return false;
  }

  resetSearch() {
    this.searchQuery = '';
    this.selectedMovie = {};
  }
}
