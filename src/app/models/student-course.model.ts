import { Course, PreWaiverApplyStatus, Prerequisite } from "./models";

export interface StudentCourse extends Course {
    isComplete:boolean;
    isPrerequisiteMet:boolean;
    preReqWaiverStatus:PreWaiverApplyStatus;
}
