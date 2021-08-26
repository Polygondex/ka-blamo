import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import * as TableHeaderEnum from "../enums/TableHeaderEnum";
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import AssessmentIcon from '@material-ui/icons/Assessment';

const useStyles = makeStyles({
  tableContainer: {
    border: '1px solid #a59393',
    background: 'black',
    borderRadius: '10px',
    margin: '12px',
    padding: '0 5px 5px',
    boxShadow: '3px 3px 3px #000',
    width: '30%',
    display: 'inline-block',
    height: '500px',
    position: 'relative',
    overflow: 'scroll',
  },
  genTable: {
    width: '100%',
    tableLayout: 'fixed'
  },
  tableHeader: {
    padding: '7px',
    margin: '1px',
    background: '#000',
    borderRadius: '7px 7px 0 0',
    fontSize: '18px',
    lineHeight: '27px',
    minWidth: '270px',
    position: 'sticky',
    top: '0',
    borderBottom: '1px dotted #656565',
  },
  tdPriceChg: {
    width: '22%',
    borderBottom: '1px dotted #656565',
    padding: '5px 4px 5px 5px'
  },
  dashPriceChg: {
    color: 'white'
  },
  gainNum: {
    color: '#02C079'
  },
  negNum: {
    color: 'red'
  },
  dashPrice: {
    whiteSpace: 'nowrap',
    color: 'white'
  },
  tdTokenData: {
    borderBottom: '1px dotted #656565',
    padding: '5px 4px 5px 5px',
    color: 'white',
    width: '40%'
  },
  tokenSymbol: {
    color: '#97dfff'
  },
  dashVol: {
    color: 'white'
  },
  tdTVL24: {
    borderBottom: '1px dotted #656565',
    padding: '5px 4px 5px 5px',
    color: 'white',
    width: '33%'
  },
  totValLocked: {
    color: 'white'
  },
  tvlChange: {
    color: 'white'
  },
  tdTVLTitle: {
    borderBottom: '1px dotted #656565',
    padding: '5px 4px 5px 5px',
    width: '5%'
  },
  tvl: {
    writingMode: 'vertical-rl',
    textOrientation: 'upright',
    color: 'white'
  }
});

const kFormatter = (num) => {
  return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
}

const Table = ({filteredTableData, tableHeaderData}) => {
  const classes = useStyles();
  const [tableData] = React.useState(filteredTableData);

  const renderTableTitleIcon = () => {
    if (tableHeaderData === TableHeaderEnum.GAINER_24HR){
      return (
        <h2 className={classes.tableHeader}>
          <i className="fa fa-arrow-circle-up" style={{color:'green', margin:'4px 8px', fontSize: '20px'}}/>
          Top Gainers (24hrs)
        </h2>
      )
    }
    if (tableHeaderData === TableHeaderEnum.GAINER_10MIN){
      return (
        <h2 className={classes.tableHeader}>
          <i className="fa fa-arrow-circle-up" style={{color:'green', margin:'4px 8px', fontSize: '20px'}}/>
          Top Gainers (10mins)
        </h2>
      )
    }
    if (tableHeaderData === TableHeaderEnum.LOSER_24HR){
      return (
        <h2 className={classes.tableHeader}>
          <i className="fa fa-arrow-circle-down" style={{color:'red', margin:'4px 8px', fontSize: '20px'}}/>
          Top Losers (24hrs)
        </h2>
      )
    }
    if (tableHeaderData === TableHeaderEnum.ACTIVE_24HR){
      return (
        <h2 className={classes.tableHeader}>
          <i className="fa fa-chart-bar" style={{color:'white', margin:'4px 8px', fontSize: '20px'}}/>
          Most Active (24hrs)
        </h2>
      )
    }
    if (tableHeaderData === TableHeaderEnum.TVL_UP_24HR){
      return (
        <h2 className={classes.tableHeader}>
          <i className="fas fa-piggy-bank" style={{color:'green', margin:'4px 8px', fontSize: '20px'}}/>
          $TVL - Most Deposited (24hrs)
        </h2>
      )
    }
    if (tableHeaderData === TableHeaderEnum.TVL_DOWN_24HR){
      return (
        <h2 className={classes.tableHeader}>
          <i className="fas fa-level-up-alt" style={{color:'red', margin:'4px 8px', fontSize: '20px'}}/>
          $TVL - Most Withdrawn (24hrs)
        </h2>
      )
    }
  }

  return (
      <div className={classes.tableContainer}>

        {renderTableTitleIcon()}
        <table className={classes.genTable}>
          <tbody>
          {
            tableData.map((rToken, index) => {
              //TODO: need this method
              // let mostLiquidExchange = MATIC_DexLinks(rToken.mostLiquidExchangeID)

              let symbolLink = "/track/token.aspx?id=" + rToken.mdtTokenAddr + "&s=" + rToken.mdtTokenSymbol + "&ex=" + rToken.mostLiquidExchangeID;
              // let swapLink = Replace(Replace(mostLiquidExchange.url_swap, "xxxTOKEN2xxx", rToken.mdtTokenAddr), "xxxTOKEN1xxx", "ETH")
              let tokenSymbol = (rToken.mdtTokenSymbol === "MATIC" || rToken.mdtTokenSymbol === "WMATIC") ? "USDC" : "MATIC"
              let swapLink = "https://app.slingshot.finance/trade/m/" + rToken.mdtTokenAddr + "/" + tokenSymbol;
              let thisEx = rToken.mostLiquidExchangeID + 'quickChart_' + rToken.mdtTokenAddr
              let priceChange = (rToken.Price_PctChg_24hr*100).toFixed(2);
              // console.log(rToken)
              return <tr>

                <td className={classes.tdPriceChg}>
                  <div className={classes.dashPriceChg}>
                    <div className={(rToken.Price_PctChg_24hr > 0) ? classes.gainNum : classes.negNum}>{(rToken.Price_PctChg_24hr > 0) ? '+' : null}{priceChange}%</div>
                  </div>
                  <div className={classes.dashPrice}>${rToken.current_mstbePrice}</div>
                </td>
                <td className={classes.tdTokenData}>
                  <div className={classes.tokenSymbol}>
                    {rToken.mdtTokenSymbol}
                  </div>
                  <div className={classes.dashVol}>vol: ${kFormatter(rToken.VolumeUSD_24hr)}</div>
                </td>
                <td className={classes.tdTVL24}>
                  <div className={classes.totValLocked}>
                    ${kFormatter(rToken.current_TVL_USD)}
                  </div>
                  <div className={(rToken.TVL_USD_24hr > 0) ? classes.gainNum : classes.negNum}>${kFormatter(rToken.TVL_USD_24hr)}</div>
                </td>
                <td className={classes.tdTVLTitle}>
                  <div className={classes.tvl}>
                    TVL
                  </div>
                </td>

              </tr>
            })
          }
          </tbody>
        </table>
      </div>
  );
}
export default Table;