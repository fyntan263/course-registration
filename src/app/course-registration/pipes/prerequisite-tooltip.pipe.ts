import { Pipe, PipeTransform } from '@angular/core';
import { Prerequisite } from '../../models/models';

@Pipe({
  name: 'prerequisiteTooltip',
  standalone: true
})
export class PrerequisiteTooltipPipe implements PipeTransform {

  transform(prereq: Prerequisite, ...args: unknown[]): string {
    let tooltipString = 'Prerequisites are: ';

    // Process OR clauses
    for (let orClause of prereq.orClause) {
      tooltipString += '[' + orClause.code.join(', ') + '] or ';
    }

    // Remove the trailing " or "
    tooltipString = tooltipString.slice(0, -4) + '. ';

    // Process NOT clauses
    tooltipString += 'Courses that should not be completed are: ';
    tooltipString += '[' + prereq.notClause.join(', ') + ']';

    return tooltipString;
  }
}