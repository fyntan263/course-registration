
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
    targetedBranch:string;
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
  
  export interface PrerequisiteWaiver{
    code: string;
    status: PreWaiverApplyStatus
  }
  // Interface extending StudentProfile with additional course-related information
  export interface StudentInfo{
    rollNo: string;
    isEligible: boolean;
    electiveRange: ElectiveRange[]
    creditRange: Range;
    completedCourses: string[]; // List of past courses (including electives)
    preRequisiteWaivers: PrerequisiteWaiver[];
    faApprovalStatus?:PreWaiverApplyStatus
    totalCredits: number;
    electiveCredits: ElectiveCredits[];

  }
 export interface PrerequisiteWaiverRequest{
  rollNo: string,
  courseCode: string,
  reason: string,
  preReqWaiverRequest: boolean
 }

//   export interface CoreCoursePlanSubmission {
//     rollNo: string;
//     riskStatus: boolean;  // Changed to more descriptive naming for properties
//     totalCredits: number;
//     coreCoursePlan: Course[];
// }

export interface ElectiveCredits {
	basket: string[];
	minCredits: number;
  maxCredits: number;
}

export enum PreWaiverApplyStatus {
  APPLIED = "APPLIED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  NOT_APPLIED = "NOT_APPLIED" 
}
