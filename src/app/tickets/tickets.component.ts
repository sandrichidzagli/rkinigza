import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RailwayService } from '../services/railway.service';
import { TranslationService } from '../services/translation.service';
import { Ticket } from '../models/models';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.css'
})
export class TicketsComponent implements OnInit {
  ticketId = '';
  resultType = '';
  resultMessage = '';
  cancelEnabled = false;
  ticketsCache: Ticket[] = [];

  constructor(
    public router: Router,
    private railwayService: RailwayService,
    public tr: TranslationService
  ) {}

  t(key: string) { return this.tr.t(key); }

  ngOnInit() {
    this.railwayService.getTickets().subscribe({
      next: (tickets) => this.ticketsCache = tickets,
      error: (e) => console.error('Failed to load tickets', e)
    });
  }

  checkTicket() {
    const id = this.ticketId.trim();
    if (!id) return;
    this.resultType = 'result-loading';
    this.resultMessage = this.t('ticketLoading');
    const ticket = this.ticketsCache.find(t => t['id'] === id);
    if (ticket) {
      this.resultType = 'result-success';
      this.resultMessage = `${id} — ${this.t('ticketFound')}`;
      this.cancelEnabled = true;
    } else {
      this.resultType = 'result-error';
      this.resultMessage = this.t('ticketNotFound');
      this.cancelEnabled = false;
    }
  }

  cancelTicket() {
    const id = this.ticketId.trim();
    if (!id) return;
    this.resultType = 'result-loading';
    this.resultMessage = this.t('ticketLoading');
    this.cancelEnabled = false;
    this.railwayService.cancelTicket(id).subscribe({
      next: (data) => {
        this.resultType = 'result-success';
        this.resultMessage = `${this.t('ticketCanceled')} | ${data}`;
      },
      error: () => {
        this.resultType = 'result-error';
        this.resultMessage = this.t('ticketNotFound');
        this.cancelEnabled = true;
      }
    });
  }
}
