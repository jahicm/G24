export class Reading {
    constructor(
        public readonly value: number,
        public readonly unit: string,
        public readonly status: string,
        public readonly timestamp?: string,
        public readonly predictedHbA1c?: string
    ) { }

    get isHigh(): boolean {
        return this.status.toLowerCase() === 'high';
    }

    get isNormal(): boolean {
        return this.status.toLowerCase() === 'good' ||
            this.status.toLowerCase() === 'normal';
    }

    format(): string {
        return `${this.value} ${this.unit}`;
    }
}