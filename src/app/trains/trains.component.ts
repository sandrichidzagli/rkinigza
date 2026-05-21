import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RailwayService } from '../services/railway.service';
import { StateService } from '../services/state.service';
import { TranslationService } from '../services/translation.service';
import { Train } from '../models/models';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
  selector: 'app-trains',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './trains.component.html',
  styleUrl: './trains.component.css'
})
export class TrainsComponent implements OnInit {
  trains: Train[] = [];
  loading = true;
  error = '';

  constructor(
    public router: Router,
    private railwayService: RailwayService,
    private state: StateService,
    public tr: TranslationService
  ) {}

  ngOnInit() {
    const criteria = this.state.searchCriteria;
    if (!criteria) { this.router.navigate(['/']); return; }
    this.railwayService.getDepartures(criteria.from, criteria.to, criteria.date).subscribe({
      next: (deps) => {
        this.trains = deps.flatMap(d => d.trains);
        this.loading = false;
      },
      error: () => {
        this.error = this.tr.t('trainsError');
        this.loading = false;
      }
    });
  }

  t(key: string) { return this.tr.t(key); }

  selectTrain(train: Train) {
    this.state.selectedTrain = train;  // in-memory only
    this.router.navigate(['/booking']);
  }
}
