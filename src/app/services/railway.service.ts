import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Station, Departure, Vagon, Ticket, BookingPayload, AuthTokens, RegisterPayload } from '../models/models';

@Injectable({ providedIn: 'root' })
export class RailwayService {
  private readonly BASE = 'https://railway.stepprojects.ge/api';
  private readonly AUTH_BASE = 'https://api.everrest.educata.dev/auth';

  constructor(private http: HttpClient) {}

  getStations(): Observable<Station[]> {
    return this.http.get<Station[]>(`${this.BASE}/stations`);
  }

  getDepartures(from: string, to: string, date: string): Observable<Departure[]> {
    return this.http.get<Departure[]>(
      `${this.BASE}/getdeparture?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${encodeURIComponent(date)}`
    );
  }

  getVagon(vagonId: number): Observable<Vagon[]> {
    return this.http.get<Vagon[]>(`${this.BASE}/getvagon/${vagonId}`);
  }

  getTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.BASE}/tickets`);
  }

  cancelTicket(ticketId: string): Observable<string> {
    return this.http.delete(`${this.BASE}/tickets/cancel/${ticketId}`, {
      responseType: 'text',
      headers: { accept: 'text/plain' }
    });
  }

  registerBooking(payload: BookingPayload): Observable<string> {
    return this.http.post(`${this.BASE}/tickets/register`, payload, { responseType: 'text' });
  }

  confirmTicket(ticketId: string): Observable<any> {
    return this.http.get(`${this.BASE}/tickets/confirm/${ticketId}`);
  }

  login(email: string, password: string): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(`${this.AUTH_BASE}/sign_in`, { email, password });
  }

  register(payload: RegisterPayload): Observable<any> {
    return this.http.post(`${this.AUTH_BASE}/sign_up`, payload);
  }

  sendVerificationEmail(email: string): Observable<any> {
    return this.http.post(`${this.AUTH_BASE}/verify_email`, { email });
  }}
