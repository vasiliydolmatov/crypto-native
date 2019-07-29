import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
  Picker,
  Text,
  Button
} from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import AnimatedLoader from "react-native-animated-loader";

import exchanges from '../currencies';

export default function HomeScreen() {
  const [myCurrency, setMyCurrency] = useState('USD');
  const [status, setStatus] = useState('CLEAN'); // CLEAN, LOADING, COMPLETED
  const [data, setData] = useState(null);

  const fetchData = () => {
    setStatus('LOADING');
    fetch(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?convert=${myCurrency}`, {
      method: 'GET',
      headers: {
        'X-CMC_PRO_API_KEY': 'af51c66d-f65b-42b6-86ec-d0107a191ba3'
      }
    })
    .then(response => response.json())
    .then(dataRaw => {
      const data = [];
      dataRaw.data.map(cryptoData => {
        data.push([
          `${cryptoData.symbol} (${cryptoData.name})`,
          cryptoData.quote[myCurrency].price
        ]);
      });
      setData(data);
      setStatus('COMPLETED');
    }).catch(err => console.log('Err', err));
  };

  const renderSelector = (stateName, stateFoo) => {
    return (
        <View style={styles.selectorContainer}>
          <Text style={styles.selectorLabel}>My Currency</Text>
          <Picker
              selectedValue={stateName}
              style={{height: 50, width: 100}}
              onValueChange={(itemValue) => {
                stateFoo(itemValue);
              }

              }>
            {exchanges['currency'].map(currency =>  <Picker.Item label={currency.code} value={currency.code} key={currency.code}/>)}
          </Picker>
        </View>
    )
  };

  const renderTable = () => {
    const tableHead = ['Crypto', 'Price'];
    return (
        <View>
          <Text style={styles.tableTitle}>{myCurrency}</Text>
          <Table>
            <Row data={tableHead} style={styles.tableHeader} key={1}/>
            <Rows data={data} />
          </Table>
        </View>
    );
  };

  const renderLoader = () => (
      <AnimatedLoader
          visible={true}
          overlayColor="rgba(255,255,255,0.75)"
          speed={1}
          animationStyle={{width: 100, height: 100}}
      />
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
        {renderSelector(myCurrency, setMyCurrency)}
        <Button title="Find" onPress={fetchData} />
        <View style={{marginTop: 30}}>
          {status === 'COMPLETED' && renderTable()}
          {status === 'LOADING' && renderLoader()}
          {status === 'CLEAN' && <Text>Select your currency</Text>}
        </View>
      </ScrollView>
    </View>
  );
}

HomeScreen.navigationOptions = {
  header: null,
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 30
  },
  selectorContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  selectorLabel: {
    marginTop: 'auto',
    marginBottom: 'auto',
    marginRight: 3
  },
  tableTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20
  },
  tableHeader: {
    backgroundColor: '#5CB8B8'
  },
});
