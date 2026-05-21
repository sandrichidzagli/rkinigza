import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { RailwayService } from '../services/railway.service';
import { StateService } from '../services/state.service';
import { TranslationService } from '../services/translation.service';
import { Station, SearchCriteria } from '../models/models';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  stations: Station[] = [];
  from = '';
  to = '';
  departureDate = '';
  passengers = 1;
  today = new Date().toISOString().split('T')[0];
  private sub: Subscription = new Subscription();

  constructor(
    public router: Router,
    private railwayService: RailwayService,
    private state: StateService,
    public tr: TranslationService
  ) {}

  ngOnInit() {
    this.railwayService.getStations().subscribe({
      next: (s) => this.stations = s,
      error: (e) => console.error('Failed to load stations', e)
    });
  }

  ngOnDestroy() { this.sub.unsubscribe(); }

  t(key: string) { return this.tr.t(key); }

  onSearch() {
    if (!this.from || !this.to || !this.departureDate) return;
    const d = new Date(this.departureDate);
    const formatted =
      d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
    const criteria: SearchCriteria = {
      from: this.from, to: this.to, date: formatted, passengers: this.passengers
    };
    this.state.searchCriteria = criteria;
    this.router.navigate(['/trains']);
  }
}