import { trigger, transition, style, animate, state } from "@angular/animations";
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from "@angular/core";
import { TempoJuntos } from "../../models/tempoJuntos.models";
import { Marco } from "../../models/marco.models";
import { AmorService } from "../../services/amor.service";
import { TestComponentRenderer } from "@angular/core/testing";

@Component({
    selector: 'app-contador',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './contador.component.html',
    styleUrls: ['./contador.component.scss'],
    animations: [
      trigger('fadeIn', [
        transition(':enter', [
          style({ opacity: 0 }),
          animate('500ms', style({ opacity: 1 }))
        ])
      ]),
      trigger('heartBeat', [
        state('idle', style({ transform: 'scale(1)' })),
        state('beat', style({ transform: 'scale(1.1)' })),
        transition('idle <=> beat', animate('500ms ease-in-out'))
      ])
    ]
  })
  export class ContadorComponent implements OnInit, OnDestroy{
    tempoJuntos: TempoJuntos = { dias: 0, horas: 0, minutos: 0, segundos: 0 };
    marcosDesbloqueados: Marco[] = [];
    novoMarcoDesbloqueado?: boolean = false;
    marcoRecemDesbloqueado?: Marco;
    ultimosDiasVerificados: number = 0;
    heartState: string = 'idle';

    private tempoSubscription?: Subscription;
    private marcosSubscription?: Subscription;
    private heartbeatInterval?: any;

    constructor(private amorService: AmorService) {}

    ngOnInit(): void {
        this.tempoSubscription = this.amorService.getTempoJuntosLive().subscribe(tempo => {
            this.tempoJuntos = tempo;

            // Verificar se novos marcos foram desbloqueados
            if (tempo.dias > this.ultimosDiasVerificados) {
                this.verificarNovosMarcosDesbloqueados();
                this.ultimosDiasVerificados = tempo.dias;
            }
        });

        this.carregarMarcosDesbloqueados();

        //animar o coração
        this.iniciarBatimentoCardiaco();
    }

    carregarMarcosDesbloqueados(): void {
        this.marcosSubscription = this.amorService.getMarcosDesbloqueados().subscribe(marcos => {
            this.marcosDesbloqueados = marcos;
        });
    }

    verificarNovosMarcosDesbloqueados(): void {
        const marcosAntigos = this.marcosDesbloqueados.length;
        
        this.amorService.getMarcosDesbloqueados().subscribe(marcos =>{
            this.marcosDesbloqueados = marcos;

            if (marcos.length > marcosAntigos){
                this.novoMarcoDesbloqueado = true;
                this.marcoRecemDesbloqueado = marcos[marcos.length - 1];

                //resetar apos 10 sec
                setTimeout(() => {
                    this.novoMarcoDesbloqueado = false;
                }, 10000);
            }
        });
    }

    iniciarBatimentoCardiaco(): void {
        this.heartbeatInterval = setInterval(() => {
            this.heartState = this.heartState === 'idle' ? 'beat' : 'idle';
        }, 1000);
    }

    ngOnDestroy(): void {
        if (this.tempoSubscription) {
            this.tempoSubscription.unsubscribe();
        }
        if(this.marcosSubscription) {
            this.marcosSubscription?.unsubscribe();
        }
        if(this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }
    }









}