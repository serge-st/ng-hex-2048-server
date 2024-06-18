import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { HexCoord, HexData } from '@app/shared/interfaces';
import { HexManagementState } from './interfaces/hex-management-state';
import { sortHexDataArray } from '@app/shared/helpers';

const initialState: HexManagementState = {
  hexData: [],
  backgroundHexCoords: [],
};

@Injectable({
  providedIn: 'root',
})
export class HexManagementService {
  // TODO: change to env variables
  private baseURL = 'http://localhost:3000';
  private serviceURL = `${this.baseURL}/hex-grid-management`;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  private readonly state = new BehaviorSubject<HexManagementState>(initialState);

  readonly state$: Observable<HexManagementState> = this.state.asObservable();

  constructor(private readonly http: HttpClient) {}

  private getState(): HexManagementState {
    return this.state.value;
  }

  // TODO: remove whereFrom after testing
  private setState(newState: Partial<HexManagementState>, whereFrom?: string): void {
    this.state.next({ ...this.getState(), ...newState });
    // TODO remove afer testing
    console.log(`New state: ${whereFrom}`, this.getState());
  }

  setBackgroundHexCoords(hexCoords: HexCoord[], whereFrom?: string): void {
    this.setState({ backgroundHexCoords: hexCoords }, whereFrom);
  }

  setHexData(hexData: HexData[], whereFrom?: string): void {
    this.setState({ hexData: sortHexDataArray(hexData) }, whereFrom);
  }

  getHexData(): HexData[] {
    return this.getState().hexData;
  }

  getNewHexCoords(radius: number, userCoords: HexData[]): Observable<HexData[]> {
    const url = `${this.serviceURL}/${radius}`;
    return this.http.post<HexData[]>(url, JSON.stringify(userCoords), this.httpOptions).pipe(
      tap((_) => console.log('fetched hex coords')),
      catchError((err) => this.handleError(err, [])),
    );
  }

  // TODO: implement error handling
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  // private handleError<T>(operation = 'operation', result?: T) {
  // return (error: any): Observable<T> => {
  //   console.error(error);
  //   this.log(`${operation} failed: ${error.message}`);
  //   return of(result as T);
  // };
  // }
  private handleError<T>(error: any, result?: T): Observable<T> {
    console.error('Error');
    console.error(error);
    return of(result as T);
  }
}
