
export interface FormFieldError {
    type : string;
    message : string;
}

export interface FormOptions {
    value:string,
    label:string
}



export interface FormField {
    name:string;
    label:string;
    type:'text'|'password'|'confirmPassword'|'email'|'select'|'textarea'|'file'|'number';
    placeholder:string;
    errors?:FormFieldError[]
    options?:FormOptions[];
    validation?:{}
    
}


