import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLowerCase();
    const lowerTerm = searchText.toLowerCase().trim()
    return items.filter(course => {
      return course.code.toLowerCase().includes(lowerTerm) ||
      course.name.toLowerCase().includes(lowerTerm)
    })
  }
  }
  
