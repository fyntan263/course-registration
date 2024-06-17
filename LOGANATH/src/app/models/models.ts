// Clause that contains a list of codes, representing AND conditions
export interface PrerequisiteClause {
    code: string[];
  }
  
  // Interface for course prerequisites with OR and NOT clauses
  export interface Prerequisite {
    orClause: PrerequisiteClause[];
    notClause: string[];
  }  
  
  // Interface representing the course details
  export interface Course {
    code: string;
    name: string;
    credits: string; // Format: "L-T-P-C"
    instructor: string[];
    preRequisites: Prerequisite;
    coRequisites: Prerequisite;
    slot: string;
    textBooks: string[];
    referenceBooks: string[];
    syllabusLink: string;
    programCode:string 
    isCore: boolean
    isElective: boolean
    electiveCategory:string //PME, HSE, 
    quota:number
    courseLevel: number;
  }
  export interface Range {
    max: number;
    min: number;
  }

  export interface ElectiveRange extends Range {
    code: string
}
  
  // Interface extending StudentProfile with additional course-related information
  export interface StudentInfo{
    rollNo: string;
    isEligible: boolean;
    electiveRange: ElectiveRange[]
    creditRange: Range;
    completedCourses: string[]; // List of past courses (including electives)
    preRequisiteWaivers: string[];
  }

  export interface senddata {
    "RollNo" : string,
    "Risk/Not at Risk" : boolean,
    "Total credits" : number,
    "Core Course Plan" : Course[]
}