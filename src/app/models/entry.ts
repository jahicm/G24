export interface Entry {
  userId:string;
  dataEntryTime: Date;
  measurementTime: any;
  value: number;
  sugarValue: number;
  unit: string;
  referenceValue: number;
  status: string;
}