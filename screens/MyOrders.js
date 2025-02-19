/* eslint-disable */

import React, { Fragment } from 'react';
import {
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
  FlatList,
  Text, Dimensions,
  Switch,
  ScrollView,
} from 'react-native';
import { SearchBar, Icon, Input } from 'react-native-elements';
import CustomButton from '../Component/Button';
import CustomHeader from '../Component/header';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Picker, Button } from 'native-base';
import { themeColor, pinkColor } from '../Constant';
import countries from '../Constant/countries';
import firebaseLib from 'react-native-firebase';
import { connect } from 'react-redux';
import firebase from '../utils/firebase';
import Spinner from 'react-native-loading-spinner-overlay';
import Loader from '../Component/Loader'

let screenHeight = Dimensions.get('screen').height
class MyOrders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: '1',
      switch: false,
      myorders: [],
      loading: false
    };
  }
  static navigationOptions = {
    header: null,
  };
  onValueChange(value) {
    this.setState({
      selected: value,
    });
  }

  async componentDidMount() {
    const {
      userObj: { userId },
    } = this.props;
    const { myorders } = this.state;
    const db = firebaseLib.firestore();
    // let data = []
    try {
      const userOrders = await db
        .collection('Orders')
        .where('userId', '==', userId)
        .get();
      userOrders.docs.forEach(snapShot => {
        myorders.push({ ...snapShot.data(), orderId: snapShot.id });
        // data.push(snapShot.data())
      });
      const orders = [];
      myorders.map(data => {
        data.products.map(product => {
          orders.push({ ...product, orderId: data.orderId });
        });
      });
      this.setState({ myorders: orders });
    } catch (e) {
      console.log('Error', e.messgae);
      alert(e.message);
    }
  }

  async recieved(item) {
    const { myorders } = this.state;
    const { navigation } = this.props
    try {
      this.setState({ loading: true })
      const sellerDoc = await firebase.getDocument('Users', item.sellerId);
      const sellerAccNo = sellerDoc.data().accNo;
      const objToSent = {
        accountNo: sellerAccNo,
        amount: item.price,
        email: 'jahangirfaraz98@gmail.com',
      };
      const res = await fetch('https://blogstar.app/send-mail', {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(objToSent),
      });
      const filteredOrder = myorders.filter(
        data => data.orderId === item.orderId,
      );
      const finalObj = filteredOrder.map(data => {
        if (data.id === item.id) {
          data.isRecieved = true;
        }
        return data;
      });
      await firebase.updateDoc('Orders', item.orderId, { products: finalObj });
    } catch (e) {
      alert(e);
    }
    this.setState({ loading: false })
    navigation.goBack()
  }

  render() {
    const { navigation } = this.props;
    const { myorders, loading } = this.state;
    return (
      <ScrollView
        stickyHeaderIndices={[0]}
        style={{ backgroundColor: '#323643', flex: 1 }}>
        <CustomHeader navigation={navigation} title={'My Orders'} />
       <Loader isVisible  = {loading} />
        {
          myorders.length === 0 ?
            <View style={{
              flex: 1, justifyContent: "center",
              alignItems: "center", marginTop: screenHeight / 4
            }}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Shop')}>
                <Icon type={'font-aweseme'} name={'shopping-cart'}
                  color={'#fff'} size={60} containerStyle={{ marginVertical: 25 }} />
                <CustomButton title={'Go To Shopping Page'}
                  width={220} onPress={() => this.props.navigation.navigate('Shop')}
                  backgroundColor={pinkColor} />
              </TouchableOpacity>
            </View> :

            <FlatList
              data={myorders}
              keyExtractor={item => item}
              renderItem={({ item, index }) => (
                <View style={{ flexDirection: 'row', marginVertical: 8, marginRight: 12 }}>
                  <Image source={{ uri: item.imageUrl }} style={styles.imageStyle} />
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      flex: 1,
                    }}>
                    <View>
                      <Text
                        style={{
                          paddingTop: 4,
                          color: '#fff',
                          fontSize: 16,
                          fontWeight: 'bold',
                        }}>
                        {item.productName}
                      </Text>
                      <Text style={styles.descriptionText}>{item.discription}</Text>
                    </View>
                    <View style={{ textAlign: 'center' }}>
                      <Text style={[styles.descriptionText, { paddingTop: 4 }]}>
                        {`$${item.price}`}
                      </Text>
                      <View style={{ justifyContent: "flex-end", flex: 1 }}>
                        {item.isRecieved ? (
                          <Text style={{ color: pinkColor, fontSize: 16 }}>
                            Recieved
                          </Text>
                        ) : (
                            <CustomButton
                              title={'Received'}
                              backgroundColor={pinkColor}
                              onPress={() => this.recieved(item)}
                              containerStyle={{ width: 80, height: 40, fontSize: 10, borderRadius: 5 }}
                              titleStyle={{ fontSize: 12 }}
                            />
                          )}
                      </View>
                    </View>
                  </View>
                </View>
              )}
            />
        }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageStyle: {
    height: 120,
    // backgroundColor: '#fff',
    width: 140,
    borderRadius: 12,
    marginHorizontal: 12,
    resizeMode: 'cover',
  },
  descriptionText: {
    color: '#fff',
    fontSize: 16,
    color: 'grey',
    textAlign: 'right',
  },
});

const mapDispatchToProps = dispatch => {
  return {};
};
const mapStateToProps = state => {
  return {
    userObj: state.auth.user,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(MyOrders);
