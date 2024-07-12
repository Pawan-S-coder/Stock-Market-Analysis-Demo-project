// / golbal variable to  store stock data
let stockData={};
let stockSummaryData={};

// funcction to fetch stock data
async function fatchStockData(){
    try{const response=await fetch('https://stocks3.onrender.com/api/stocks/getstockstatsdata');
    const data=await response.json();
    stockData= data.stocksStatsData[0];
    return stockData;
}catch(err){
    console.error("err is",err);
}}
// function to fetch stock summery
async function fetchStockSummery(){
    try{
        const response2= await fetch('https://stocks3.onrender.com/api/stocks/getstocksprofiledata');
        const Data1=await response2.json();
        stockSummaryData= Data1.stocksProfileData[0];
        return stockSummaryData;
        }catch(error){
        console.error("error found was:",error);
    }
}

// function to render data list
async function showStockList(){
    await fatchStockData();
    const stockContainer=document.getElementById('listSection');
    stockContainer.innerHTML='';

      Object.keys(stockData).forEach(stock=>{
             if(stock !=='_id'){
                const stockInfo=stockData[stock];
                const stockElement=document.createElement('li');
                stockElement.innerHTML=`<button  class="stockNameBtn">${stock}</button>
                <h4 id="bookingValue" class="bookingValue">booking Value:${stockInfo.bookValue}$</h4>
                <h4 id="profit" class="profit">Profit:${stockInfo.profit}</h4>`;
                stockContainer.appendChild(stockElement);

             }
         });
       addcClickEvent(); 
}

// function to render stock summery
async function showSummery(stockName){
   await fetchStockSummery();
   const stockDetails= stockSummaryData[stockName];
   const stockDetailContainer=document.getElementById('detailSection');
   stockDetailContainer.innerHTML='';
   if(stockDetails){
            const stockSummeryEl=document.createElement('div');
            const stockStats=stockData[stockName]||{};

            stockSummeryEl.innerHTML=`<span id="CurrentStockName" class="stockName">${stockName}</span>
               <span id="bookingValue" class="bookingValue1">$${stockStats.bookValue || 'N/A'}</span>
               <span id="profit" class="profit">${stockStats.profit || 'N/A'}</span>
               <p id="summary">${stockDetails.summary} </p>`;
        stockDetailContainer.appendChild(stockSummeryEl);
      }
}
// function to add click event at each button stock
function addcClickEvent(){
    const stockButton=document.querySelectorAll('.stockNameBtn');
    stockButton.forEach(button=>{
        button.addEventListener('click',()=>{
            const stockName=button.innerText;
            showSummery(stockName);
            currentStockId=stockName;
            // renderStockChart(stockName, '1mo');

        })
    })
}
// function to render stockchart 
async function renderStockChart(stockName, timeframe) {
    try {
        const canvas = document.getElementById('chartCanvas');
        if (!canvas) {
            throw new Error('Canvas element with id "chartCanvas" not found.');
        }

        const response = await fetch('https://stocks3.onrender.com/api/stocks/getstocksdata');
        const data = await response.json();
        const stockData = data.stocksData[0][stockName][timeframe];

        const values = stockData.value;
        const timestamps = stockData.timeStamp.map(ts => new Date(ts * 1000));

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Failed to get 2D rendering context for canvas.');
        }

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: timestamps,
                datasets: [{
                    label: stockName,
                    data: values,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day',
                            tooltipFormat: 'll'
                        },
                        title: {
                            display: true,
                            text: 'Date'
                        },
                        adapters: {
                            date: {
                                locale: moment.locale(), // Ensure the adapter is configured correctly
                                formats: {
                                    datetime: 'MM/DD/YYYY'
                                }
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Price ($)'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            title: function (tooltipItem) {
                                return tooltipItem[0].label;
                            },
                            label: function (tooltipItem) {
                                return `Price: $${tooltipItem.raw}`;
                            }
                        }
                    },
                    datalabels: {
                        color: '#36A2EB',
                        display: true,
                        formatter: function (value) {
                            return `$${value}`;
                        }
                    }
                }
            }
        });
    } catch (err) {
        console.error("Error fetching chart data:", err);
    }
}




// Event listeners for chart buttons
document.getElementById('1month').addEventListener('click', () => renderStockChart(currentStockId, '1mo'));
document.getElementById('3month').addEventListener('click', () => renderStockChart(currentStockId, '3mo'));
document.getElementById('1year').addEventListener('click', () => renderStockChart(currentStockId, '1y'));
document.getElementById('5year').addEventListener('click', () => renderStockChart(currentStockId, '5y'));

// Variable to store the current stock ID
let currentStockId = 'AAPL';

// Initialize the stock list
showStockList();

