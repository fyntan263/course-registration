import { Component, Input, NgModule, OnChanges, OnInit, PipeTransform, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { Observable, Subject, combineLatest, startWith, debounceTime, distinctUntilChanged, map, BehaviorSubject, delay, of, switchMap, tap } from 'rxjs';
import { PreWaiverApplyStatus } from '../../models/models';
import { StudentCourse } from '../../models/student-course.model';
import { NgbHighlight, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, CommonModule, DecimalPipe } from '@angular/common';
import { DataService } from '../../services/data.service';
import { NgbdSortableHeader, SortColumn, SortDirection, SortEvent } from './sortable.directive';


interface SearchResult {
  courses: StudentCourse[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

const compare = (v1: string | number, v2: string | number) =>
  v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(
  courses: StudentCourse[],
  column: SortColumn,
  direction: string
): StudentCourse[] {
  if (direction === '' || column === '') {
    return courses;
  } else {
    return [...courses].sort((a, b) => {
      const res = compare(a[column] as string, b[column] as string);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(course: StudentCourse, term: string) {
  return (
    (course.code && course.code.toLowerCase().includes(term.toLowerCase())) ||
    (course.name && course.name.toLowerCase().includes(term.toLowerCase())) ||
    (course.instructor.join(", ") && course.instructor.join(", ").toLowerCase().includes(term.toLowerCase())) ||
    (course.credits && course.credits.toLowerCase().includes(term.toLowerCase())) ||
    (course.slot && course.slot.toLowerCase().includes(term.toLowerCase()))
  );
}
@Component({
  selector: 'app-courses-table',
  standalone: true,
  imports: [NgbModule, FormsModule, CommonModule, DecimalPipe, AsyncPipe,
    NgbHighlight,
    NgbdSortableHeader,
    NgbPaginationModule],
  providers: [DecimalPipe],
  templateUrl: './courses-table.component.html',
})
export class CoursesTableComponent implements OnInit{
 @Input({ required: true }) courseList$!: Observable<StudentCourse[]>;

  sortColumnMap: { [key: string]: string } = {};
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _total$ = new BehaviorSubject<number>(0);
  private _search$ = new Subject<void>();
  public _initialData: StudentCourse[] = [];
  private _courseData$ = new BehaviorSubject<StudentCourse[]>([]);
  private _state: State = {
    page: 1,
    pageSize: 5,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
  };
  PreWaiverStatus = PreWaiverApplyStatus;
  reasonInput: string = '';

  collapsedStates: { [key: string]: boolean } = {};
  collapsedStatesApply: { [key: string]: boolean } = {};

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;

  
  constructor(private dataService: DataService, private pipe: DecimalPipe) { }

  ngOnInit(): void {
    this.courseList$.pipe(
      tap(courses => {
        this._initialData = courses;
        this._total$.next(courses.length);
        this._courseData$.next(this._initialData);
      })
    ).subscribe();

    this._search$
      .pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this._search()),
        delay(200),
        tap(() => this._loading$.next(false))
      )
      .subscribe((result) => {
        this._courseData$.next(result.courses);
        this._total$.next(result.total);
      });

    this._search$.next();
  }

 

  get courseData$() {
    return this._courseData$.asObservable();
  }
  get total$() {
    return this._total$.asObservable();
  }
  get loading$() {
    return this._loading$.asObservable();
  }
  get page() {
    return this._state.page;
  }
  get pageSize() {
    return this._state.pageSize;
  }
  get searchTerm() {
    return this._state.searchTerm;
  }

  set page(page: number) {
    this._set({ page });
  }

  set pageSize(pageSize: number) {
    this._set({ pageSize });
  }
  set searchTerm(searchTerm: string) {
    this._set({ searchTerm });
  }
  set sortColumn(sortColumn: SortColumn) {
    this._set({ sortColumn });
  }

  setColumDirection(column: string, direction: string) {
    this.sortColumnMap[column] = direction;
  }

  set sortDirection(sortDirection: SortDirection) {
    this._set({ sortDirection });
  }

  onSort({ column, direction }: SortEvent) {
    this.setColumDirection(column, direction);
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    this.sortColumn = column;
    this.sortDirection = direction;
    this._search$.next();
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm } =
      this._state;
    // Use the initial data for filtering and sorting
    let courses = [...this._initialData];

    // 1. sort
    courses = sort(courses, sortColumn, sortDirection);

    // 2. filter
    courses = courses.filter((course) =>
      matches(course, searchTerm)
    );
    const total = courses.length;

    // 3. paginate
    courses = courses.slice(
      (page - 1) * pageSize,
      (page - 1) * pageSize + pageSize
    );
    return of({ courses, total });
  }

  
  toggleCollapse(courseCode: string): void {
    this.collapsedStates[courseCode] = !this.collapsedStates[courseCode];
  }

  toggleCollapseApply(courseCode: string): void {
    this.collapsedStatesApply[courseCode] = !this.collapsedStatesApply[courseCode];
  }

  applyWaiverRequest(course: StudentCourse): void {
    const request = {
      rollNo: '', // This would be provided as part of the student context
      courseCode: course.code,
      reason: this.reasonInput,
      preReqWaiverRequest: true
    };
    course.preReqWaiverStatus= PreWaiverApplyStatus.APPLIED
    this.dataService.applyWaiver(request, course.preReqWaiverStatus);
    this.reasonInput = ''; // Clear input reason
    this.collapsedStatesApply[course.code] = false;
  }

}
