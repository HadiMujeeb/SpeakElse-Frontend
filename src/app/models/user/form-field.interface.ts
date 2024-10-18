
export interface FormFieldError {
    type : string;
    message : string;
}



export interface FormField {
    name:string;
    label:string;
    type:'text'|'password'|'confirmPassword'|'email'|'select';
    placeholder:string;
    errors:FormFieldError[]
    validation?:{}
    
}


