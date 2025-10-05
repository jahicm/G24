export interface Entry {
  userId:string;
  dataEntryTime: Date;
  measurementTime: any;
  value: string;
  sugarValue: number;
  unit: string;
  referenceValue: number;
  status: string;
}