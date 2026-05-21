import { Injectable } from '@angular/core';
import { SearchCriteria, Train } from '../models/models';

@Injectable({ providedIn: 'root' })
export class StateService {
  private _searchCriteria: SearchCriteria | null = null;
  private _selectedTrain: Train | null = null;

  get searchCriteria(): SearchCriteria | null { return this._searchCriteria; }
  set searchCriteria(value: SearchCriteria | null) { this._searchCriteria = value; }

  get selectedTrain(): Train | null { return this._selectedTrain; }
  set selectedTrain(value: Train | null) { this._selectedTrain = value; }
}
