export class User {
    userId!: string;
    name!: string;
    lastName!: string;
    dob!: Date;
    postCode!: string;
    city?: string;
    country!: string;
    unitId!: string;
    diabetesType!: string;
    medications?: string;
    email!: string;
    password!: string;
    password_repeat!: string;
}
