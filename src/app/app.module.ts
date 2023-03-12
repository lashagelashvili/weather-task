import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WeatherComponent } from './components/weather/weather.component';

@NgModule({
  declarations: [AppComponent, WeatherComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, CommonModule],
  providers: [DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
