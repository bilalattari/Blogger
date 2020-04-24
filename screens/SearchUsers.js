/* eslint-disable */

import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SearchBar, Icon } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux';
import firebaseLib from 'react-native-firebase';
import CustomHeader from '../Component/header';
import CustomButton from '../Component/Button';
import firebase from '../utils/firebase';
import { themeColor, pinkColor } from '../Constant';
import Loader from '../Component/Loader';
import ControlPanel from '../screens/ControlPanel';
import Drawer from 'react-native-drawer';
import { NavigationEvents } from 'react-navigation';
import { otherUserProfile } from '../redux/actions/profileAction';
class SearchUsers extends Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [],
      loading: false,
      user: '',
    };
    this.allUsers = []
  }
  static navigationOptions = {
    header: null,
  };


  search = async () => {
    let { user, users } = this.state;
    if (!user) return alert('Field is required');
    users = [];
    const db = firebaseLib.firestore();
    try {
      this.setState({ loading: true });
      const userData = await db
        .collection('Users')
        .where('userName', '==', user.toLowerCase())
        .get();

      userData.docs.forEach(item => {
        if (!item.data().deleted) {
          users.push(item.data())
        }
      });
      if (!users.length) {
        alert('No User Found')
        this.setState({ users: this.allUsers })
      }
      this.setState({ users });
    } catch (e) {
      alert(e.message);
    }
    this.setState({ loading: false });
  };

  getAllUsers = async () => {
    var users = [];
    const db = firebaseLib.firestore();
    try {
      const userData = await db.collection('Users').orderBy('email').limit(20).get();
      userData.docs.forEach(item => {
        if (!item.data().deleted) {
          users.unshift(item.data())
        }
      });
      this.allUsers = users
      this.setState({ users });
    }
    catch (err) {
      console.log(err)
    }
  }
  startChat(otherUserId) {
    this.props.navigation.navigate('Chat', { otherUserId });
  }

  feedBackListItem = (item, index) => {
    const { navigation } = this.props;

    return (
      this.props.userObj.userId !== item.userId && (
        <TouchableOpacity
          onPress={() => {
            // this.props.otherUserProfile(item),
            navigation.navigate('Otheruser', { data: item })
          }
          }
          style={styles.itemContainer}>
          <View>
            {item.photoUrl ? (
              <Image
                source={{ uri: item.photoUrl }}
                style={styles.imageStyle}
              />
            ) : (
                <Image
                  source={require('../assets/avatar.png')}
                  style={styles.imageStyle}
                />
              )}
            <Icon
              type={'font-awesome'}
              name={index % 2 !== 1 ? 'heart-o' : 'user-plus'}
              color={'#fff'}
              size={10}
              containerStyle={[
                styles.iconContainer,
                {
                  backgroundColor: index % 2 !== 1 ? pinkColor : '#72CEBA',
                },
              ]}
            />
          </View>
          <View style={{
            flex: 1, justifyContent: 'space-between', paddingRight: 25
            , alignItems: "center", flexDirection: "row"
          }}>
            <View style={styles.userContainer}>
              <Text style={styles.userName}>{item.userName}</Text>
            </View>
            <TouchableOpacity
              style={styles.chatBtnContainer}
              onPress={() => this.startChat(`${item.userId}`)}>
              <Text style={styles.chatBtn}>Chat</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )
    );
  };

  componentDidMount() {
    this.getAllUsers()
  }

  closeControlPanel = () => {
    this._drawer.close();
  };
  openControlPanel = () => {
    this._drawer.open();
  };
  render() {
    const { navigation, userObj } = this.props;
    const { users, loading, user } = this.state;
    return (
      // <Drawer
      //   ref={ref => (this._drawer = ref)}
      //   type="overlay"
      //   tapToClose={true}
      //   openDrawerOffset={0.2} // 20% gap on the right side of drawer
      //   panCloseMask={0.2}
      //   closedDrawerOffset={-3}
      //   // styles={styles.drawer}
      //   tweenHandler={ratio => ({
      //     main: { opacity: (2 - ratio) / 2 },
      //   })}
      //   content={<ControlPanel />}>
      //   <NavigationEvents onDidBlur={() => this.closeControlPanel()} />
      <ScrollView stickyHeaderIndices={[0]} style={{ backgroundColor: '#323643', flex: 1 }}>
        {/* <CustomHeader
            home
            title={'Search'}
            // icon={true}
            navigation={navigation}
            onPress={() => this.openControlPanel()}
          /> */}
        <CustomHeader navigation={navigation} title={'SEARCH'} />

        <Loader isVisible={loading} />
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 4 }}>
            <SearchBar
              containerStyle={{
                margin: 8,
                borderRadius: 5,
                borderTopColor: themeColor,
                borderBottomColor: themeColor,
              }}
              value={user}
              onClear={() => alert('12 1 212 ')}
              placeholder={'Search'}
              inputContainerStyle={{ backgroundColor: '#fff' }}
              onChangeText={user => this.setState({ user: user }, () => {
                if (this.state.user.length === 0) {
                  this.setState({ users: this.allUsers })
                }
              })}
              onEndEditing={() => {
                if (this.state.user.length > 2) {
                  this.search()
                }
              }}
              onCancel={() => this.setState({ user: "" })}
            />
          </View>
          {
            user !== '' ?
              <View
                onPress={this.search}
                style={{ flex: 1, justifyContent: 'center', alignItems: "center" }}>
                <TouchableOpacity style={{
                  height: 50, width: 50, justifyContent: 'center',
                  alignItems: "center", backgroundColor: pinkColor, borderRadius: 4
                }}>
                  <Icon type={'font-awesome'} name={'search'} color={'#fff'} />
                </TouchableOpacity>
              </View> : null
          }
        </View>
        {!!users.length && (
          <FlatList
            data={users}
            keyExtractor={item => item}
            renderItem={({ item, index }) => this.feedBackListItem(item, index)}
          />
        )}
      </ScrollView>
      // </Drawer>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    // otherUserProfile: info => dispatch(otherUserProfile(info)),
  };
};
const mapStateToProps = state => {
  return {
    userObj: state.auth.user,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchUsers);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3 },
  main: { paddingLeft: 3 },
  imageStyle: {
    height: 45,
    width: 45,
    borderRadius: 125,
    marginLeft: 12,
    resizeMode: 'contain',
  },
  itemContainer: {
    minHeight: 80,
    backgroundColor: '#444B60',
    flexDirection: 'row',
    marginHorizontal: 12,
    borderRadius: 12,
    marginVertical: 4,
    alignItems: 'center',
  },
  iconContainer: {
    height: 18,
    width: 18,
    backgroundColor: pinkColor,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -12,
    marginLeft: 8,
  },
  commentButton: { borderColor: pinkColor, borderWidth: 1, width: 150 },
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#CCC',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 50,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  arrowButton: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: pinkColor,
    justifyContent: 'center',
    alignItems: 'center',
  },

  userContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  userName: {
    color: '#fff',
    fontSize: 18,
  },
  chatBtn: {
    color: '#fff',
    fontSize: 18,
  },
});
