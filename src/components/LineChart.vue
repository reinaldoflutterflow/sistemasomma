<template>
  <Line
    :data="chartData"
    :options="chartOptions"
  />
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const props = defineProps<{
  data: number[];
  labels: string[];
  color: string;
}>();

const chartData = {
  labels: props.labels,
  datasets: [
    {
      label: '',
      data: props.data,
      borderColor: props.color,
      backgroundColor: props.color + '20',
      tension: 0.4,
      fill: true,
      pointRadius: 0,
      borderWidth: 2
    }
  ]
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      enabled: true,
      mode: 'index',
      intersect: false,
      backgroundColor: '#FFF',
      titleColor: '#666',
      bodyColor: '#1A1A1A',
      borderColor: '#E5E5E5',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
      titleFont: {
        size: 14,
        weight: 'normal'
      },
      bodyFont: {
        size: 14,
        weight: 'bold'
      },
      displayColors: false
    }
  },
  interaction: {
    mode: 'index',
    intersect: false
  },
  scales: {
    x: {
      display: false,
      grid: {
        display: false
      }
    },
    y: {
      display: false,
      grid: {
        display: false
      },
      beginAtZero: true
    }
  },
  layout: {
    padding: {
      top: 20,
      bottom: 0
    }
  }
};
</script> 