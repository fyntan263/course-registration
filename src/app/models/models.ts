// Clause that contains a list of codes, representing AND conditions
export interface PrerequisiteClause {
    code: string[];
  }
  
  // Interface for course prerequisites with OR and NOT clauses
  export interface Prerequisite {
    orClause: PrerequisiteClause[];
    notClause: string[];
  }
  
  // Interface representing a student profile
  export interface StudentProfile {
    rollNo: string;
    name: string;
    program: string;
    branch: string;
    semester?: number;
    cgpa?: number;
  }
  
  // Interface for the range of credits
  export interface CreditRange {
    max: number;
    min: number;
  }
  
  // Enum representing the type of the course
  export enum CourseType {
    ELECTIVE,
    CORE
  }
  
  // Interface representing the course details
  export interface Course {
    code: string;
    name: string;
    credits: string; // Format: "L-T-P-C"
    instructor: string[];
    prerequisites: Prerequisite[];
    slot: string;
    textBooks: string[];
    referenceBooks: string[];
    type: CourseType;
    syllabusLink?: string;
  }
  
  // Interface representing a student's course information
  export interface StudentCourse {
    semesters: number[];
    isCompleted: boolean;
    course: Course; // Details of the course
    isWaiverApplied: boolean; // Indicates if a prerequisite waiver is granted
  }
  
  // Interface extending StudentProfile with additional course-related information
  export interface StudentInfo extends StudentProfile {
    creditRange: CreditRange;
    pastCourses: StudentCourse[]; // List of past courses (including electives)
    waivedCourses: string[];
  }
  