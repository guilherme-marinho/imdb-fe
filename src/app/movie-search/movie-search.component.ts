import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  HostListener,
} from '@angular/core';
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
  favoriteStatus: boolean | null = null;

  @ViewChild('searchInput', { static: false }) searchInput!: ElementRef;

  constructor(
    private movieService: MovieService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {}

  async searchMovies() {
    if (this.searchQuery) {
      this.movieService
        .getMovieByTitle(this.searchQuery.replace(/ /g, '+'))
        .subscribe(
          async (data: any) => {
            this.selectedMovie = data.data || {};
            await this.loadFavoriteStatus(this.selectedMovie.imdbID);
            this.loadingService.off();
          },
          (error) => {
            console.error('Error fetching movie data:', error);
            this.loadingService.off();
          }
        );
    }
  }

  async loadFavoriteStatus(imdbID: string) {
    this.movieService.checkStar(imdbID).subscribe((response: any) => {
      this.selectedMovie.favorite = response.data === true;
    });
  }

  async toggleFavorite(imdbID: string) {
    this.loadingService.on();

    try {
      if (this.favoriteStatus === null) {
        await this.loadFavoriteStatus(imdbID);
      }
      this.favoriteStatus = !this.favoriteStatus;
      await this.movieService
        .toggleMovie(imdbID, this.favoriteStatus)
        .toPromise();
      this.selectedMovie.favorite = this.favoriteStatus;
      this.loadingService.off();
    } catch (error) {
      console.error('Error toggling favorite:', error);
      this.loadingService.off();
    }
  }

  isFavorite(imdbID: string): boolean {
    return (
      this.favoriteStatus === true && this.selectedMovie?.imdbID === imdbID
    );
  }

  resetSearch() {
    this.searchQuery = '';
    this.selectedMovie = {};
    this.favoriteStatus = null;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (
      event.key === 'Enter' &&
      event.target === this.searchInput.nativeElement
    ) {
      this.searchMovies();
    }
  }
}
