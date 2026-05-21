export interface Station {
  id: string;
  name: string;
}

export interface SearchCriteria {
  from: string;
  to: string;
  date: string;
  passengers?: number;
}

export interface Train {
  id: number;
  number: string;
  name?: string;
  from: string;
  to: string;
  departure: string;
  arrive: string;
}

export interface Departure {
  trains: Train[];
}

export interface Seat {
  seatId: number;
  number: number;
  isOccupied: boolean;
}

export interface Vagon {
  seats: Seat[];
}

export interface Ticket {
  id: string;
  [key: string]: any;
}

export interface BookingPayload {
  trainId: number;
  date: string;
  email: string;
  phoneNumber: string;
  people: PassengerPayload[];
}

export interface PassengerPayload {
  seatId: number;
  name: string;
  surname: string;
  idNumber: string;
  status: string;
  payoutCompleted: boolean;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  password: string;
  address: string;
  phone: string;
  zipcode: string;
  avatar: string;
  gender: string;
}
