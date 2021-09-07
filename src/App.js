import React, {useEffect} from 'react';
import './App.css';
import NavBar from './layout/NavBar';

import { Button } from '@material-ui/core';
import { useMoralis } from 'react-moralis';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { XGrid } from '@material-ui/x-grid';
import TokenTable from "./components/TokenTable";
import * as TableHeaderEnum from "./enums/TableHeaderEnum";
import DexTable from "./components/DexTable";
import MainCharts from "./components/MainCharts";
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
  divMainDish: {
    width: '100%'
  },
  homeLeftCol: {
    width: '20%',
    verticalAlign:'top',
    display: 'table-cell'
  },
  homeRightCol: {
    width: '80%',
    verticalAlign:'top',
    display: 'table-cell'
  },
  majorCharts: {
    width: '100%',
    padding: '8px 0',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

export default function App() {
  const classes = useStyles();
  const [chainData, setChainData] = React.useState([]);
  const { authenticate, isAuthenticated, user, Moralis, logout, isInitialized } = useMoralis();
  const [apeMode, setApeMode] = React.useState(false);
  const [gainers24HRSortedData, setGainers24HRSortedData] = React.useState([]);
  const [gainers10MINSortedData, setGainers10MINSortedData] = React.useState([]);
  const [losers24HRSortedData, setLosers24HRSortedData] = React.useState([]);
  const [tvlGainers24HRSortedData, setTVLGainers24HRSortedData] = React.useState([]);
  const [tvlLosers24HRSortedData, setTVLLosers24HRSortedData] = React.useState([]);
  const [mostActiveSortedData, setMostActiveSortedData] = React.useState([]);

  const [mostActiveApeModeSortedData, setMostActiveApeModeSortedData] = React.useState([]);
  const [newestListingApeModeSortedData, setNewestListingApeModeSortedData] = React.useState([]);
  const [gainers24HRApeModeSortedData, setGainers24HRApeModeSortedData] = React.useState([]);

  const [polygonDexSortedData, setPolygonDexSortedData] = React.useState([]);
  useEffect(() => {
    getPDEXTokenData()
      .catch(errResp => console.error(errResp));
    getPDEXData()
      .catch(errResp => console.error(errResp));
    console.log(polygonDexSortedData)
  }, []);

  useEffect(() => {
    setLosers24HRSortedData([...gainers24HRSortedData].reverse())
  }, [gainers24HRSortedData]);

  useEffect(() => {
    setTVLLosers24HRSortedData([...tvlGainers24HRSortedData].reverse())
  }, [tvlGainers24HRSortedData]);

  useEffect(() => {
    if (apeMode) getApeModeData().catch(errResp => console.error(errResp));
  }, [apeMode]);


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
        temp.push(tempObj);
      });
      await setChainData(temp);
      console.log(temp);
      await console.log(results[0].attributes);
    } else {
      return;
    }
  };

  const sortGainers = (a, b, propToSortBy) => {
    if (a[propToSortBy] > b[propToSortBy]) return -1;
    if (a[propToSortBy] < b[propToSortBy]) return 1;
    return 0;
  }

  const sortByListingDate = (a, b) => {
    let trimmedA = a?.DateListed.substring(6, a.DateListed.length - 2);
    let trimmedB = b?.DateListed.substring(6, b.DateListed.length - 2);
    if (trimmedA > trimmedB) return -1;
    if (trimmedA < trimmedB) return 1;
    return 0;
  }

  const getPDEXData = async () => {
    const pDexResp = await axios.get('https://polygondex.com/track/api/v1.aspx?apiMe=dexlist');
    if (pDexResp.data) {
      console.log(pDexResp.data)
      setPolygonDexSortedData([...pDexResp.data.sort((a, b) => {
        return sortGainers(a, b, 'Volume24hrs');
      })]);
    }
  }

  const getPDEXTokenData = async () => {
    const pDexTokenResp = await axios.get('https://polygondex.com/track/api/v1.aspx?apiMe=1');
    if (pDexTokenResp.data) {
      const filterLowTvl = [...pDexTokenResp.data.filter(token => token.current_TVL_USD >= 25000)]
      setGainers24HRSortedData([...filterLowTvl.sort((a, b) => {
        return sortGainers(a, b, 'Price_PctChg_24hr');
      })]);
      setGainers10MINSortedData([...filterLowTvl.sort((a, b) => {
        return sortGainers(a, b, 'Price_PctChg_10min');
      })]);
      setMostActiveSortedData([...filterLowTvl.sort((a, b) => {
        return sortGainers(a, b, 'VolumeUSD_24hr');
      })]);
      setTVLGainers24HRSortedData([...pDexTokenResp.data.sort((a, b) => {
        return sortGainers(a, b, 'TVL_USD_24hr');
      })]);
      console.log(pDexTokenResp.data)
    }
  }

  const getApeModeData = async () => {
    // TODO Will need to change for updating
    if (gainers24HRApeModeSortedData.length && mostActiveApeModeSortedData.length && newestListingApeModeSortedData.length) return;
    const apeModeData = await axios.get('https://polygondex.com/track/api/v1.aspx?apiMe=ape');
    if (apeModeData.data) {

      setGainers24HRApeModeSortedData([...apeModeData.data.sort((a, b) => {
        return sortGainers(a, b, 'Price_PctChg_24hr');
      })]);
      setMostActiveApeModeSortedData([...apeModeData.data.sort((a, b) => {
        return sortGainers(a, b, 'VolumeUSD_24hr');
      })]);
      setNewestListingApeModeSortedData([...apeModeData.data.sort((a, b) => {
        return sortByListingDate(a, b);
      })]);

      console.log(apeModeData.data)
    }
  }

  const renderGenericDexTable = (tableData, headerEnum) => {
    if (!tableData.length) return;
    return (
      <DexTable
          filteredTableData={tableData}
          tableHeaderData={headerEnum}
      />
    )
  }
  const renderGenericTokenTable = (tableData, headerEnum) => {
    if (!tableData.length) return;
    return (
      <TokenTable
          filteredTableData={tableData}
          tableHeaderData={headerEnum}
          apeMode={apeMode}
          key={headerEnum}
      />
    )
  }

  const apeModeCharts = [
    renderGenericTokenTable(gainers24HRApeModeSortedData, TableHeaderEnum.GAINER_24HR),
    renderGenericTokenTable(newestListingApeModeSortedData, TableHeaderEnum.NEWEST_LISTING),
    renderGenericTokenTable(mostActiveApeModeSortedData, TableHeaderEnum.ACTIVE_24HR)
  ];
  const regularCharts = [
    renderGenericTokenTable(gainers24HRSortedData, TableHeaderEnum.GAINER_24HR),
    renderGenericTokenTable(losers24HRSortedData, TableHeaderEnum.LOSER_24HR),
    renderGenericTokenTable(mostActiveSortedData, TableHeaderEnum.ACTIVE_24HR),
    renderGenericTokenTable(gainers10MINSortedData, TableHeaderEnum.GAINER_10MIN),
    renderGenericTokenTable(tvlGainers24HRSortedData, TableHeaderEnum.TVL_UP_24HR),
    renderGenericTokenTable(tvlLosers24HRSortedData, TableHeaderEnum.TVL_DOWN_24HR),
  ];


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

  // setTimeout(function () { loadMajorsChart("ethereum", "ETH", "/track/i/majors-eth.png") }, 500);
  // setTimeout(function () { loadMajorsChart("matic-network", "MATIC", "/track/i/majors-matic.png") }, 700);
  // setTimeout(function () { loadMajorsChart("quick", "QUICK", "/track/i/majors-quick.png") }, 1000);


  return (
    <div className={'primaryBackground'}>
      <NavBar tokenList={gainers24HRSortedData} setApeMode={setApeMode} apeMode={apeMode}/>
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
      {/*<div style={{ margin: 'auto', height: 800, width: '96%', backgroundColor: '#131416', color: 'white' }}>*/}
      {/*  <XGrid*/}
      {/*    rows={chainData}*/}
      {/*    columns={columns}*/}
      {/*    className={classes.generalGridStyle}*/}
      {/*    disableColumnFilter={true}*/}
      {/*    disableColumnMenu={true}*/}
      {/*  />*/}
      {/*</div>*/}
      <div className={classes.majorCharts}>

        <MainCharts
            coinID={"ethereum"}
            symbol={"ETH"}
            iconURL={"/track/i/majors-eth.png"}
        />
        <MainCharts
            coinID={"matic-network"}
            symbol={"MATIC"}
            iconURL={"/track/i/majors-matic.png"}
        />
        <MainCharts
            coinID={"quick"}
            symbol={"QUICK"}
            iconURL={"/track/i/majors-quick.png"}
        />
      </div>
      <div className={classes.divMainDish}>
        <div className={classes.homeLeftCol}>
          {renderGenericDexTable(polygonDexSortedData, TableHeaderEnum.TOP_DEXs)}

        </div>
        <div className={classes.homeRightCol}>
          {!apeMode ? regularCharts : apeModeCharts}
        </div>


      </div>

    </div>
  );
}
