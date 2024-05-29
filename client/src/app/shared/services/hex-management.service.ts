import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { HexData } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class HexManagementService {
  private baseURL = 'http://localhost:3000';
  private serviceURL = `${this.baseURL}/hex-grid-management`;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

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

  getNewHexCoords(radius: number, userCoords: HexData[]): Observable<HexData[]> {
    const url = `${this.serviceURL}/${radius}`;
    return this.http.post<HexData[]>(url, JSON.stringify(userCoords), this.httpOptions).pipe(
      tap((_) => console.log('fetched hex coords')),
      catchError((err) => this.handleError(err, [])),
    );
  }
}
