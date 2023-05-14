import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';

const Wordhistogram = () => {
  const [histogramData, setHistogramData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (histogramData.length > 0) {
      renderHistogram();
    }
  }, [histogramData]);

  const fetchHistogramData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        'https://www.terriblytinytales.com/test.txt'
      );
      const text = await response.text();
      const words = text.split(/\s+/);
      const wordCountMap = words.reduce((countMap, word) => {
        countMap[word] = (countMap[word] || 0) + 1;
        return countMap;
      }, {});
      const sortedData = Object.entries(wordCountMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20);
      setHistogramData(sortedData);
    } catch (error) {
      console.error('Error fetching histogram data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,';
    const headers = ['Word', 'Count'];
    const rows = histogramData.map(([word, count]) => `${word},${count}`);
    const csvRows = [headers, ...rows].join('\n');
    const encodedCSV = encodeURI(csvContent + csvRows);
    const link = document.createElement('a');
    link.setAttribute('href', encodedCSV);
    link.setAttribute('download', 'histogram.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderHistogram = () => {
    const ctx = document.getElementById('histogram-chart');
    const labels = histogramData.map(([word]) => word);
    const data = histogramData.map(([, count]) => count);

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Word Frequency',
            data: data,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            stepSize: 1,
          },
        },
      },
    });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      {!histogramData.length ? (
        <button
          onClick={fetchHistogramData}
          disabled={isLoading}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          {isLoading ? 'Loading...' : 'Submit'}
        </button>
      ) : (
        <div>
        {histogramData.length > 0 && (
        <>
          <h2>Word Frequency Data & Histogram</h2>
          <div>
            {histogramData.map(([word, count]) => (
              <div key={word}>
                <span>{word}</span> - <span>{count}</span>
              </div>
            ))}
          </div>
          <button onClick={exportToCSV}>Export</button>
          <canvas id="histogram-chart" width="400" height="200"></canvas>
        </>
      )}
        </div>
      )}
    </div>

  );
};

export default Wordhistogram;
