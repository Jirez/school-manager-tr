import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { Card, CardBody, CardHeader, CardTitle } from "reactstrap";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface DashboardDistributionChartProps {
  dashboard: {
    students?: number | null;
    personnel?: number | null;
    users?: number | null;
  };
}

const DashboardDistributionChart: React.FC<DashboardDistributionChartProps> = ({
  dashboard,
}) => {
  const { t } = useTranslation();

  const buckets = [
    {
      label: t("label-students"),
      value: dashboard?.students ?? 0,
      color: "rgba(54, 162, 235, 0.65)",
      border: "rgba(54, 162, 235, 1)",
    },
    {
      label: t("label-personnel"),
      value: dashboard?.personnel ?? 0,
      color: "rgba(255, 206, 86, 0.65)",
      border: "rgba(255, 206, 86, 1)",
    },
    {
      label: t("label-users"),
      value: dashboard?.users ?? 0,
      color: "rgba(255, 99, 132, 0.65)",
      border: "rgba(255, 99, 132, 1)",
    },
  ];

  const total = buckets.reduce((sum, bucket) => sum + bucket.value, 0);

  const data = {
    labels: buckets.map((bucket) => bucket.label),
    datasets: [
      {
        data: buckets.map((bucket) => bucket.value || 0),
        backgroundColor: buckets.map((bucket) => bucket.color),
        borderColor: buckets.map((bucket) => bucket.border),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: { boxWidth: 14 },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed;
            if (!total) {
              return `${context.label}: ${value}`;
            }
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} (${percentage}%)`;
          },
        },
      },
      title: {
        display: false,
      },
    },
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle tag="h3" className="!font-semibold">
          {t("dashboard-distribution-title", {
            defaultValue: "Population distribution",
          })}
        </CardTitle>
      </CardHeader>
      <CardBody className="flex flex-col gap-3">
        <div className="h-[260px]">
          <Doughnut data={data} options={options} />
        </div>
        <div className="text-sm text-gray-600">
          {total
            ? t("dashboard-distribution-description", {
                defaultValue:
                  "Shows how the active community splits between students, personnel, and platform users.",
              })
            : t("dashboard-distribution-empty", {
                defaultValue:
                  "No population data yet — start by enrolling students or inviting staff.",
              })}
        </div>
      </CardBody>
    </Card>
  );
};

export default DashboardDistributionChart;
