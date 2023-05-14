import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';

const Wordhistogram = () => {
  const [histData, sethistData] = useState([]);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    if (histData.length > 0) {
      changeHistogram();
    }
  }, [histData]);

  const datafetch = async () => {
    setloading(true);
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
      sethistData(sortedData);
    } catch (error) {
      console.error('Error fetching histogram data:', error);
    } finally {
      setloading(false);
    }
  };

  const exportToCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,';
    const headers = ['Word', 'Count'];
    const rows = histData.map(([word, count]) => `${word},${count}`);
    const csvRows = [headers, ...rows].join('\n');
    const encodedCSV = encodeURI(csvContent + csvRows);
    const link = document.createElement('a');
    link.setAttribute('href', encodedCSV);
    link.setAttribute('download', 'histogram.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const changeHistogram = () => {
    const ctx = document.getElementById('histogram-chart');
    const labels = histData.map(([word]) => word);
    const data = histData.map(([, count]) => count);

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
      {!histData.length ? (
        <button
          onClick={datafetch}
          disabled={loading}
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
          {loading ? 'Loading...' : 'Submit'}
        </button>
      ) : (
        <div>
        {histData.length > 0 && (
        <>
          <h2 style={{
            padding:'10px',
            marginTop:'400px',
          }}>Word Frequency Histogram & Data</h2>
          <canvas id="histogram-chart" width="700" height="300"></canvas>
          <button onClick={exportToCSV} style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            marginLeft:'40%',
          }}>Export</button>
          
          <p style={{fontStyle:'oblique'
          }}>Word Frequency Data</p>
          <div>
            {histData.map(([word, count]) => (
              <div key={word}>
                <span>{word}</span> - <span>{count}</span>
              </div>
            ))}
            
          </div>
         
          <h3>Assignment Submitted by : &nbsp;&nbsp;&nbsp;&nbsp; Name: Yashi Gupta &nbsp;&nbsp;&nbsp;&nbsp; Registration No: 12019103 &nbsp;&nbsp;&nbsp;&nbsp; Mail: yashig52@gmail.com  </h3>

          
          
        </>
      )}
     
        </div>
        
      )}
      
    </div>

  );
};

export default Wordhistogram;
