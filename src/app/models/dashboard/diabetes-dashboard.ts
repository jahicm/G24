
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

    static fromJson(json: string): DiabetesDashboard {
        const data = JSON.parse(json);

        return new DiabetesDashboard(
            new Reading(
                data.data.latest_readings.current.value,
                data.data.latest_readings.current.unit,
                data.data.latest_readings.current.status,
                data.data.latest_readings.current.timestamp,
                data.data.latest_readings.current.predictedHbA1c
            ),
            new Reading(
                data.data.latest_readings.weekly_average.value,
                data.data.latest_readings.weekly_average.unit,
                data.data.latest_readings.weekly_average.status
            ),
            data.data.weekly_overview.readings.map(
                (r: any) => new Reading(r.value, r.unit, '')
            ),
            data.data.medications.map(
                (m: any) => new Medication(m.name, m.type, m.dosage, m.frequency)
            ),
            new GlucoseAnalysis(
                data.data.ai_analysis.summary.weekly_avg,
                data.data.ai_analysis.summary.unit,
                data.data.ai_analysis.summary.trend,
                data.data.ai_analysis.high_readings.count,
                data.data.ai_analysis.high_readings.threshold,
                new TimeSlot(
                    data.data.ai_analysis.time_analysis.best.range,
                    data.data.ai_analysis.time_analysis.best.avg_value
                ),
                new TimeSlot(
                    data.data.ai_analysis.time_analysis.worst.range,
                    data.data.ai_analysis.time_analysis.worst.avg_value
                ),
                data.data.ai_analysis.recommendations
            ),
            new SmartInsight(
                data.data.smart_insight.text,
                data.data.smart_insight.translation,
                data.data.smart_insight.context,
                data.data.smart_insight.priority.toLowerCase() as PriorityLevel
            ),
            {
                generatedAt: new Date(data.metadata.generated_at),
                apiVersion: data.metadata.api_version
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