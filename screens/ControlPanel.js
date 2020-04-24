/* eslint-disable */

import React, { Fragment } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import { pinkColor } from '../Constant';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { logoutUser } from '../redux/actions/authActions';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import { Icon } from 'react-native-elements'
import Text from '../Component/Text'
let Height = Dimensions.get('screen').height
class ControlPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  static navigationOptions = {
    header: null,
  };
  async logout() {
    LoginManager.logOut();
    this.props.logoutUser();
    this.props.navigation.navigate('Auth');
    const data = await AccessToken.getCurrentAccessToken();
  }

  menuButtons = (name, route, link, type, icon) => (
    <TouchableOpacity
      style={{
        padding: Height / 56,
        flexDirection: "row",
        margin: 2,
        alignItems: 'center',
      }}
      onPress={() => this.props.navigation.navigate(route, { link })}>
      <Icon type={type ? type : "font-awesome"} name={icon} color={'#fff'}
        iconStyle={{ paddingTop: 2 }}
        containerStyle={{ paddingRight: 4, }} size={20} />
      <Text fontFamily={this.props.fontfamily} text={name} style={{ color: '#fff', fontWeight: 'bold', paddingLeft: 12 }} />
    </TouchableOpacity>
  );
  render() {
    const state = this.state;
    return (
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={['#FF6B98', '#FE787E', '#FE8663']}
        style={{ flex: 1, justifyContent: 'center' }}
      >
        <View style={{ flex: 1, justifyContent: "center", }}>
          {/* <Image source = {require('../assets/logo.jpeg')}
             style = {{height : 300 , width : 300 , resizeMode : "contain"}} /> */}
          {/* {this.menuButtons('Blogs', 'Blog')} */}
          {/* {this.menuButtons('Profile', 'Profile')} */}
          {/* {this.menuButtons('BLOG', 'Blog', true)} */}
          {/* {this.menuButtons('Messages', 'Messages')} */}
          {/* {this.menuButtons('MY ADDRESSES' , 'MyAddress')} */}
          {/* {this.menuButtons('ADD PHOTO' , 'AddPhoto')} */}
          {/* {this.menuButtons('Post Blog', 'PostBlog')} */}
          {this.menuButtons('My Orders', 'MyOrders', '', undefined, 'shopping-cart')}
          {/* {this.menuButtons('Shop', 'Shop')} */}
          {this.menuButtons('Search Bloggers', 'SearchUsers', '', 'material-icons', 'search')}
          {this.menuButtons('Add Product', 'AddProduct', '', 'entypo', 'add-to-list')}
          {/* {this.menuButtons('Select Blog', 'SelectBlog')} */}
          {/* {this.menuButtons('Privacy', 'Privacy')} */}
          {this.menuButtons('Subscription', 'Payment', '', 'material-icons', 'payment')}
          {this.menuButtons('Privacy Ploicy', 'Privacy', '', undefined, 'file-text-o')}
          {this.menuButtons('Terms and Conditions', 'Terms', '', undefined, 'file-text-o')}
          {/* {this.menuButtons('Support' , 'Support')} */}
          <TouchableOpacity
            style={{
              borderBottomColor: '#bbb',
              borderBottomWidth: 0.5,
              padding: 12,
              flexDirection: "row",
              margin: 2,
              alignItems: 'center',
            }}
            onPress={() => this.logout()}>
            <Icon type={"antdesign"} name={'logout'} color={'#fff'}
              iconStyle={{ paddingTop: 2 }} />
            <Text
              fontFamily={this.props.fontfamily}
              text={'Logout'} style={{ color: '#fff', fontWeight: 'bold', paddingLeft: 12 }} />
          </TouchableOpacity>
        </View>
      </LinearGradient >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: pinkColor,
  },
  amountInput: {
    width: '92%',
    borderColor: '#D8D8D8',
    borderRadius: 5,
    borderWidth: 0.5,
    alignSelf: 'center',
    marginLeft: 17,
    paddingLeft: 6,
  },
  pickerHeading: { paddingLeft: '6%', fontWeight: '700', marginTop: 6 },
});
const mapDispatchToProps = dispatch => {
  return {
    logoutUser: userData => dispatch(logoutUser(userData)),
  };
};
const mapStateToProps = state => {
  return {
    userObj: state.auth.user,
    fontfamily: state.font.fontFamily
  };
};

export default withNavigation(
  connect(mapStateToProps, mapDispatchToProps)(ControlPanel),
);
