import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { interval, Observable, Subject, Subscription, timer } from 'rxjs';
import { DashboardService } from './dashboard.service';
import { switchMap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DatePipe]
})

export class DashboardComponent implements OnInit {
  numbers = 0;
  showProcessingFlag: boolean = false;
  mySub: Subscription | null = null;
  displayedColumns: string[] = ['stockName', 'quantity', 'purchaseDate', 'purchasePrice' , 'currentPrice' , 'originalHoldingValue' , 'currentHoldingvalue'  , 'percentagePL'] ;
  dataSource : MatTableDataSource<any> = new MatTableDataSource<any>();
  clients : string[] = [];
  selected = new FormControl(0);
  constructor(private dashboardService: DashboardService) { }
  
  ngOnInit() {
   
  }

  fetch(){
    this.dashboardService.getClients().subscribe((res) => {
      this.clients = res;
      this.getDataForClients(this.clients[0]);
    })
    
  }

  tabChanged(event: MatTabChangeEvent){
    this.getDataForClients(event.tab.textLabel);
  }


  getDataForClients(name:string){
    this.showProcessingFlag = true;
    if(this.mySub !== null){
      this.mySub.unsubscribe();
    }

    this.mySub = interval(2000).pipe(
      switchMap(i => this.dashboardService.getClientsData(name))
    ).subscribe(
      res => {
        console.log(res);
        this.dataSource = new MatTableDataSource(res);
        this.showProcessingFlag = false;
      }
    );
  }

  // getDataForClients(name:string){
  //   this.dashboardService.getClientsData(name).subscribe(res=>{
  //     console.log(res);
  // })
  // }

  calculateHolding(value:any , value2:any){
    return((value*value2).toFixed(2));
  }

  calculatePL(value:any , value2:any , value3:any){
    var initPric = value*value3;
    var currPric = value2*value3;
    if(initPric > currPric){
      var lossPercentage = (((initPric-currPric) * 100) / initPric);
      return "-" + lossPercentage.toFixed(2) + "%";
    }
    else if(initPric < currPric){
      var profitPercentage = (((currPric-initPric) * 100) / initPric);
      return "+" + profitPercentage.toFixed(2) + "%";
    }
    else{
      return null;
    }
  }


}
