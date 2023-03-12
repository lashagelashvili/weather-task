import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { WeatherData } from '../models/weather.model';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  constructor(private readonly http: HttpClient) {}

  getWeather(city: string): Observable<WeatherData> {
    return this.http.get<WeatherData>(environment.weatherApiUrl, {
      params: new HttpParams()
        .set('q', city)
        .set('units', 'metric')
        .set('appid', environment.weatherApiKey),
    });
  }
}
