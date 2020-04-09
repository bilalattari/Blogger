/* eslint-disable */

import React, { Fragment } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import { Icon, Input, Button } from 'react-native-elements';
import CustomButton from '../Component/Button';
import firebase from '../utils/firebase'
import FirebaseLib from 'react-native-firebase'
import { connect } from 'react-redux'
import { loginUser } from '../redux/actions/authActions'
import CustomHeader from '../Component/header';
import { themeColor, pinkColor } from '../Constant/index';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
class SignUp extends React.Component {
  constructor(props) {
    super(props);
     this.state = {
       loader : false
     }
  }
  static navigationOptions = {
    header: null,
  };
  googleLogin = async () => {
    GoogleSignin.configure({
      webClientId: '1030461806167-rt41rc3og2qq2i4sn22vk0psn0apbscv.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
    });

    try {
      await GoogleSignin.signOut();
      const userInfo = await GoogleSignin.signIn();
      this.setState({loader : true})
      let value = (await GoogleSignin.getTokens({ idToken: userInfo.idToken }))
      const credential = FirebaseLib.auth.GoogleAuthProvider.credential(value.idToken);
      const firebaseUserCredential = await FirebaseLib.auth().signInWithCredential(credential);
      const googleUid = firebaseUserCredential.user.uid
      const response = await firebase.getDocument('Users', googleUid)
      let userObj = {}
      if (response.exists) {
        userObj = response.data();
        this.props.loginUser(userObj)
        this.props.navigation.navigate('App')
        this.setState({loader : false})
      }else{
        userObj = {
          userName: firebaseUserCredential.user.displayName.toLowerCase(),
          email: firebaseUserCredential.user.email,
          photoUrl: firebaseUserCredential.user.photoURL,
          userId: googleUid,
          followers: [],
          following: [],
          userPackage: 'none',
          userType: 'free',
          fontFamily : 'NotoSans-Regular',
          deleted: false,
          createdAt: Date.now(),
          country: null
        }
        await firebase.setDocument('Users', googleUid, userObj)
        this.props.loginUser(userObj)
        this.props.navigation.navigate('BlogCategory') 
        this.setState({loader : false})
      }
      // // console.log(credential, 'credential')
      // FirebaseLib.auth().signInWithCredential(credential).then((user) => {
      //   console.log("Sign In Success", user);
      // }).catch((err) => console.log(err))

    } catch (error) {
      this.setState({loader : false})
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  }
  render() {
    const { navigation } = this.props;
    return (
      <View style={{ backgroundColor: '#323643', flex: 1 }}>
        <View
          style={{
            height: 100,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginHorizontal: 15,
          }}>
          <Text style={{ color: '#fff', fontSize: 25, fontWeight: 'bold' }}>
            Sign Up
          </Text>
          <Icon
            type={'font-awesome'}
            name={'angle-left'}
            color={'#fff'}
            containerStyle={{ marginTop: 8 }}
            size={25}
          />
        </View>
        {/* <CustomHeader navigation={navigation} title={'Sign Up'} /> */}

        <ScrollView></ScrollView>
        <View style={{ justifyContent: 'flex-end', marginVertical: 25 }}>
          <Text style={styles.bottomLink}>SIGN UP WIDTH</Text>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-around',
              marginVertical: 12,
            }}>
            <CustomButton
              onPress={() => this.props.navigation.navigate('CreateAccount')}
              containerStyle={{ width: 160 }}
              title={'Facebook'}
              backgroundColor={'#3b5998'}
            />
            <CustomButton
              onPress={this.googleLogin}
              containerStyle={{ width: 160 }}
              title={'Google'}
              backgroundColor={'#00aced'}
            />
          </View>
          <Text style={styles.bottomLink}>OR</Text>
          <CustomButton
            onPress={() => this.props.navigation.navigate('EmailAccount')}
            containerStyle={{ width: '90%' }}
            title={'Sign Up With Email'}
            backgroundColor={pinkColor}
          />
        </View>

        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('SignIn')}
          style={{ flexDirection: 'row', height: 50 }}>
          <Text style={{ color: '#ccc', paddingLeft: 25 }}>
            Already Member ?<Text style={{ color: pinkColor }}> Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
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
    width: 170,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#323643',
    borderColor: '#fff',
    borderWidth: 0.5,
    marginHorizontal: 6,
  },
  bottomLink: {
    fontSize: 12,
    color: '#ccc',
    paddingLeft: 25,
    marginVertical: 12,
  },
  line: { flex: 1, height: 0.5, borderWidth: 0.3, borderColor: '#ccc' },
});
const mapDispatchToProps = (dispatch) => {
  return {
    loginUser: (userData) => dispatch(loginUser(userData))
  }
}
const mapStateToProps = (state) => {
  return {
    userObj: state.auth.user
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp)
