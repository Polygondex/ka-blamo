import React from 'react';
import './App.css';
import NavBar from './layout/NavBar';

import { Button } from '@material-ui/core';
import { useMoralis } from 'react-moralis';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { XGrid } from '@material-ui/x-grid';
const axios = require('axios');


const useStyles = makeStyles({
  table: {
    minWidth: 650
  },
  generalGridStyle: {
    color: 'white'
  },
  welcomeMsg: {
    margin: '12px',
    textAlign: 'center'
  },
  tableContainer: {
    border: '1px solid var(--box-border-color)',
    background: 'var(--box-bg-color)',
    borderRadius: '10px',
    margin: '12px',
    padding: '5px',
    boxShadow: '3px 3px 3px #000',
    width: '33%',
    display: 'inline-block',
  },
  genTable: {
    width: '100%'
  },
  tableHeader: {
    padding: '7px',
    margin: '1px',
    background: '#000',
    borderRadius: '7px 7px 0 0',
    fontSize: '16px',
    lineHeight: '27px',
    minWidth: '270px',
  },
  tdPriceChg: {
    width: '75px',
    borderTop: '1px dotted #656565',
    padding: '5px 4px 5px 5px'
  },
  dashPriceChg: {

  },
  gainNum: {
    color: '#02C079'
  },
  negNum: {
    color: 'red'
  },
  dashPrice: {
    textAlign: 'right',
    whiteSpace: 'nowrap'
  },
  tdTokenData: {
    borderTop: '1px dotted #656565',
    padding: '5px 4px 5px 5px'
  },
  tokenSymbol: {
    color: '#97dfff'
  },
  dashVol: {

  },
  tdTVL24: {
    borderTop: '1px dotted #656565',
    padding: '5px 4px 5px 5px'
  },
  totValLocked: {

  },
  tvlChange: {

  },
  tdTVLTitle: {
    borderTop: '1px dotted #656565',
    padding: '5px 4px 5px 5px'
  },
  tvl: {
    writingMode: 'vertical-rl',
    textOrientation: 'upright',
  }
});

export default function App() {
  const classes = useStyles();
  const [chainData, setChainData] = React.useState([]);
  const { authenticate, isAuthenticated, user, Moralis, logout, isInitialized } = useMoralis();
  const [pDexData, setPDexData] = React.useState([]);
  const [gainersSortedData, setGainersSortedData] = React.useState([]);
  const [losersSortedData, setLosersSortedData] = React.useState([]);
  console.log(isInitialized);

  const displayUserName = () => {
    if (!isAuthenticated) return '...Please connect MetaMask with Authenticate Button';
    return user.get('username');
  };

  const getRecords = async () => {
    if (isAuthenticated) {
      const query = new Moralis.Query('EthTransactions');
      query.equalTo('from_address', user.get('ethAddress'));
      const results = await query.find();
      const temp = [];
      await results.forEach((point) => {
        const tempObj = {
          id: point.attributes.transaction_index,
          ...point.attributes
        };
        console.log(tempObj);
        temp.push(tempObj);
        console.log(temp);
      });
      await setChainData(temp);
      console.log(temp);
      await console.log(results[0].attributes);
    } else {
      return;
    }
  };

  const getPDEXData = () => {
    axios.get('https://polygondex.com/track/api/v1.aspx?apiMe=1')
    .then(function (response) {
      // handle success
      console.log(response);
      setGainersSortedData([...response.data.sort((a, b) => {
        if (a.Price_PctChg_24hr > b.Price_PctChg_24hr) {
          return -1;
        }
        if (a.Price_PctChg_24hr < b.Price_PctChg_24hr) {
          return 1;
        }
        // a must be equal to b
        return 0;
      })])
      setLosersSortedData([...response.data.sort((a, b) => {
        if (a.Price_PctChg_24hr < b.Price_PctChg_24hr) {
          return -1;
        }
        if (a.Price_PctChg_24hr > b.Price_PctChg_24hr) {
          return 1;
        }
        // a must be equal to b
        return 0;
      })])
      setPDexData(response.data);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
  }
  if (!pDexData.length) getPDEXData()

  console.log(chainData);

  const renderTable = () => {
    if (!pDexData.length) return null;
    let isApeMode = false;

    if (!isApeMode) {
      return (
          <div className={classes.tableContainer}>

            <h2 className={classes.tableHeader}>
              <i className="fa fa-arrow-circle-up" style={{color:'green', margin:'4px 8px', fontSize: '20px'}}></i>
              Top Gainers (24hrs)
            </h2>
            <table className={classes.genTable}>
              <tbody>
              {
                gainersSortedData.map((rToken, index) => {
                  //TODO: need this method
                  // let mostLiquidExchange = MATIC_DexLinks(rToken.mostLiquidExchangeID)

                  let symbolLink = "/track/token.aspx?id=" + rToken.mdtTokenAddr + "&s=" + rToken.mdtTokenSymbol + "&ex=" + rToken.mostLiquidExchangeID;
                  // let swapLink = Replace(Replace(mostLiquidExchange.url_swap, "xxxTOKEN2xxx", rToken.mdtTokenAddr), "xxxTOKEN1xxx", "ETH")
                  let tokenSymbol = (rToken.mdtTokenSymbol == "MATIC" || rToken.mdtTokenSymbol == "WMATIC") ? "USDC" : "MATIC"
                  let swapLink = "https://app.slingshot.finance/trade/m/" + rToken.mdtTokenAddr + "/" + tokenSymbol;
                  let thisEx = rToken.mostLiquidExchangeID + 'quickChart_' + rToken.mdtTokenAddr
                  let priceChange = (rToken.Price_PctChg_24hr*100).toFixed(2);
                  console.log(rToken)
                  return <tr>

                    <td className={classes.tdPriceChg}>
                      <div className={classes.dashPriceChg}>
                        <div className={(rToken.Price_PctChg_24hr > 0) ? classes.gainNum : classes.negNum}>{priceChange}%</div>
                      </div>
                      <div className={classes.dashPrice}>{rToken.current_mstbePrice}</div>
                    </td>
                    <td className={classes.tdTokenData}>
                      <div className={classes.tokenSymbol}>
                        {rToken.mdtTokenSymbol}
                      </div>
                      <div className={classes.dashVol}>vol: {rToken.VolumeUSD_24hr}</div>
                    </td>
                    <td className={classes.tdTVL24}>
                      <div className={classes.totValLocked}>
                        {rToken.current_TVL_USD}
                      </div>
                      <div className={(rToken.TVL_USD_24hr > 0) ? classes.gainNum : classes.negNum}>{rToken.TVL_USD_24hr}</div>
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
      )
    }
  }

  const renderLosersTable = () => {
    if (!pDexData.length) return null;
    let isApeMode = false;

    if (!isApeMode) {
      return (
          <div className={classes.tableContainer}>

            <h2 className={classes.tableHeader}>
              <i className="fa fa-arrow-circle-down" style={{color:'red', margin:'4px 8px', fontSize: '20px'}}></i>
              Top Gainers (24hrs)
            </h2>
            <table className={classes.genTable}>
              <tbody>
              {
                losersSortedData.map((rToken, index) => {
                  //TODO: need this method
                  // let mostLiquidExchange = MATIC_DexLinks(rToken.mostLiquidExchangeID)

                  let symbolLink = "/track/token.aspx?id=" + rToken.mdtTokenAddr + "&s=" + rToken.mdtTokenSymbol + "&ex=" + rToken.mostLiquidExchangeID;
                  // let swapLink = Replace(Replace(mostLiquidExchange.url_swap, "xxxTOKEN2xxx", rToken.mdtTokenAddr), "xxxTOKEN1xxx", "ETH")
                  let tokenSymbol = (rToken.mdtTokenSymbol == "MATIC" || rToken.mdtTokenSymbol == "WMATIC") ? "USDC" : "MATIC"
                  let swapLink = "https://app.slingshot.finance/trade/m/" + rToken.mdtTokenAddr + "/" + tokenSymbol;
                  let thisEx = rToken.mostLiquidExchangeID + 'quickChart_' + rToken.mdtTokenAddr
                  let priceChange = (rToken.Price_PctChg_24hr*100).toFixed(2);
                  console.log(rToken)
                  return <tr>

                    <td className={classes.tdPriceChg}>
                      <div className={classes.dashPriceChg}>
                        <div className={(rToken.Price_PctChg_24hr > 0) ? classes.gainNum : classes.negNum}>{priceChange}%</div>
                      </div>
                      <div className={classes.dashPrice}>{rToken.current_mstbePrice}</div>
                    </td>
                    <td className={classes.tdTokenData}>
                      <div className={classes.tokenSymbol}>
                        {rToken.mdtTokenSymbol}
                      </div>
                      <div className={classes.dashVol}>vol: {rToken.VolumeUSD_24hr}</div>
                    </td>
                    <td className={classes.tdTVL24}>
                      <div className={classes.totValLocked}>
                        {rToken.current_TVL_USD}
                      </div>
                      <div className={(rToken.TVL_USD_24hr > 0) ? classes.gainNum : classes.negNum}>{rToken.TVL_USD_24hr}</div>
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
      )
    }
  }

  const columns = [
    { title: 'block_hash', field: 'block_hash' },
    { title: 'block_number', field: 'block_number' },
    { title: 'block_timestamp name', field: 'block_timestamp' },
    { title: 'confirmed name', field: 'confirmed' },
    { title: 'createdAt', field: 'createdAt' },
    { title: 'from_address', field: 'from_address' },
    { title: 'gas', field: 'gas' },
    { title: 'gas_price name', field: 'gas_price' },
    { title: 'hash name', field: 'hash' },
    { title: 'input', field: 'input' },
    { title: 'nonce', field: 'nonce' },
    // { title: 'receipt_contract_address', field: 'receipt_contract_address' },
    { title: 'receipt_cumulative_gas_used name', field: 'receipt_cumulative_gas_used' },
    { title: 'receipt_gas_used name', field: 'receipt_gas_used' },
    // { title: 'receipt_root', field: 'receipt_root' },
    { title: 'receipt_status', field: 'receipt_status' },
    { title: 'to_address', field: 'to_address' },
    { title: 'transaction_index', field: 'transaction_index' }
  ];

  return (
    <div className={'primaryBackground'}>
      <NavBar />
      <Button style={{ background: 'lightgreen', width: '150px', margin: '30px' }} onClick={() => authenticate()}>
        Authenticate
      </Button>
      <Button style={{ background: '#F9525F', width: '150px', margin: '30px' }} onClick={() => logout()}>
        Logout
      </Button>
      <Button style={{ background: 'grey', width: '150px', margin: '30px' }} onClick={() => getRecords()}>
        Refresh Stats
      </Button>

      <h3 className={classes.welcomeMsg}>Welcome {displayUserName()}</h3>
      <div style={{ margin: 'auto', height: 800, width: '96%', backgroundColor: '#131416', color: 'white' }}>
        <XGrid
          rows={chainData}
          columns={columns}
          className={classes.generalGridStyle}
          disableColumnFilter={true}
          disableColumnMenu={true}
          // disableColumnSelector={true}
          // disableColumnReorder={true}
        />
      </div>

      {/*{renderGraph()}*/}
      {renderTable()}
      {renderLosersTable()}
    </div>
  );
}
