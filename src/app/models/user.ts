export interface User {
    userId:string;
    name: string;
    lastName?: string;
    dob?:Date;
    diabetesType: string;
    unit:string;
    gender?: string;
    street?: string
    number?: number
    postCode?: number
    city?: string;
    country?: string;
}
