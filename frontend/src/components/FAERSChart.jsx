import React, { useEffect, useRef } from "react";
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
import { TrendingUp } from "lucide-react";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const FAERSChart = ({ data }) => {
  if (
    !data ||
    !data.faers_data ||
    !data.faers_data.details ||
    data.faers_data.details.length === 0
  ) {
    return (
      <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border shadow-sm p-5">
        <h2 className="font-semibold text-foreground mb-4 flex items-center">
          <TrendingUp size={18} className="mr-2 text-primary" />
          FAERS Report Distribution
        </h2>
        <div className="text-center py-8 text-muted-foreground text-sm">
          No FAERS data available. Upload an audio file with detected
          medications to see the comparison.
        </div>
      </div>
    );
  }

  // Prepare data for chart
  const faersDetails = data.faers_data.details.slice(0, 5); // Top 5
  const labels = faersDetails.map((d) => `${d.drug}\n+ ${d.symptom}`);
  const reportCounts = faersDetails.map((d) => d.reports);

  // Calculate patient's symptom frequencies if available
  const patientSymptoms = {};
  if (data.entities) {
    data.entities.forEach((entity) => {
      if (entity.Category === "MEDICAL_CONDITION") {
        patientSymptoms[entity.Text.toLowerCase()] = entity.Frequency || 1;
      }
    });
  }

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "FAERS Reports",
        data: reportCounts,
        backgroundColor: "rgba(239, 68, 68, 0.7)", // Red
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "hsl(222.2, 84%, 4.9%)",
          font: {
            size: 12,
            family: "Inter, sans-serif",
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function (context) {
            return `Reports: ${context.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "hsl(215.4, 16.3%, 46.9%)",
          font: {
            size: 11,
          },
          callback: function (value) {
            if (value >= 1000) {
              return (value / 1000).toFixed(1) + "k";
            }
            return value;
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        ticks: {
          color: "hsl(215.4, 16.3%, 46.9%)",
          font: {
            size: 10,
          },
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border shadow-sm p-5">
      <h2 className="font-semibold text-foreground mb-4 flex items-center">
        <TrendingUp size={18} className="mr-2 text-primary" />
        FAERS Report Distribution
      </h2>
      <p className="text-xs text-muted-foreground mb-4">
        Comparing identified drug-symptom pairs with FDA adverse event database
      </p>
      <div style={{ height: "250px" }}>
        <Bar data={chartData} options={options} />
      </div>
      <div className="mt-4 text-xs text-muted-foreground">
        <p>
          ℹ️ Higher report counts indicate more frequent adverse events recorded
          in FAERS database.
        </p>
      </div>
    </div>
  );
};

export default FAERSChart;
