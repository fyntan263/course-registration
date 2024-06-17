import { Pipe, PipeTransform } from '@angular/core';
import { Prerequisite } from '../models/models';

@Pipe({
  name: 'prereq',
  standalone: true
})
export class PrereqPipe implements PipeTransform {
  toottipstring = '';
  transform(prereq:Prerequisite): string {
    this.toottipstring = 'prerequisites are:'
    for(let or of prereq.orClause){
      this.toottipstring +='[' + or.code.toString() + ']' + " or ";
    }
    this.toottipstring = this.toottipstring.slice(0,-3)
    this.toottipstring += "Courses should not be completed are:"
    this.toottipstring += '[' + prereq.notClause.toString() + ']';
    return this.toottipstring;
  }

}
