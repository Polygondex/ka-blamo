import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import * as TableHeaderEnum from "../enums/TableHeaderEnum";

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
    height: '600px',
    position: 'relative',
    overflow: 'scroll',
  },
  genTable: {
    width: '100%',
    tableLayout: 'fixed',
    backgroundColor: '#1d1f22'
  },
  tableHeader: {
    padding: '7px',
    margin: '1px',
    background: '#000',
    borderRadius: '7px 7px 0 0',
    fontSize: '20px',
    lineHeight: '27px',
    minWidth: '270px',
    position: 'sticky',
    top: '0',
    borderBottom: '1px dotted #656565',
    display: 'flex',
    alignItems: 'center'
  },
  tdPriceChg: {
    width: '20%',
    borderBottom: '1px dotted #656565',
    padding: '5px 8px 5px 5px',
    textAlign: 'end'
  },
  dashPriceChg: {
    color: 'white',
    marginBottom: '4px'
  },
  gainNum: {
    color: '#02C079',
    fontSize: '19px',
    fontWeight: '600',
    paddingBottom: '8px'
  },
  negNum: {
    color: 'red',
    fontSize: '19px',
    fontWeight: '600',
    paddingBottom: '8px'
  },
  gainNumTVL: {
    color: '#02C079',
    fontSize: '13px',
    fontWeight: '600'
  },
  negNumTVL: {
    color: 'red',
    fontSize: '13px',
    fontWeight: '600'
  },
  dashPrice: {
    whiteSpace: 'nowrap',
    color: 'white',
    fontSize: '12px',
    fontWeight: '400'
  },
  tdTokenData: {
    borderBottom: '1px dotted #656565',
    padding: '5px 4px 5px 5px',
    color: 'white',
    width: '50%'
  },
  tokenSymbol: {
    color: '#97dfff',
    display: 'flex',
    alignItems: 'center',
    fontWeight: '600',
    fontSize: '19px',
    paddingBottom: '8px'
  },
  tokenIcon: {
    height: '17px',
    width: '17px',
    margin: '3px 6px 3px 3px'
  },
  dashVol: {
    color: 'white',
    fontSize: '13px'
  },
  volLabel: {
    color: '#999797'
  },
  tdTVL24: {
    borderBottom: '1px dotted #656565',
    padding: '5px 4px 5px 5px',
    color: 'white',
    width: '18%',
    textAlign: 'end'
  },
  totValLocked: {
    color: 'white',
    fontSize: '13px',
    paddingBottom: '8px'
  },
  tvlChange: {
    color: 'white',
    fontSize: '13px'
  },
  tdTVLTitle: {
    borderBottom: '1px dotted #656565',
    padding: '5px 4px 5px 5px',
    width: '5%',
  },
  tvl: {
    writingMode: 'vertical-rl',
    textOrientation: 'upright',
    color: '#727d73',
    fontSize: '12px',
    lineHeight: '12px',
    fontWeight: '600',
    textAlign: 'right',
  }
});

const kFormatter = (num) => {
  return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : num.toFixed(2);
}

const roundNumber = (value, precision) => {
    let multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

const Table = ({filteredTableData, tableHeaderData, apeMode}) => {
  const classes = useStyles();
  const [tableData] = React.useState(filteredTableData);

  const renderTableTitleIcon = () => {
    if (tableHeaderData === TableHeaderEnum.GAINER_24HR){
      return (
        <h2 className={classes.tableHeader}>
          <i className="fa fa-arrow-circle-up" style={{color:'green', marginRight:'8px', fontSize: '22px'}}/>
          Top Gainers (24hrs)
        </h2>
      )
    }
    if (tableHeaderData === TableHeaderEnum.GAINER_10MIN){
      return (
        <h2 className={classes.tableHeader}>
          <i className="fa fa-arrow-circle-up" style={{color:'green', marginRight:'8px', fontSize: '22px'}}/>
          Top Gainers (10mins)
        </h2>
      )
    }
    if (tableHeaderData === TableHeaderEnum.LOSER_24HR){
      return (
        <h2 className={classes.tableHeader}>
          <i className="fa fa-arrow-circle-down" style={{color:'red', marginRight:'8px', fontSize: '22px'}}/>
          Top Losers (24hrs)
        </h2>
      )
    }
    if (tableHeaderData === TableHeaderEnum.ACTIVE_24HR){
      return (
        <h2 className={classes.tableHeader}>
          <i className="fa fa-chart-bar" style={{color:'white', marginRight:'8px', fontSize: '22px'}}/>
          Most Active (24hrs)
        </h2>
      )
    }
    if (tableHeaderData === TableHeaderEnum.TVL_UP_24HR){
      return (
        <h2 className={classes.tableHeader}>
          <i className="fas fa-piggy-bank" style={{color:'green', marginRight:'8px', fontSize: '22px'}}/>
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
    if (tableHeaderData === TableHeaderEnum.NEWEST_LISTING){
      return (
        <h2 className={classes.tableHeader}>
          <i className="fas fa-calendar-plus" style={{color:'green', margin:'4px 8px', fontSize: '20px'}}/>
          Newest Listing
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
              let priceChange =  roundNumber((rToken.Price_PctChg_24hr*100), 1);
              return <tr  key={index}>

                <td className={classes.tdPriceChg}>
                  <div className={classes.dashPriceChg}>
                    <div className={(rToken.Price_PctChg_24hr > 0) ? classes.gainNum : classes.negNum}>{(rToken.Price_PctChg_24hr > 0) ? '+' : null}{priceChange}%</div>
                  </div>
                  <div className={classes.dashPrice}>${rToken.current_mstbePrice.toFixed(4)}</div>
                </td>
                <td className={classes.tdTokenData}>
                  <div className={classes.tokenSymbol}>
                    <img src={`https://polygondex.com/track/i/coinicons/by_0x/polygon/${rToken.mdtTokenAddr}.png`}
                      alt="" className={classes.tokenIcon}
                      onError={(e)=>{
                        e.target.onerror = null; e.target.src="https://polygondex.com/track/i/coinicons/missingicon.png"
                      }}
                    />
                    {rToken.mdtTokenSymbol}
                  </div>
                  <div className={classes.dashVol}>
                    <span className={classes.volLabel}>vol: </span>
                    ${kFormatter(rToken.VolumeUSD_24hr)}
                  </div>
                </td>
                <td className={classes.tdTVL24}>
                  <div className={classes.totValLocked}>
                    ${kFormatter(rToken.current_TVL_USD)}
                  </div>
                  <div className={(rToken.TVL_USD_24hr > 0) ? classes.gainNumTVL : classes.negNumTVL}>${kFormatter(rToken.TVL_USD_24hr)}</div>
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