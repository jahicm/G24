export class Reading {
    constructor(
        public readonly sugarValue: number,
        public readonly unit: string,
        public readonly status: string,
        public readonly date?: string,
        public readonly context?:string    
    ) { }

    get isHigh(): boolean {
        return this.status.toLowerCase() === 'high';
    }

    get isNormal(): boolean {
        return this.status.toLowerCase() === 'good' ||
            this.status.toLowerCase() === 'normal';
    }

    format(): string {
        return `${this.sugarValue} ${this.unit}`;
    }
}