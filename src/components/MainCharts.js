import React, {Fragment, useEffect} from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import AnyChart from 'anychart-react';
import anychart from 'anychart';
import axios from 'axios';

const useStyles = makeStyles({
  majorsChartBox: {
    width: '32%',
    display: 'block',
    border: '1px solid #a59393',
    background: 'black',
    borderRadius: '10px',
    padding: '5px',
    margin: '5px',
    boxShadow: '3px 3px 3px #000',
  },
  majorsInfoRow:{
    background: '#141517',
    zIndex: '1',
    position: 'relative',
    display: 'table',
    width: '99%'
  },
  majorsIconSymbol:{
    display: 'table-cell',
    verticalAlign: 'top',
    width: '250px',
    whiteSpace: 'nowrap'
  },
  majorsIcon:{
    float:'left',
    marginRight: '2px',
    '& img': {
      borderRadius: '6px',
      width: '32px',
      margin: '5px'
    }
  },
  majorsSymbol:{
    fontSize: '30px',
    textDecoration: 'none',
    fontWeight: '600',
    lineHeight: '45px',
    display: 'block',
    marginLeft: '4px',
    verticalAlign: 'top',
    color: '#8dc0ff'
  },
  majorsPriceAndChg:{
    verticalAlign: 'top',
    paddingTop: '5px',
    display: 'table',
    width: '206px',
  },
  majorsPrice: {
    margin: '1px',
    padding: '2px',
    textAlign: 'right',
    fontSize: '18px',
    lineHeight: '33px',
    fontWeight: '600',
    display: 'table-cell',
    width: '50%',
    fontFamily: 'Open Sans',
    color: '#e8e8e8'
  },
  majorsPriceChgPct_gain:{
    margin: '1px',
    padding: '2px',
    textAlign: 'right',
    fontSize: '18px',
    lineHeight: '33px',
    fontWeight: '600',
    display: 'table-cell',
    width: '50%',
    color: '#02c076'
  },
  majorsPriceChgPct_loss:{
    margin: '1px',
    padding: '2px',
    textAlign: 'right',
    fontSize: '18px',
    lineHeight: '33px',
    fontWeight: '600',
    display: 'table-cell',
    width: '50%',
    color: '#f84960;'
  },
});

const MainChart = (props) => {
  const {coinID, symbol, iconURL} = props;
  const classes = useStyles();
  const [chartData, setChartData] = React.useState([]);
  const iconAddress = `https://polygondex.com/${iconURL}`
  const [PriceOPEN, setPriceOPEN] = React.useState(null)
  const [PriceCLOSE, setPriceCLOSE] = React.useState(null)

  const [PriceChng, setPriceChng] = React.useState(null)
  const [PriceChngPct, setPriceChngPct] = React.useState(null);
  const [classColors, setclassColors] = React.useState('gain');
  const [pricePrefix, setpricePrefix] = React.useState('+');

  useEffect(() => {
    if (chartData.length) return;
    getPDEXTokenData().catch(err => console.error(err));
  }, [chartData])

  const getPDEXTokenData = async () => {

    const tokenData = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinID}/ohlc?vs_currency=usd&days=1`);
    if (tokenData.data?.length) {
      console.log(tokenData.data)
      setChartData(tokenData.data);
      getChartColorData(tokenData.data)
      return true;
    }
  }

  const getChartColorData = (chartData) => {
    setPriceOPEN(chartData[0][4])
    setPriceCLOSE(chartData[chartData.length - 1][4])
    const tempPriceOpen = chartData[0][4];
    const tempPriceClose = chartData[chartData.length - 1][4];

    setPriceChng(tempPriceClose-tempPriceOpen)
    const tempPriceChng = tempPriceClose-tempPriceOpen
    setPriceChngPct(((tempPriceChng / tempPriceOpen) * 100).toFixed(2));

    if (tempPriceChng < 0) {
      setclassColors('loss');
      setpricePrefix('');
    }
    return pricePrefix
  }

  function drawChartType1(QuoteSymbol, JSONdata, containerObjID) {
    const currentDatePlusOne = new Date();
    currentDatePlusOne.setDate(currentDatePlusOne.getDate() +1)
    const currentDatePlusOneNow = `${currentDatePlusOne.getFullYear()}-${currentDatePlusOne.getMonth()+1}-${currentDatePlusOne.getDate()}`
    const threeDaysAgo = new Date()
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const currentDateThreeDaysAgo = `${threeDaysAgo.getFullYear()}-${threeDaysAgo.getMonth()+1}-${threeDaysAgo.getDate()}`
    const chartStart = currentDateThreeDaysAgo;
    const chartEnd = currentDatePlusOneNow;
    const allBGs = '#0000000d'
    const linesGrid = '#1415170f'
    const linesHover = '#e8e8e8'
    const lineClose = '#e8e8e8'

    const colorUP_stroke = 'rgba(255, 255, 255, 0.7)'
    const colorUP_fill = 'rgba(2, 192, 118, 0.7)'

    const colorDOWN_stroke = 'rgba(255, 255, 255, 0.8)'
    const colorDOWN_fill = '#f84960'


    const dataTable = anychart.data.table();
    dataTable.addData(JSONdata);

    let chart = anychart.stock();
    const plot = chart.plot(0);

    plot.yAxis().orientation('right');

    const priceIndicator = plot.priceIndicator();
    priceIndicator.value('last-visible');
    priceIndicator.stroke({thickness: 0.8, color : lineClose, dash : '2 2'});


    priceIndicator.risingStroke(colorUP_fill);
    priceIndicator.risingLabel({ background: colorUP_fill });
    priceIndicator.fallingStroke(colorDOWN_fill);
    priceIndicator.fallingLabel({ background: colorDOWN_fill });

    //---------------------------------------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------------------------------------

    let series = plot.splineArea(dataTable.mapAs({ 'value': 4 })).name(QuoteSymbol)

    if (pricePrefix == '+') {
      series.fill(['rgba(2, 192, 118, 0.0)',colorUP_fill],90);
      series.stroke(colorUP_stroke);
    }
    else {
      series.fill(['rgba(248, 73, 96, 0.0)',colorDOWN_fill],90);
      series.stroke(colorDOWN_stroke);
    }

    series.pointWidth('50%');

    //---------------------------------------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------------------------------------

    plot.xGrid().enabled(true);
    plot.xGrid().stroke({
      color: linesGrid,
      dash: '3 5'
    });

    plot.yGrid().enabled(true);
    plot.yGrid().stroke({
      color: linesGrid,
      dash: '3 5'
    });

    plot.xMinorGrid().stroke({
      color: linesGrid,
      dash: '3 5'
    });

    chart.crosshair().displayMode('float');

    plot.crosshair().xStroke(linesHover, 1, '10 5', 'round');
    plot.crosshair().yStroke(linesHover, 1, '10 5', 'round');

    chart.background().fill(allBGs);

    // chart.container(containerObjID);

    chart.selectRange(chartStart, chartEnd);

    chart.padding(0, 0, 0, 0);
    chart.margin(0, 55, 0, 5);

    const rangeSelector = anychart.ui.rangeSelector();

    // specify which chart range selector controls

    chart.scroller().enabled(false);
    // render the chart
    chart.container(containerObjID);
    chart.draw();
    return chart;
  }

  if (chartData.length && classColors) {
    return (
        <div className={classes.majorsChartBox}>
          <div className={classes.majorsInfoRow}>
            <div className={classes.majorsIconSymbol}>
              <div className={classes.majorsIcon}>
                <img src={iconAddress}/>
              </div>
              <a className={classes.majorsSymbol} href='`/track/token.aspx?s=${symbol}&major=1`'>{symbol}</a>
            </div>
            <div className={classes.majorsPriceAndChg}>
              <div className={classes.majorsPrice}>${chartData[chartData.length - 1][4].toFixed(2)}</div>
              <div className={classes[`majorsPriceChgPct_${classColors}`]}>{pricePrefix} {PriceChngPct} %</div>
            </div>
          </div>
          <AnyChart
              height={200}
              id={`coinChart_${symbol}`}
              instance={drawChartType1(symbol, chartData, `coinChart_${symbol}`)}
          />
        </div>

    );
  }
  return null;
}
export default MainChart;