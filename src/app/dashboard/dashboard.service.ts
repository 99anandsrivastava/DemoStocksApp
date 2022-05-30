import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, timer } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

constructor(private http: HttpClient) { }


public getClients(){
 return this.http.get<any[]>('https://localhost:44395/api/StocksOrders/names/all');
}

public getClientsData(name:string){
  return this.http.get<any[]>('https://localhost:44395/api/StocksOrders/' + name);
}

// public getClientsData(name:string){
//   return timer(0,5000)
//   .pipe(
//      switchMap(_ => this.http.get<any[]>('https://localhost:44395/api/StocksOrders/' + name)),
//      catchError(error => of(`Bad request: ${error}`))
//   );
// }
}



