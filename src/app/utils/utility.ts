import { Entry } from "../models/entry";
import { JwtHelperService } from '@auth0/angular-jwt';


export class Utility {

    static convertStringToDateAndFilter(entries: Entry[], fromDate: string, toDate: string): Entry[] {
        if (!fromDate || !toDate) {
            return entries;
        }

        const from = new Date(fromDate);
        const to = new Date(toDate);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);

        return entries.filter(entry => {
            const entryDate = new Date(entry.measurementTime);
            return entryDate >= from && entryDate <= to;
        });
    }

    static decodeUserIdFromToken(token: string): string {
        const helper = new JwtHelperService();
        const decodedToken = helper.decodeToken(localStorage.getItem('token') || '');
        const userId = decodedToken ? decodedToken.userId : null;
        return userId;
    }
}
