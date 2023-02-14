import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../../api/backend';

@Pipe({
  name: 'translateSkillLevel'
})
export class TranslateSkillLevelPipe implements PipeTransform {
  constructor(private translate: TranslateService) {
  }

  transform(user: User): string {
    let skill: string;
    const ksiSeasons = user.seasons?.length || 0;
    if (ksiSeasons <= 0) {
      skill = 'none';
    } else if (ksiSeasons <= 1) {
      skill = 'novice';
    } else if (ksiSeasons <= 2) {
      skill = 'skilled';
    } else if (ksiSeasons <= 3) {
      skill = 'master';
    } else {
      skill = 'veteran';
    }

    return `${this.translate.instant(`user.skill.${skill}.${user.gender}`)}`;
  }

}
