import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { Card, CardBody, CardHeader, CardTitle } from "reactstrap";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardChartProps {
  dashboard: {
    students?: number | null;
    personnel?: number | null;
    users?: number | null;
    sections?: number | null;
    cycles?: number | null;
    levels?: number | null;
    classes?: number | null;
  };
}

const DashboardChart: React.FC<DashboardChartProps> = ({ dashboard }) => {
  const { t } = useTranslation();

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
        text: t("Dashboard Summary"),
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const data = {
    labels: [
      t("label-students"),
      t("label-personnel"),
      t("label-users"),
      t("label-section"),
      t("label-cycles"),
      t("label-levels"),
      t("label-classes"),
    ],
    datasets: [
      {
        label: t("Count"),
        data: [
          dashboard?.students || 0,
          dashboard?.personnel || 0,
          dashboard?.users || 0,
          dashboard?.sections || 0,
          dashboard?.cycles || 0,
          dashboard?.levels || 0,
          dashboard?.classes || 0,
        ],
        backgroundColor: [
          "rgba(54, 162, 235, 0.5)", // Students - Info
          "rgba(255, 206, 86, 0.5)", // Personnel - Warning
          "rgba(255, 99, 132, 0.5)", // Users - Danger
          "rgba(75, 192, 192, 0.5)", // Sections - Primary (ish)
          "rgba(54, 162, 235, 0.5)", // Cycles - Info
          "rgba(255, 206, 86, 0.5)", // Levels - Warning
          "rgba(75, 192, 192, 0.5)", // Classes - Success (ish)
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h3" className="!font-semibold">
          {t("Dashboard Summary")}
        </CardTitle>
      </CardHeader>
      <CardBody>
        <Bar options={options} data={data} height={100} />
      </CardBody>
    </Card>
  );
};

export default DashboardChart;
