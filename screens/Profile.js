/* eslint-disable */

import React, { Fragment } from 'react';
import {
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Platform,
} from 'react-native';
import { SearchBar, Icon } from 'react-native-elements';
import CustomInput from '../Component/Input';
import CustomButton from '../Component/Button';
import CustomHeader from '../Component/header';
import { SwipeListView } from 'react-native-swipe-list-view';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-controls';
import { themeColor, pinkColor } from '../Constant';
import firebaseLib from 'react-native-firebase';
import Loader from '../Component/Loader'
import Text from '../Component/Text'
import ControlPanel from '../screens/ControlPanel';
import Drawer from 'react-native-drawer';
import { otherUserProfile, removeDate } from '../redux/actions/profileAction';
import { NavigationEvents } from 'react-navigation';
import TrackPlayer, { ProgressComponent } from 'react-native-track-player';
import { TrackStatus } from './PostBlog'
TrackPlayer.setupPlayer();
class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: false,
      blogs: [],
      loading: false,
      AudioStatus: true,
      isFollowed: false,
      userData: '',
      userDescription: "",
      controls: false,
      paused: true,
      hidePlayPause: true,
      hideSeekbar: true,
    };
  }
  static navigationOptions = {
    header: null,
  };
  componentDidMount = async () => {
    const { userObj, navigation, otherUser } = this.props;
    let { newData } = this.state
    let { userId } = userObj;
    this.props.navigation.addListener('didFocus', async () => {
      this.decideUser();
      // if (otherUser) {
      //   console.log(otherUser, 'otherUser')
      //   userId = otherUser.userId;
      //   if (userObj.following.indexOf(userId) !== -1) {
      //     this.setState({ isFollowed: true, loading: false });
      //   }
      // }
    })


    this.props.navigation.addListener('didBlur', async () => {
      this.props.otherUserProfile(undefined)
      // this.closeControlPanel()
    })
  }


  getUserBlogs = async (userId) => {
    console.log(userId, 'userId')
    const db = firebaseLib.firestore();
    const blogs = [];
    try {
      let userBlogs = await db
        .collection('Blog')
        .where('userId', '==', userId)
        .get();
      userBlogs = userBlogs.docs.forEach(doc => blogs.push(doc.data()));
      this.setState({ blogs, loading: false });
    } catch (e) {
      console.log('Error', e.message);
    }
  }
  statsNumber = (heading, number) => (
    <View>
      <Text fontFamily={this.props.fontfamily} text={heading} style={styles.heading} />
      <Text fontFamily={this.props.fontfamily} text={number} style={styles.number} />
    </View>
  );
  togglePlayback = async (url) => {
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (currentTrack == null) {
      TrackPlayer.reset();
      await TrackPlayer.add({ url: url });
      TrackPlayer.play();
    } else {
      if (await TrackPlayer.getState() === 2) {
        TrackPlayer.play();
      } else {
        TrackPlayer.pause();
      }
    }
    this.UpdateTrackUI();
  }
  // UpdateTrack = async () => {
  //   var current_id = await TrackPlayer.getCurrentTrack();
  //   if (current_id) {
  //     var track = await TrackPlayer.getTrack(current_id);
  //     this.setState({
  //       CurrentPlayTitle: this.state.CurrentPlayTitle ? this.state.CurrentPlayTitle : '',
  //       CurrentPlayArtist: this.state.CurrentPlayArtist ? this.state.CurrentPlayArtist : '',
  //       CurrentPlayImage: { uri: this.state.audioPath },
  //     });
  //   } else {
  //     this.setState({
  //       CurrentPlayTitle: this.state.CurrentPlayTitle ? this.state.CurrentPlayTitle : '',
  //       CurrentPlayArtist: this.state.CurrentPlayArtist ? this.state.CurrentPlayArtist : '',
  //       CurrentPlayImage: { uri: this.state.audioPath },
  //     });
  //   }
  // }
  UpdateTrackUI = async () => {
    if (await TrackPlayer.getState() == 2) {
      this.setState({
        AudioStatus: true
      });
    } else if (await TrackPlayer.getState() == 3) {
      this.setState({
        AudioStatus: false
      });
    } else if (await TrackPlayer.getState() == 6) {
      this.setState({
        AudioStatus: false
      });
    }
  }
  async follow(otherUserId) {
    const db = firebaseLib.firestore();
    const FieldValue = firebaseLib.firestore.FieldValue;

    const {
      userObj: { userId, userName, photoUrl },
      navigation,
    } = this.props;
    const { userData } = this.state;
    try {
      let obj = {
        msg: 'started following you.',
        userName: userName,
        userID: userId,
        receiver: otherUserId,
        photoUrl: photoUrl,
        type: 'follow',
        time: `${new Date().toLocaleString()}`
      }
      this.setState({ loading: true });
      await db
        .collection('Users')
        .doc(userId)
        .update({
          following: FieldValue.arrayUnion(otherUserId),
        });
      await db
        .collection('Users')
        .doc(otherUserId)
        .update({
          followers: FieldValue.arrayUnion(userId),
        });
      await db.collection("Notification").add(obj)
      if (navigation.state.params.otherUser) {
        userData.followers.push(userId);
        this.setState({ userData });
      }
      this.setState({ isFollowed: true });
    } catch (e) {
      alert(e.message);
    }
    this.setState({ loading: false });
  }

  async unFollow(otherUserId) {
    const db = firebaseLib.firestore();
    const FieldValue = firebaseLib.firestore.FieldValue;

    const {
      userObj: { userId, userName, photoUrl, userDescription },
      navigation,
    } = this.props;
    const { userData } = this.state;
    try {
      let obj = {
        msg: 'unfollowed you.',
        userName: userName,
        userID: userId,
        receiver: otherUserId,
        photoUrl: photoUrl,
        type: 'follow',
        time: `${new Date().toLocaleString()}`
      }
      this.setState({ loading: true });
      await db
        .collection('Users')
        .doc(userId)
        .update({
          following: FieldValue.arrayRemove(otherUserId),
        });
      await db
        .collection('Users')
        .doc(otherUserId)
        .update({
          followers: FieldValue.arrayRemove(userId),
        });
      await db.collection("Notification").add(obj)
      if (navigation.state.params.otherUser) {
        userData.followers.splice(0, 1);
        this.setState({ userData });
      }
      this.setState({ isFollowed: false });
    } catch (e) {
      alert(e.message);
    }
    this.setState({ loading: false });
  }

  decideUser = newData => {
    const { userObj, otherUser } = this.props;
    let userData = '';
    if (!!userObj.userId) {
      if (otherUser) {
        userData = otherUser;
      } else {
        userData = newData ? newData : userObj;
      }
      console.log(userData.userId, 'userDatauserDatauserData')
      this.setState({ userData }, () => this.getUserBlogs(userData.userId));
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.userObj) {
      this.decideUser(nextProps.userObj);
    }
  }
  videoIsReady() {
    this.setState({ hidePlayPause: false, hideSeekbar: false });
  }

  navigateToDetails(blog, userData) {
    const { navigation } = this.props;
    blog.userObj = userData;
    navigation.navigate('BlogDetail', { data: blog, navigateTo: 'Profile' });
  }
  closeControlPanel = () => {
    this._drawer.close();
  };
  openControlPanel = () => {
    this._drawer.open();
  };
  render() {
    const { navigation, userObj, fontfamily } = this.props;
    if (!userObj) {
      navigation.navigate('Auth');
      return null;
    }
    let { comments, blogs, loading, isFollowed, userData } = this.state;
    const { userName, followers, following, userId, photoUrl, userDescription } = userData;

    return (
      <Drawer
        ref={ref => (this._drawer = ref)}
        type="overlay"
        tapToClose={true}
        openDrawerOffset={0.2} // 20% gap on the right side of drawer
        panCloseMask={0.2}
        closedDrawerOffset={-3}
        styles={styles.drawer}
        tweenHandler={ratio => ({
          main: { opacity: (2 - ratio) / 2 },
        })}
        content={<ControlPanel />}>
        <ScrollView
          stickyHeaderIndices={[0]}
          style={{ backgroundColor: '#323643', flex: 1, }}>

          <Loader isVisible={loading} />
          <CustomHeader
            home
            title={'PROFILE'}
            // icon={true}
            navigation={navigation}
            onPress={() => this.openControlPanel()}
          />
          {/* <CustomHeader
          title={'PROFILE'}
          navigation={navigation} /> */}
          <View style={{
            flexDirection: "row", justifyContent: "space-around",
            marginVertical: 25
          }}>
            <View style={{ alignSelf: 'center', alignItems: 'center' }}>
              <View style={styles.imageWrapper}>
                {photoUrl ? (
                  <TouchableOpacity onPress = {()=> navigation.navigate('EditProfile')} >
                    <Image
                      source={{ uri: photoUrl }}
                      style={[styles.imageStyle, { borderRadius: 125 }]}
                    />
                  </TouchableOpacity>
                ) : (
                    <Image
                      source={require('../assets/avatar.png')}
                      style={[styles.imageStyle, { borderRadius: 125 }]}
                    />
                  )}
              </View>
              <Text fontFamily={fontfamily} text={userName} bold = {true} style={{ fontSize: 18,  marginTop: 8 }} />
              <Text fontFamily={fontfamily} text={'Graphic Designer'} style={{ color: '#ccc', }} />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 25 }}>
              <TouchableOpacity style={{
                height: 50, width: 50, borderRadius: 125, justifyContent: "center", alignItems: "center",
                borderColor: '#ccc', borderWidth: 0.5, marginLeft: 4
              }} onPress={() => this.props.navigation.navigate('EditProfile')}>
                <Icon type={'material-community'} name={'pencil-outline'}
                  color={"#ccc"} size={30} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.statsView}>
            {!!userData && this.statsNumber('FOLLOWING', following.length)}
            {!!userData && this.statsNumber('FOLLOWER', followers.length)}
          </View>
          <View style={{
            borderBottomColor: 'grey',
            borderBottomWidth: 1, padding: 12, paddingVertical: 16
          }}>
            <Text fontFamily={fontfamily} text={"DESCRIPTION"} bold = {true} align={"left"} style={{
              margin: 6, color: "#fff",
              fontSize: 20, letterSpacing: 1
            }} />
            <Text fontFamily={fontfamily}
              text={userObj.userDescription ? userObj.userDescription : "Please enter your description"} align={'left'} color={'#ccc'} font={18} />
          </View>
          {!!blogs.length &&
            <Text text={'BLOGS'} bold = {true} align={"left"} style={{
              padding: 6, color: "#fff",
              fontSize: 20, letterSpacing: 1, paddingLeft: 12
            }} />
          }
          <View
            style={{
              backgroundColor: themeColor,
              flexWrap: 'wrap',
              zIndex: -1200,
              flexDirection: 'row',
            }}>
            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', zIndex: -1200 }}>
              {!!blogs.length &&
                blogs.map((data, index) => {
                  return (
                    data.imageUrl || data.videoUrl !== "" || data.audioUrl ?
                      <TouchableOpacity
                        key={index}
                        style={{ height: 120, width: '32%', margin: 2, borderRadius: 7, overflow: "hidden" }}
                        onPress={() => this.navigateToDetails(data, userData)}
                      >
                        {
                          data.videoUrl !== "" ?
                            <TouchableOpacity
                              style={{
                                height: 120, width: '100%', backgroundColor: '#000',
                                justifyContent: "center", alignItems: "center"
                              }}
                              onPress={() => this.navigateToDetails(data, userData)}>
                              <Icon type={'antdesign'} name={'playcircleo'} color={'#fff'} size={45} />
                            </TouchableOpacity>
                            :
                            data.audioUrl ?
                              <TouchableOpacity
                                style={{
                                  height: 120, width: '100%', backgroundColor: '#000',
                                  justifyContent: "center", alignItems: "center"
                                }}
                                onPress={() => this.navigateToDetails(data, userData)}>
                                <Icon type={'font-awesome'} name={'microphone'} color={'#fff'} size={41} />
                              </TouchableOpacity>
                              :
                              <Image
                                source={{ uri: data.imageUrl }}
                                style={{
                                  height: '100%',
                                  width: '100%',
                                  borderRadius: 5,
                                  resizeMode: 'stretch',
                                }}
                              />
                        }
                      </TouchableOpacity> : null
                  );
                })}
            </View>
          </View>
        </ScrollView>
      </Drawer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageStyle: {
    height: 85,
    width: 85,
    borderRadius: 125,
    marginHorizontal: 12,
    resizeMode: 'contain',
  },
  imageWrapper: {
    height: 100,
    width: 100,
    borderRadius: 125,
    borderColor: pinkColor,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 3,
    height: 100,
    borderTopColor: 'grey',
    borderBottomColor: 'grey',
    borderWidth: 1,
  },
  heading: { color: 'grey', fontSize: 14, fontWeight: 'bold', margin: 4 },
  number: { color: '#fff', fontSize: 20, textAlign: 'center' },
});
const mapDispatchToProps = dispatch => {
  return {
    otherUserProfile: info => dispatch(otherUserProfile(info)),
    removeDate: () => dispatch(removeDate())
  };
};
const mapStateToProps = state => {
  return {
    userObj: state.auth.user,
    fontfamily: state.font.fontFamily,

  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Profile);
