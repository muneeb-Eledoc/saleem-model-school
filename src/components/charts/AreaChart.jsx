import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);


export function AreaChart({title, xData, yData, borderColor, backgroundColor }) {

    return <Line height={'350'} options={{
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: title,
            },
        },
        maintainAspectRatio: false
    }} data = {{
    labels: xData,
        datasets: [
            {
                fill: true,
                label: title,
                data: yData,
                borderColor,
                backgroundColor,
            },
        ],
  }} />;
}
