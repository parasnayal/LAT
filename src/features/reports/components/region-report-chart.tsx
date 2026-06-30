"use client";

import { useMemo } from "react";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Tooltip,
  type ChartOptions
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";
import type { RegionReportItem } from "../types/report.types";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, ChartDataLabels);

const BAR_COLOR = "#9DC3E6";
const ALL_REGIONS_COLOR = "#2E5C8A";
const ALL_REGIONS_LABEL = "All Regions";

type ChartEntry = {
  name: string;
  score: number;
  count: number;
  isAggregate: boolean;
};

function buildEntries(regions: RegionReportItem[]): ChartEntry[] {
  const sorted = [...regions].sort((first, second) => second.averageScore - first.averageScore);

  const totalAttempted = sorted.reduce((sum, region) => sum + region.attemptedStudents, 0);
  const weightedScoreSum = sorted.reduce(
    (sum, region) => sum + region.averageScore * region.attemptedStudents,
    0
  );
  const overallAverage =
    totalAttempted > 0
      ? weightedScoreSum / totalAttempted
      : sorted.reduce((sum, region) => sum + region.averageScore, 0) / (sorted.length || 1);

  const entries: ChartEntry[] = sorted.map((region) => ({
    name: region.regionName,
    score: region.averageScore,
    count: region.attemptedStudents,
    isAggregate: false
  }));

  const aggregate: ChartEntry = {
    name: ALL_REGIONS_LABEL,
    score: overallAverage,
    count: totalAttempted,
    isAggregate: true
  };

  // Place the aggregate bar at its sorted position so it sits among the regions, as in the design.
  const insertAt = entries.findIndex((entry) => aggregate.score >= entry.score);
  if (insertAt === -1) {
    entries.push(aggregate);
  } else {
    entries.splice(insertAt, 0, aggregate);
  }

  return entries;
}

export function RegionReportChart({ regions }: { regions: RegionReportItem[] }) {
  const entries = useMemo(() => buildEntries(regions), [regions]);

  const maxScore = entries.reduce((max, entry) => Math.max(max, entry.score), 0);

  const data = {
    labels: entries.map((entry) => `${entry.name} (${entry.count})`),
    datasets: [
      {
        label: "Average Score",
        data: entries.map((entry) => entry.score),
        backgroundColor: entries.map((entry) =>
          entry.isAggregate ? ALL_REGIONS_COLOR : BAR_COLOR
        ),
        borderWidth: 0,
        maxBarThickness: 26,
        categoryPercentage: 0.8,
        barPercentage: 0.9
      }
    ]
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { top: 28 }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (items) => entries[items[0]?.dataIndex ?? 0]?.name ?? "",
          label: (item) => {
            const entry = entries[item.dataIndex];
            return [
              `Average score: ${entry.score.toFixed(2)}`,
              `Students participated: ${entry.count.toLocaleString()}`
            ];
          }
        }
      },
      datalabels: {
        anchor: "end",
        align: "end",
        offset: 2,
        rotation: -90,
        clamp: true,
        color: "#374151",
        font: (context) => ({
          size: 10,
          weight: entries[context.dataIndex]?.isAggregate ? "bold" : "normal"
        }),
        formatter: (value: number) => value.toFixed(2)
      }
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: true, color: "#CBD5E1" },
        ticks: {
          autoSkip: false,
          maxRotation: 90,
          minRotation: 90,
          color: "#475569",
          font: (context) => ({
            size: 11,
            weight: entries[context.index]?.isAggregate ? "bold" : "normal"
          })
        }
      },
      y: {
        display: false,
        beginAtZero: true,
        suggestedMax: maxScore * 1.15
      }
    }
  };

  return <Bar data={data} options={options} aria-label="Overall average scores by region" />;
}
