import { StudentInfo } from "../models/models";

export class CourseRegistrationUtils {
    public static isComplete(completedCourses:string[], courseCode:string):boolean{
         return completedCourses !== undefined?  completedCourses.includes(courseCode):false;
    }
    public static isPrerequisiteMet(student: StudentInfo, courseCode:string):boolean{
        if(student){
            return student.completedCourses.includes(courseCode)
        }
        return false;
    }

    public static (student: StudentInfo, courseCode:string):boolean{
        if(student){
            return student.completedCourses.includes(courseCode)
        }
        return false;
    }
}
