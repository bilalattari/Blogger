/* eslint-disable */

import React, { Fragment } from 'react';
import {
  StyleSheet,
  View, Dimensions,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import { Icon, Input, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { themeColor, pinkColor } from '../Constant/index';
import CustomHeader from '../Component/header';
import CustomButton from '../Component/Button';
import firebase from '../utils/firebase';
import firebaseLib from 'react-native-firebase';
import { loginUser } from '../redux/actions/authActions';
import Spinner from 'react-native-loading-spinner-overlay';
import Loader from '../Component/Loader'
const height = Dimensions.get('screen').height
const marginTop = height - 480 > 25 ? (height - 475) / 2 : 0
class EmailAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      password: null,
      confirmPassword: null,
      userName: null,
      number: null,
      fontFamily: 'NotoSans-Regular',
      country: null
    };
  }
  static navigationOptions = {
    header: null,
  };
  sText(key, value) {
    this.setState({ [key]: value });
  }
  checkValidation = () => {
    const { email, password, confirmPassword } = this.state;
    if (!email) {
      this.setState({ email: null, password: null, confirmPassword: null });
      alert('Enter Your Email');
      return true;
    }
    if (password !== confirmPassword) {
      this.setState({ password: null, confirmPassword: null });
      alert('passwords Should Match');
      return true;
    }
    if (!email || !password || !confirmPassword) {
      alert('All Fields Are Required');
      return true;
    }
  };

  async signUp() {
    const { userName, email, password, number, country, fontFamily } = this.state;
    const { navigation } = this.props;
    const db = firebaseLib.firestore();
    if (this.checkValidation()) return;
    try {
      this.setState({ loading: true });
      const isNumber = await db
        .collection('Users')
        .where('number', '==', number)
        .get();
      if (!isNumber.empty) {
        alert('this number is already associated with another account');
        this.setState({ loading: false });
        return;
      }

      const response = await firebase.signUpWithEmail(
        email,
        password,
        userName.toLowerCase(),
        number,
        fontFamily,
        country
      );
      this.props.loginUser(response);
      this.props.navigation.navigate('BlogCategory');
    } catch (e) {
      if (e.code === 'auth/email-already-in-use') {
        alert('That email address is already in use!');
      } else if (e.code === 'auth/invalid-email') {
        alert('That email address is invalid!');
      }
      else {
        alert(e.message);
      }

    }
    this.setState({ loading: false });
  }
  render() {
    const { navigation } = this.props;
    const {
      userName,
      email,
      password,
      confirmPassword,
      loading,
      number,
      country
    } = this.state;
    return (
      <ScrollView style={{ backgroundColor: '#323643', flex: 1 }}>
        <Loader isVisible={loading} />

        <CustomHeader navigation={navigation} title={'Sign Up'} />
        <View
          style={{
            alignItems: 'center', justifyContent: 'flex-end',
            marginTop: marginTop, marginHorizontal: 4
          }}>
          <Input
            placeholder={'Username'}
            placeholderTextColor={'#fff'}
            inputContainerStyle={styles.inputContainer}
            inputStyle={{ fontWeight: 'bold', color: '#fff' }}
            onChangeText={userName => this.sText('userName', userName)}
            value={userName}
          />
          <Input
            placeholder={'Email'}
            placeholderTextColor={'#fff'}
            inputContainerStyle={styles.inputContainer}
            inputStyle={{ fontWeight: 'bold', color: '#fff' }}
            onChangeText={email => this.sText('email', email)}
            value={email}
          />
          <Input
            placeholder={'Phone number with country code'}
            placeholderTextColor={'#fff'}
            inputContainerStyle={styles.inputContainer}
            inputStyle={{ fontWeight: 'bold', color: '#fff' }}
            onChangeText={number => this.sText('number', number)}
            value={number}
            keyboardType="number-name-phone-pad"
          />
          <Input
            placeholder={'Password'}
            secureTextEntry={true}
            placeholderTextColor={'#fff'}
            inputContainerStyle={styles.inputContainer}
            inputStyle={{ fontWeight: 'bold', color: '#fff' }}
            onChangeText={password => this.sText('password', password)}
            value={password}
          />
          <Input
            placeholder={'Confirm Password'}
            secureTextEntry={true}
            placeholderTextColor={'#fff'}
            inputContainerStyle={styles.inputContainer}
            inputStyle={{ fontWeight: 'bold', color: '#fff' }}
            onChangeText={confirmPassword =>
              this.sText('confirmPassword', confirmPassword)
            }
            value={confirmPassword}
          />

          <View style={{ marginVertical: 12, width: '100%' }}>
            <CustomButton
              title={'Sign Up'}
              backgroundColor={pinkColor}
              containerStyle={{ width: '90%' }}
              buttonStyle={{
                borderColor: '#ccc',
                borderWidth: 1,
                backgroundColor: '#000000',
                borderColor: '#000000',
              }}
              onPress={() => this.signUp()}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    borderColor: '#323643',
    backgroundColor: '#454B61',
    borderRadius: 7,
    paddingLeft: 12,
    marginVertical: 6,
  },
  buttonStyle: {
    width: 140,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#323643',
    borderColor: '#fff',
    borderWidth: 0.5,
    marginHorizontal: 6,
  },
  bottomLink: { fontSize: 14, fontWeight: 'bold', color: '#ccc' },
  line: { flex: 1, height: 0.5, borderWidth: 0.3, borderColor: '#ccc' },
});
const mapDispatchToProps = dispatch => {
  return {
    loginUser: userData => dispatch(loginUser(userData)),
  };
};
const mapStateToProps = state => {
  return {
    userObj: state.auth.user,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EmailAccount);
