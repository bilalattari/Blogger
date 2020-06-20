/* eslint-disable */

import React, { Fragment } from 'react';
import {
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Dimensions,
  Platform,
  Share,
  Linking,
} from 'react-native';
import { SearchBar, Icon } from 'react-native-elements';
import Text from '../Component/Text'
import CustomInput from '../Component/Input';
import CustomButton from '../Component/Button';
import CustomHeader from '../Component/header';
import { SwipeListView } from 'react-native-swipe-list-view';
import firebase from '../utils/firebase';
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-controls';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux';
import firebaseLib from 'react-native-firebase';
import { loginUser } from '../redux/actions/authActions';
import { changeFontFamily } from '../redux/actions/fontaction';
import ControlPanel from '../screens/ControlPanel';
import Drawer from 'react-native-drawer';
import { themeColor, pinkColor } from '../Constant';
import { NavigationEvents } from 'react-navigation';
import Loader from '../Component/Loader'
import TrackPlayer, { ProgressComponent } from 'react-native-track-player';
import { TrackStatus } from './PostBlog'
TrackPlayer.setupPlayer();
const dimensions = Dimensions.get('window');
const windowHeight = dimensions.height;
const windowScreen = dimensions.width;

class Blog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      follow: false,
      blogs: [],
      isBlogs: false,
      controls: false,
      paused: true,
      hidePlayPause: true,
      hideSeekbar: true,
      AudioStatus: true,
      fullScreenHeight: null,
      loading: false,
      usersData: [],
      isError: false,
      isFocused: false
    };
  }
  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    // console.log(this.props.userObj.fontFamily , '-------------')
    // this.getBlogs()
    if (this.props.userObj.fontFamily) {
      this.props.changeFontFamily(this.props.userObj.fontFamily)
    }
  }
  getBlogs = async () => {
    this.setState({ loading: true, blogs: [] });
    const {
      userObj: { userId },
    } = this.props;
    firebaseLib.notifications().onNotificationOpened(notificationOpen => {
      navigation.navigate('Messages');
      // Get information about the notification that was opened
      // const notification: Notification = notificationOpen.notification;
    });
    const notification = await firebaseLib
      .notifications()
      .getInitialNotification();
    if (notification) {
      navigation.navigate('Messages');
    }

    this.fcmToken();
    // ******************************************
    const db = firebaseLib.firestore();
    Linking.addEventListener('url', this.handleDeepLink);
    this.setState({ loading: false });
    const {
      userObj: { following, blogCategory },
      navigation,
    } = this.props;
    const usersIds = [];
    try {
      const url = await Linking.getInitialURL();
      if (url) {
        const extractPath = url.split('/');
        const path = extractPath[3];
        navigation.navigate(path);
      }
      db.collection('Users')
        .doc(userId)
        .onSnapshot(snapshot => {
          if (!snapshot.data().deleted) {
            this.props.loginUser(snapshot.data());
          }
        });
      // IF app is open using a blog shareable external link
      if (url) {
        const extractId = url.split('/');
        const id = extractId[4];
        const dbResponse = await db
          .collection('Blog')
          .doc(id)
          .get();
        const { blogs } = this.state;
        blogs.push({ id: dbResponse.id, ...dbResponse.data() });
        usersIds.push(dbResponse.data().userId);
        this.setState({ blogs, isBlogs: true, loading: false, usersIds }, () => {
          this.gettingUsersInfo();
        });
        return;
        // navigation.navigate(path)
      }
      // IF app opens directly
      else {
        if (typeof (blogCategory) !== 'object') {
          const response = await db
            .collection('Blog')
            .orderBy('createdAt', 'desc')
            .where('category', '==', blogCategory)
            .onSnapshot({ includeMetadataChanges: true }, snapShot => {
              if (snapShot.empty) {
                this.setState({ loading: false, isError: true })
                return
              }
              snapShot.docChanges.forEach(change => {
                if (change.type === 'added') {
                  const { blogs } = this.state;
                  if (
                    following.indexOf(change.doc.data().userId) !== -1 &&
                    !change.doc.data().deleted
                  ) {
                    blogs.push({ id: change.doc.id, ...change.doc.data() });
                    usersIds.push(change.doc.data().userId);
                  }
                  this.setState({ blogs: [...blogs], isBlogs: true, loading: false });
                }
                if (change.type === 'modified') {
                  const { blogs } = this.state;
                  const findedIndex = blogs.findIndex(
                    item => item.id === change.doc.id,
                  );
                  blogs[findedIndex] = { id: change.doc.id, ...change.doc.data() };

                  this.setState({ blogs, loading: false });
                }
              });
              this.setState({ usersIds, loading: false }, () => {
                this.gettingUsersInfo();
              });
            });
        }
        else {
          let blogs = []
          blogCategory.map(async (category, index) => {
            const response = await db
              .collection('Blog')
              .orderBy('createdAt', 'desc')
              .where('category', '==', category)
              .onSnapshot(snapShot => {
                if (!snapShot.empty) {
                  snapShot.docChanges.forEach(change => {
                    if (change.type === 'added') {
                      if (
                        following.indexOf(change.doc.data().userId) !== -1 &&
                        !change.doc.data().deleted
                      ) {
                        blogs.push({ id: change.doc.id, ...change.doc.data() });
                        usersIds.push(change.doc.data().userId);
                      }
                      this.setState({ blogs: [...blogs], isBlogs: true, loading: false });
                    }
                    if (change.type === 'modified') {
                      const { blogs } = this.state;
                      const findedIndex = blogs.findIndex(
                        item => item.id === change.doc.id,
                      );
                      blogs[findedIndex] = { id: change.doc.id, ...change.doc.data() };
                      this.setState({ blogs, loading: false });
                    }
                  });
                }
                // console.log('snapShot ====>' , snapShot);
                this.setState({ usersIds }, () => {
                  this.gettingUsersInfo();
                });
              });
          })
        }
      }
    } catch (e) {
      console.log('Error', e.message);
    }
    this.setState({ loading: false });
  }
  fcmToken = async () => {
    const fcm = firebaseLib.messaging();
    const db = firebaseLib.firestore();
    const {
      userObj: { userId },
    } = this.props;
    const fcmToken = await fcm.getToken();
    const per = await fcm.hasPermission();
    await fcm.requestPermission();
    if (fcmToken) {
      await firebase.updateDoc('Users', userId, { token: fcmToken });
    } else {
    }
  };

  closeControlPanel = () => {
    this._drawer.close();
  };
  openControlPanel = () => {
    this._drawer.open();
  };

  gettingUsersInfo = async () => {
    const { blogs, usersIds } = this.state;
    const db = firebaseLib.firestore();
    const usersData = [];
    const uniqueArr = [...new Set(usersIds)];
    for (var i = 0; i < uniqueArr.length; i++) {
      const users = await db
        .collection('Users')
        .doc(uniqueArr[i])
        .get();
      usersData.push(users.data());
    }
    this.setState({ usersData });
  };
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
  videoIsReady() {
    this.setState({ hidePlayPause: false, hideSeekbar: false });
  }
  navigateToDetail(item) {
    this.setState({ paused: true });
    this.props.navigation.navigate('BlogDetail', { data: item , navigateTo : 'Blog' });
  }

  async share(item) {
    try {
      const result = await Share.share({
        message: `http://blogster.android.com/Blog/${item.id}`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  }
  like = async blog => {
    const db = firebaseLib.firestore();
    const FieldValue = firebaseLib.firestore.FieldValue;
    const {
      userObj: { userId, photoUrl, userName },
    } = this.props;
    try {
      let obj = {
        msg: 'likes your blog',
        userName: userName,
        userID: userId,
        likedPost: "",
        photoUrl: photoUrl,
        type: 'like',
        receiver: blog.userId,
        time: `${new Date().toLocaleString()}`
      }
      await db
        .collection('Blog')
        .doc(blog.id)
        .update({
          likes: FieldValue.arrayUnion(userId),
        });
      await db.collection("Notification").add(obj)
    } catch (e) {
      alert(e.message);
    }
  };

  unLike = async blog => {
    const db = firebaseLib.firestore();
    const FieldValue = firebaseLib.firestore.FieldValue;
    const {
      userObj: { userId },
    } = this.props;
    try {
      await db
        .collection('Blog')
        .doc(blog.id)
        .update({
          likes: FieldValue.arrayRemove(userId),
        });
    } catch (e) {
      alert(e.message);
    }
  };

  _icon = (name, color, onPress) => {
    return (
      <TouchableOpacity onPress={onPress ? () => onPress() : ''}>
        <Icon
          type={'font-awesome'}
          name={name}
          color={color}
          containerStyle={{ marginHorizontal: 12 }}
        />
      </TouchableOpacity>
    );
  };

  blog = (item, index) => {
    const {
      userObj: { userId }, fontfamily
    } = this.props;
    const { usersData } = this.state;
    usersData.map(user => {
      if (user.userId === item.userId) {
        item.userObj = user;
      }
    });
    return (
      this.props.userObj.userId !== item.userId && (
        <TouchableOpacity key={index}
          onPress={() => this.navigateToDetail(item)}
          style={{ width: '95%', marginVertical: 12, alignSelf: "center" }}>
          {!this.state.fullScreenHeight && (
            <View style={styles.title}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={
                    item.userObj && item.userObj.photoUrl
                      ? { uri: item.userObj.photoUrl }
                      : require('../assets/avatar.png')
                  }
                  style={styles.imageStyle}
                />
                <Text fontFamily={fontfamily}
                  text={item.userObj ? item.userObj.userName : ' '} font={16} bold={true} style={{ paddingLeft: 8 }} />
              </View>
              <CustomButton
                fontFamily={fontfamily}
                title={'Following'}
                height={38
                }
                containerStyle={{ width: 105 }}
                backgroundColor={!this.state.follow ? pinkColor : themeColor}
                onPress={() => this.unFollow(item.userId)}
              />
            </View>
          )}
          {!!item.imageUrl && !this.state.fullScreenHeight && (
            <Image
              source={{ uri: item.imageUrl }}
              style={{
                height: 200,
                width: '100%',
                alignSelf: 'center',
                marginVertical: 11,
                borderRadius: 12,
              }}
            />
          )}
          {!!item.audioUrl &&
            <View style={{
              flex: 1, height: 100, backgroundColor: '#000', marginVertical: 12,
              width: '97%', justifyContent: 'center', alignSelf: "center", borderRadius: 12
            }}
            >
              <TrackStatus navigation={this.props.navigation} />
              <TouchableOpacity onPress={() => this.togglePlayback(item.audioUrl)}
                style={{
                  justifyContent: "center",
                  alignSelf: "center", marginTop: 5
                }} activeOpacity={1}>
                <Icon type={'font-awesome'} name={this.state.AudioStatus ? 'play' : 'pause'}
                  color={'#fff'} size={25} />
              </TouchableOpacity>
            </View>}
          {!!item.videoUrl && (
            <View
              style={{
                display: 'flex',
                alignItems: 'center',
                marginVertical: 10,
              }}>
              {Platform.OS === 'ios' ? (
                <Video
                  source={{ uri: item.videoUrl }}
                  style={{ width: '100%', height: 250 }}
                  paused={true}
                  pictureInPicture={true}
                  controls={true}
                  onLoad={() => this.videoIsReady()}
                  ref={ref => (this.videoRef = ref)}
                />
              ) : (
                  <VideoPlayer
                    source={{ uri: item.videoUrl }}
                    videoStyle={{
                      width: '100%',
                      height: this.state.fullScreenHeight
                        ? this.state.fullScreenHeight
                        : 250,
                    }}
                    style={{
                      width: '100%',
                      height: this.state.fullScreenHeight
                        ? this.state.fullScreenHeight
                        : 250,
                    }}
                    disableVolume={true}
                    fullscreen={false}
                    paused={this.state.paused}
                    onLoad={() => this.videoIsReady()}
                    disablePlayPause={this.state.hidePlayPause}
                    disableSeekbar={this.state.hideSeekbar}
                    disableBack={true}
                    onEnterFullscreen={() =>
                      this.setState({ fullScreenHeight: windowHeight })
                    }
                    onExitFullscreen={() =>
                      this.setState({ fullScreenHeight: null })
                    }
                  />
                )}
            </View>
          )}
          {!this.state.fullScreenHeight && (
            <TouchableOpacity onPress={() => this.navigateToDetail(item)}>
              <Text fontFamily={fontfamily}
                align={'left'} font={19} bold={true} style={styles.blogHeading} text={item.blogTitle} />
            </TouchableOpacity>
          )}
          {!this.state.fullScreenHeight && (
            <TouchableOpacity>
              <Text fontFamily={fontfamily}
                align={'left'} style={styles.likes} text={`Likes ${item.likes.length} Comments ${item.comments.length}`} />
            </TouchableOpacity>
          )}
          {!this.state.fullScreenHeight && (
            <View
              style={{
                height: 40,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View style={{ flexDirection: 'row' }}>
                {!item.likes.includes(userId)
                  ? this._icon('heart-o', pinkColor, () => this.like(item))
                  : this._icon('heart', pinkColor, () => this.unLike(item))}
                {/* {this._icon('bookmark-o', '#fff', () => this.share(item))} */}
                {this._icon('comment-o', '#fff', () =>
                  this.props.navigation.navigate('Comments', { blog: item }),
                )}
              </View>
              {/* {this._icon('ellipsis-h', '#fff')} */}
            </View>
          )}
        </TouchableOpacity>
      )
    );
  };

  async unFollow(otherUserId) {
    const db = firebaseLib.firestore();
    const FieldValue = firebaseLib.firestore.FieldValue;
    const {
      userObj: { userId },
      navigation, fontfamily
    } = this.props;
    try {
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
      this.setState({ isFollowed: false } ,()=> this.getBlogs());
    } catch (e) {
      alert(e.message);
    }
    this.setState({ loading: false });
  }
  render() {
    const {
      navigation, fontfamily,
      userObj: { following },
    } = this.props;
    let { follow, blogs, isBlogs, loading, usersData, isError } = this.state;
    // let sortedBlogs = blogs.sort((a, b) => a.createdAt < b.createdAt)
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
        <NavigationEvents onDidFocus={() => { this.getBlogs() }}
        />
        <NavigationEvents onDidBlur={() => { this.closeControlPanel() }}
        />
        <Loader isVisible={loading} />
        <ScrollView
          stickyHeaderIndices={[0]}
          style={{ backgroundColor: '#323643', flex: 1 }}>
          {!this.state.fullScreenHeight && (
            <CustomHeader
              home
              fontFamily = {fontfamily}
              title={'BLOG'}
              icon={true}
              navigation={navigation}
              onPress={() => this.openControlPanel()}
            />
          )}
          <Loader isVisible={loading} />

          {isBlogs && !!usersData.length && (
            <FlatList
              data={blogs}
              keyExtractor={item => item}
              renderItem={({ item, index }) => this.blog(item, index)}
            />
          )}
          {
            !loading ?
              blogs.length === 0 || isError ?
                <TouchableOpacity style={{
                  justifyContent: 'center', alignItems: "center",
                  flex: 1, marginTop: "50%"
                }} onPress={() => navigation.navigate('SearchUsers')}>
                  <Icon type={'material-community'} name={'blogger'} color={'#fff'} size={60} />
                  <Text fontFamily={fontfamily} style={{
                    marginTop: 30,
                  }} text={'Follow Bloggers'} font={19} color={pinkColor} align={'center'} />
                </TouchableOpacity> : null : null
          }
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
    height: 45,
    width: 45,
    borderRadius: 125,
    marginHorizontal: 2,
    resizeMode: 'contain',
  },
  title: {
    flexDirection: 'row',
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  blogHeading: {

    paddingLeft: 12,
    marginVertical: 2,
  },
  likes: {
    color: '#ccc',
    paddingLeft: 12,
    height: 30,
    justifyContent: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 0.5,
  },
  drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3 },
});
const mapDispatchToProps = dispatch => {
  return {
    loginUser: userData => dispatch(loginUser(userData)),
    changeFontFamily: fontFamily => dispatch(changeFontFamily(fontFamily)),
  };
};
const mapStateToProps = state => {
  return {
    userObj: state.auth.user,
    fontfamily: state.font.fontFamily
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Blog);
