export class JsonUtils {
    public static downloadJson(data:any){        
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'coreCoursePlanSubmission.json';
    link.click();
    window.URL.revokeObjectURL(url);
    }
}
