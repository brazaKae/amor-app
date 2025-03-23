import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TempoJuntos } from "../models/tempoJuntos.models";
import { interval, Observable, switchMap } from 'rxjs';
import { Marco } from "../models/marco.models";


@Injectable({
    providedIn: "root"
})
export class AmorService{
    private apiURL = 'http://localhost:8080/api';

    constructor(private http: HttpClient) {}

    getTempoJuntos(): Observable<TempoJuntos> {
        return this.http.get<TempoJuntos>(`${this.apiURL}/tempo`)
    }

    // Atualizações de tempo a cada segundo
    getTempoJuntosLive(): Observable<TempoJuntos> {
        return interval(1000).pipe(
            switchMap(() => this.getTempoJuntos())
        )
    }

    getMarcosDesbloqueados(): Observable<Marco[]> {
        return this.http.get<Marco[]>(`${this.apiURL}/marcos/desbloqueados`);
      }
    
      getTodosMarcosVisiveis(): Observable<Marco[]> {
        return this.http.get<Marco[]>(`${this.apiURL}/marcos`);
      }
    
}