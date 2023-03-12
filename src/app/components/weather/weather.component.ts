import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { WeatherData } from 'src/app/models/weather.model';
import { WeatherService } from 'src/app/services/weather.service';
import {
  CurrentDate,
  CurrenWeathertData,
} from '../../models/currentData.model';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
})
export class WeatherComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('input') input!: ElementRef;
  loading = false;

  currentDate: CurrentDate = {
    date: '',
    weekDay: '',
    month: '',
    year: '',
  };

  currentData: CurrenWeathertData = {
    icon: '',
    temperature: 0,
    weather: '',
    city: '',
    country: '',
  };

  inputSubscription!: Subscription;

  constructor(
    private readonly weatherService: WeatherService,
    private readonly datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    const [date, weekDay, month, year] = this.datePipe
      .transform(new Date(), 'dd EEEE MMMM yyyy')!
      .split(' ');

    this.currentDate = {
      date: date,
      weekDay: weekDay,
      month: month,
      year: year,
    };
  }

  ngAfterViewInit() {
    this.inputSubscription = fromEvent<KeyboardEvent>(
      this.input.nativeElement,
      'keyup'
    )
      .pipe(
        map((event) => {
          const target = event.target as HTMLInputElement;
          return target.value;
        }),
        tap(() => (this.loading = false)),
        filter((input) => input.length >= 3),
        tap(() => (this.loading = true)),
        debounceTime(700),
        distinctUntilChanged(),
        switchMap((input) => this.weatherService.getWeather(input)),
        catchError((_, originalObservable) => {
          return originalObservable; // if error continue listening
        })
      )
      .subscribe((weather: WeatherData) => {
        this.currentData = {
          icon: `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`,
          temperature: weather.main.temp,
          weather: weather.weather[0].description,
          city: weather.name,
          country: weather.sys.country,
        };

        this.loading = false;
      });
  }

  ngOnDestroy(): void {
    this.inputSubscription.unsubscribe();
  }
}
