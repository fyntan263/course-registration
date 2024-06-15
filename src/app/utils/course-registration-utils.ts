import { StudentInfo } from "../models/models";

export class CourseRegistrationUtils {
    public static isComplete(student: StudentInfo, courseCode:string):boolean{
        if(student){
            return student.completedCourses.includes(courseCode)
        }
        return false;
    }
}
