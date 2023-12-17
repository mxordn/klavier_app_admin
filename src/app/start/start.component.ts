import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';

export interface CollList {
  name: string,
  user_code: string,
  description: string
}

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
  providers: [MessageService]
})
export class StartComponent {
  publicCollections: CollList[] = [
    {name: 'Generalbass!', user_code: 'IOS6Zg', description:
    '#### Willkommen!\n' +
    '### Generalbass – Grundlagen\n' +
    '\n' +
    'Mit dieser Sammlung können die Grundlagen des Generalbasses geübt werden.' +
    '\n' +
    'Dazu zählen vor allem **Grundakkorde** (Akkorde in Grundstellung oder 5-3-Akkorde) und **Sextakkorde** (auch als erste Umkehrung bekannt). Außerdem wird es um Basstöne gehen, die keine Harmonisierung bekommen: Die **Durchgänge**' +
    '\n' +
    '1. Grundakkorde\n' +
    '2. Sextakkorde\n' +
    '3. Durchgänge im Bass'},
    {name: 'Quintfall-Sequenzen', user_code: 'veGYxA', description: '### Quintfallsequenzen \n' +
    '\n' +
    'Übungen zu verschiedenen Arten von Bassbewegungen, die im Fundamentbass Quintfälle haben.\n' +
    '\n' +
    ' Man könnte die Bassbewegungen unten deshalb auch als verschiedene Varianten von Quintfallsequenzen bezeichnen.\n' +
    '\n' +
    '#### Übungsteile\n' +
    '\n' +
    '1. „Echte Quintfälle“ in der Bassbewegung\n' +
    '2. „Treppenbässe“ mit Quintsextakkorden\n'+
    '3. Synkopierte Bässe mit Sekundakkorden\n'+
    '\n' +
    'Jeder Teil besteht aus aufbauenden Übungen. Los gehts…!'},
    {name: 'Basso 12 - Händel', user_code: 'tU2HMf', description: '### Basso 12 \n' +
    ' \n' +
    'Übungen zum 12 Basso der *Lessons for Princess Anne*. Besonderes Augenmerk der Übung liegt auf **Quint-Sext-Akkorden** und **Sequenzen**. Vor allem Verzierungen und Spielarten des **Treppenbasses** sind das Thema dieses Basses.</p>\n' +
    '\n' + 
    'Die Übung führt schrittweise durch Abschnitte des Basses, die auch jeweils transponiert werden können. [Den kompletten Bass kann man hier finden.](http://satzlehre.moritz-heffter.de/sequenzen/masterpieces-beziffert/)'}
  ]

  constructor(private messageService: MessageService) {}

  copyUserCode(user_code: string) {
    navigator.clipboard.writeText(user_code);
    this.messageService.add({severity: 'success', detail: 'Code kopiert'});
  }
}
