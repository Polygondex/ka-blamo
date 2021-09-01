import React, {Fragment} from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import * as TableHeaderEnum from "../enums/TableHeaderEnum";
import moment from "moment";

const useStyles = makeStyles({
  tableContainer: {
    border: '1px solid #a59393',
    background: 'black',
    borderRadius: '10px',
    margin: '8px',
    padding: '0 5px 5px',
    boxShadow: '3px 3px 3px #000',
    minWidth: '280px',
    display: 'inline-block',
    position: 'relative',
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
    position: 'sticky',
    top: '0',
    display: 'flex',
    alignItems: 'center'
  },
  columnHeaders : {
    fontSize: '11px',
    color: '#afafaf',
    textDecoration: 'underline',
    padding: '5px 0 5px 0px',
  },
  syncIndicator: {
    textAlign: 'center'
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
  tdDexData: {
    padding: '5px 4px 5px 5px',
    color: 'white',
    width: '50%'
  },
  dashDexTitle: {
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    fontWeight: '600',
    fontSize: '16px',
  },
  tokenIcon: {
    height: '17px',
    width: '17px',
    margin: '3px 6px 3px 3px'
  },
  tdTVL24: {
    padding: '5px 4px 5px 5px',
    color: 'white',
    width: '15%',
    textAlign: 'end'
  },
  totValLocked: {
    color: 'white',
    fontSize: '13px',
    paddingBottom: '8px'
  },
  tdVolume: {
    padding: '5px 4px 5px 5px',
    width: '5%',
  },
  dexSyncCol: {
    width: '25px'
  },
  dexVolColHeader: {
    color: '#f8e39b',
    width: '30%'
  },
  dashDexVol24: {
    fontSize: '22px',
    fontWeight: '400',
    color: '#f8e39b',
  },
  dexTVLCol: {
    width: '18%'
  }
});

const mFormatter = (num) => {
  return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000000).toFixed(1)) : num.toFixed(2);
}

const DexTable = ({filteredTableData, tableHeaderData, apeMode}) => {
  console.log(filteredTableData)
  const classes = useStyles();
  const [tableData] = React.useState(filteredTableData);

  const renderTableTitleIcon = () => {
    if (tableHeaderData === TableHeaderEnum.TOP_DEXs){
      return (
          <h2 className={classes.tableHeader}>
            <i className="fas fa-exchange-alt" style={{color:'white', marginRight:'8px', fontSize: '22px'}}/>
            Top Polygon DEXs
          </h2>
      )
    }
  }

  return (
      <div className={apeMode ? classes.tableContainerApeMode : classes.tableContainer}>

        {renderTableTitleIcon()}
        <table className={classes.genTable}>
          <tbody>
          <tr>
            <th className={`${classes.dexSyncCol} ${classes.columnHeaders}`}>sync</th>
            <th className={` ${classes.columnHeaders}`}>dex</th>
            <th className={`${classes.dexVolColHeader} ${classes.columnHeaders}`}>24hr $Vol <br/> $millions</th>
            <th className={`${classes.dexTVLCol} ${classes.columnHeaders}`}>$TVL <br/> $millions</th>
          </tr>
          {
            tableData.map((dex, index) => {

              const iconAddress = `https://polygondex.com/track/i/coinicons/${dex.DexName}.png`
              return <tr  key={index}>
                <td className={classes.syncIndicator}>
                  <i style={dex.str_syncDiff.includes('good') ? {color:'green'} : dex.str_syncDiff.includes('ok') ? {color:'yellow'} : {color:'red'}} className="fas fa-circle"></i>
                </td>
                <td className={classes.tdDexData}>
                  <div className={classes.dashDexTitle}>
                    <img src={iconAddress}
                         alt="" className={classes.tokenIcon}
                         onError={(e)=>{
                           e.target.onerror = null; e.target.src="https://polygondex.com/track/i/coinicons/missingicon.png"
                         }}
                    />
                    {dex.DexName_Display}
                  </div>
                </td>
                <td className={classes.tdVolume}>
                  <div className={classes.dashDexVol24}>
                    ${mFormatter(dex.Volume24hrs)}
                  </div>
                </td>
                <td className={classes.tdTVL24}>
                  <div className={classes.totValLocked}>
                    ${mFormatter(dex.max_TotalLiquidityUSD)}
                  </div>
                  <div className={(dex.TVL24hrs > 0) ? classes.gainNumTVL : classes.negNumTVL}>
                    {(dex.TVL24hrs > 0) ? '+' : null}
                    {mFormatter(dex.TVL24hrs)}
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
export default DexTable;