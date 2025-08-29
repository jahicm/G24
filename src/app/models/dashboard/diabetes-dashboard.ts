
import { GlucoseAnalysis, TimeSlot } from "./glucose-analysis";
import { Medication } from "./medication";
import { Reading } from "./reading";
import { SmartInsight,PriorityLevel } from "./smart-insight";

export class DiabetesDashboard {
    constructor(
        public readonly currentReading: Reading,
        public readonly weeklyAverage: Reading,
        public readonly weeklyReadings: Reading[],
        public readonly medications: Medication[],
        public readonly analysis: GlucoseAnalysis,
        public readonly insight: SmartInsight,
        public readonly metadata: {
            generatedAt: Date;
            apiVersion: string;
        }
    ) { }

    static fromJson(json: any): DiabetesDashboard {
        const data = json;
        console.log("data:"+JSON.stringify(data.latest_readings.weekly_average.unit));
        return new DiabetesDashboard(
            new Reading(
                data.latest_readings.reading.sugarValue,
                data.latest_readings.reading.unit,
                data.latest_readings.reading.status,
                data.latest_readings.reading.date,
                data.latest_readings.reading.context
            ),
            new Reading(
                data.latest_readings.weekly_average.value,
                data.latest_readings.weekly_average.unit,
                data.latest_readings.weekly_average.status
            ),
            data.weekly_overview.readings.map(
                (r: any) => new Reading(r.sugarValue, r.unit, '')
            ),
            data.medications.map(
                (m: any) => new Medication(m.name, m.type, m.dosage, m.frequency)
            ),
            new GlucoseAnalysis(
                data.ai_analysis.summary.weekly_avg,
                data.ai_analysis.summary.unit,
                data.ai_analysis.summary.trend,
                data.ai_analysis.high_readings.count,
                data.ai_analysis.high_readings.threshold,
                new TimeSlot(
                    data.ai_analysis.time_analysis.best.range,
                    data.ai_analysis.time_analysis.best.avg_value
                ),
                new TimeSlot(
                    data.ai_analysis.time_analysis.worst.range,
                    data.ai_analysis.time_analysis.worst.avg_value
                ),
                data.ai_analysis.recommendations,
                data.ai_analysis.hba1c_prediction.value
            ),
            new SmartInsight(
                data.smart_insight.text,
                data.smart_insight.translation,
                data.smart_insight.context,
                data.smart_insight.priority.toLowerCase() as PriorityLevel
            ),
            {
                generatedAt: new Date(),
                apiVersion: "1.0"
            }
        );
    }

    // Domain logic methods
    get needsMedicalAttention(): boolean {
        return this.currentReading.isHigh ||
            this.analysis.needsAttention;
    }

    get formattedMedications(): string[] {
        return this.medications.map(m => m.summary);
    }
}