/* eslint-disable */

import React, {Component} from 'react';
import {
  Text,
  View,
  ScrollView,
  Image,
  AsyncStorage,
  FlatList,
} from 'react-native';
import firebase from 'react-native-firebase';

import CustomButton from '../Component/Button';
import CustomHeader from '../Component/header';
import ProductContainer from '../Component/ProductContainer';
import ControlPanel from '../screens/ControlPanel';
import Drawer from 'react-native-drawer';
import {NavigationEvents} from 'react-navigation';

class Shop extends Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    products: [],
    isProducts: false,
  };
  closeControlPanel = () => {
    this._drawer.close();
  };
  openControlPanel = () => {
    this._drawer.open();
  };

  getShops = () => {
      const db = firebase.firestore();
     let products = []
      db.collection('Products')
        .orderBy('createdAt')
        .onSnapshot(snapShot => {
          snapShot.docChanges.forEach(change => {
            if (change.type === 'added') {

              if (!change.doc.data().deleted) {
                products.unshift({id: change.doc.id, ...change.doc.data()});
                this.setState({products: [...products], isProducts: true});
              }
            }
            if (change.type === 'modified') {
              console.log('Modified city: ', change.doc.data());
            }
            if (change.type === 'removed') {
              console.log('Removed city: ', change.doc.data());
            }
          });
          this.setState({products :products })
        });
  };
  render() {
    const {navigation} = this.props;
    const {products} = this.state;
    return (
      <Drawer
        ref={ref => (this._drawer = ref)}
        type="overlay"
        tapToClose={true}
        openDrawerOffset={0.2} // 20% gap on the right side of drawer
        panCloseMask={0.2}
        closedDrawerOffset={-3}
        // styles={styles.drawer}
        tweenHandler={ratio => ({
          main: {opacity: (2 - ratio) / 2},
        })}
        content={<ControlPanel />}>
        <NavigationEvents
          onDidBlur={() => {
            this.closeControlPanel();
          }}
          onDidFocus={() => {
            this.getShops();
          }}
        />
        <ScrollView
          stickyHeaderIndices={[0]}
          style={{backgroundColor: '#323643', flex: 1}}>
          <CustomHeader
            home
            shop
            title={'SHOP'}
            // icon={true}
            navigation={navigation}
            onPress={() => this.openControlPanel()}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              flexWrap: 'wrap',
            }}>
            <FlatList
              data={products}
              numColumns={2}
              renderItem={({item, index}) => {
                return (
                  <ProductContainer
                    data={item}
                    navigate={() => navigation.navigate('Detail', {data: item})}
                  />
                );
              }}
            />
           
          </View>
        </ScrollView>
      </Drawer>
    );
  }
}

export default Shop;
