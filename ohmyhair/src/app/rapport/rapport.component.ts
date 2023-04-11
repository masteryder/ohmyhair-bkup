import { Component, OnInit,Injectable } from '@angular/core';
import {NgbDatepickerI18n,NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';



  const I18N_VALUES = {
  en: {
    weekdays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
  fr: {
    weekdays: ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'],
    months: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aou', 'Sep', 'Oct', 'Nov', 'Déc'],
  }
};

@Injectable()
export class I18n {
  language = 'fr';
}


@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {

  constructor(private _i18n: I18n) {
    super();
  }

  getWeekdayShortName(weekday: number): string {
    return I18N_VALUES[this._i18n.language].weekdays[weekday - 1];
  }
  getMonthShortName(month: number): string {
    return I18N_VALUES[this._i18n.language].months[month - 1];
  }
  getMonthFullName(month: number): string {
    return this.getMonthShortName(month);
  }
}

@Component({
  selector: 'app-rapport',
  templateUrl: './rapport.component.html',
  styleUrls: ['./rapport.component.css'],
  providers: [I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n},NgbDatepickerConfig]
})
export class RapportComponent implements OnInit {
  model;

  constructor(private _i18n: I18n, config: NgbDatepickerConfig) { 
    config.minDate = {year: 2017, month: 1, day: 1};
    config.maxDate = {year: 2099, month: 12, day: 31};
  }
 set language(language: string) {
    this._i18n.language = language;
  }

  get language() {
    return this._i18n.language;
  }

  getDate()
  {
    return this.model.year + "-" + this.model.month + "-" + this.model.day;
  }
  ngOnInit() {
        const now = new Date();

        this.model = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
  }



}
