import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RailwayService } from '../services/railway.service';
import { StateService } from '../services/state.service';
import { TranslationService } from '../services/translation.service';
import { Train, Seat } from '../models/models';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';

declare const Swal: any;

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent implements OnInit {
  train: Train | null = null;
  email = '';
  phone = '';
  firstName = '';
  lastName = '';
  personalId = '';
  termsChecked = false;
  baggage = { carryon: true, checked: false };
  readonly BASE_PRICE = 25;
  readonly CHECKED_BAG_PRICE = 15;
  selectedSeat: Seat | null = null;
  selectedClass: number | null = null;
  seats: Seat[] = [];
  showSeatModal = false;
  showClassModal = false;
  successScreen = false;
  ticketId = '';
  totalPrice = 0;

  constructor(
    public router: Router,
    private railwayService: RailwayService,
    private state: StateService,
    public tr: TranslationService
  ) {}

  ngOnInit() {
    const train = this.state.selectedTrain;
    if (!train) { this.router.navigate(['/']); return; }
    this.train = train;
    this.updateTotal();
  }

  t(key: string) { return this.tr.t(key); }

  get total(): number { return this.BASE_PRICE + (this.baggage.checked ? this.CHECKED_BAG_PRICE : 0); }
  updateTotal() { this.totalPrice = this.total; }

  toggleBag(type: 'carryon' | 'checked') {
    this.baggage[type] = !this.baggage[type];
    this.updateTotal();
  }

  openClassModal() { this.showClassModal = true; }
  closeClassModal() { this.showClassModal = false; }

  chooseClass(cls: number) {
    this.selectedClass = cls;
    this.showClassModal = false;
    this.loadSeats(cls);
  }

  loadSeats(vagonId: number) {
    this.railwayService.getVagon(vagonId).subscribe({
      next: (vagons) => { this.seats = vagons[0]?.seats || []; this.showSeatModal = true; },
      error: () => alert(this.t('bookingError'))
    });
  }

  selectSeat(seat: Seat) {
    if (seat.isOccupied) return;
    this.selectedSeat = seat;
  }

  closeSeatModal() { this.showSeatModal = false; }

  async register() {
    if (!this.selectedSeat) { alert(this.t('selectSeatError')); return; }
    if (!this.firstName || !this.lastName || this.personalId.length !== 11 || !this.termsChecked) {
      alert(this.t('fillAllError')); return;
    }
    const payload = {
      trainId: Number(this.train!.id),
      date: new Date().toISOString(),
      email: this.email,
      phoneNumber: this.phone,
      people: [{
        seatId: this.selectedSeat.seatId,
        name: this.firstName, surname: this.lastName,
        idNumber: this.personalId, status: 'registered', payoutCompleted: true
      }]
    };
    this.railwayService.registerBooking(payload).subscribe({
      next: (text) => {
        const match = text.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
        if (match) {
          const id = match[0];
          this.railwayService.confirmTicket(id).subscribe();
          this.ticketId = id;
          this.totalPrice = this.total;
          this.successScreen = true;
        } else {
          alert(this.t('bookingError'));
        }
      },
      error: (e) => alert(this.t('bookingError') + ': ' + e.message)
    });
  }
}
