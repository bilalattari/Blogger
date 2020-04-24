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
  Dimensions,
} from 'react-native';
import { SearchBar, Icon } from 'react-native-elements';
import CustomInput from '../Component/Input';
import CustomButton from '../Component/Button';
import CustomHeader from '../Component/header';
import { SwipeListView } from 'react-native-swipe-list-view';
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-controls';
import firebaseLib from 'react-native-firebase';
import { connect } from 'react-redux';
import Loader from '../Component/Loader'
// import Spinner from 'react-native-loading-spinner-overlay';
import ControlPanel from '../screens/ControlPanel';
import Drawer from 'react-native-drawer';
import { themeColor, pinkColor } from '../Constant';
import Text from '../Component/Text'
import ImageViewer from '../Component/ImageViewer'
import TrackPlayer, { ProgressComponent } from 'react-native-track-player';
import { TrackStatus } from './PostBlog'
TrackPlayer.setupPlayer();
const dimensions = Dimensions.get('window');
const windowHeight = dimensions.height;

class BlogDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      follow: false,
      fullScreenHeight: null,
      loading: false,
      showImageZoom: false,
      imageUrl: '',
      AudioStatus: true
    };
  }
  static navigationOptions = {
    header: null,
  };
  componentDidMount() {
    // this.props.navigation.addListener('didBlur', () => this.closeControlPanel())
  }
  videoIsReady() {
    this.setState({ hidePlayPause: false, hideSeekbar: false });
  }
  _icon = (name, color) => (
    <TouchableOpacity>
      <Icon
        type={'font-awesome'}
        name={name}
        color={color}
        containerStyle={{ marginHorizontal: 12 }}
      />
    </TouchableOpacity>
  );

  async unFollow(otherUserId) {
    const db = firebaseLib.firestore();
    const FieldValue = firebaseLib.firestore.FieldValue;

    const {
      userObj: { userId },
      navigation,
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
      this.setState({ isFollowed: false });
    } catch (e) {
      alert(e.message);
    }
    this.setState({ loading: false });
  }
  closeControlPanel = () => {
    this._drawer.close();
  };
  openControlPanel = () => {
    this._drawer.open();
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
  render() {
    const { fullScreenHeight, loading, showImageZoom } = this.state;
    const { navigation, fontfamily, userObj: { userId } } = this.props;
    const data = this.props.navigation.state.params.data;
    let { follow } = this.state;
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
        <ScrollView style={{ backgroundColor: '#323643', flex: 1 }}>
          <ImageViewer
            isVisible={this.state.showImageZoom}
            imageUrl={this.state.imageUrl}
            onCancel={() => this.setState({ showImageZoom: false, imageUrl: "" })}
          />
          <Loader isVisible={loading} />
          <View>
            <CustomHeader
              fontFamily={fontfamily}
              title={'BLOG'}
              navigation={navigation}
              home={true}
              onPress={() => this.openControlPanel()}
            // bookmark={true}
            />
            <View style={styles.title}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={
                    data.userObj && data.userObj.photoUrl
                      ? { uri: data.userObj.photoUrl }
                      : require('../assets/avatar.png')
                  }
                  style={styles.imageStyle}
                />
                <Text fontFamily={fontfamily} text={data.userObj && data.userObj.userName ? data.userObj.userName : ''} bold={true} />
              </View>

            </View>
          </View>
          {/* )} */}

          {!!data.audioUrl && (
            <View style={{
              flex: 1, height: 100, backgroundColor: '#000', marginVertical: 12,
              width: '97%', justifyContent: 'center', alignSelf: "center", borderRadius: 12
            }}
            >
              <TrackStatus navigation={this.props.navigation} />
              <TouchableOpacity onPress={() => this.togglePlayback(data.audioUrl)}
                style={{
                  justifyContent: "center",
                  alignSelf: "center", marginTop: 5
                }} activeOpacity={1}>
                <Icon type={'font-awesome'}
                  name={this.state.AudioStatus ? 'play' : 'pause'}
                  color={'#fff'} size={25} />
              </TouchableOpacity>
            </View>
          )}

          {!!data.imageUrl && (
            <TouchableOpacity onPress={() => this.setState({ showImageZoom: true, imageUrl: data.imageUrl })}>
              <Image
                source={{ uri: data.imageUrl, }}
                style={{
                  height: 200,
                  width: '97%',
                  alignSelf: 'center',
                  marginVertical: 11,
                  borderRadius: 12,
                }}
              />
            </TouchableOpacity>
          )}
          {!!data.videoUrl && (
            <View
              style={{ display: 'flex', alignItems: 'center', marginVertical: 10 }}>
              {Platform.OS === 'ios' ? (
                <Video
                  source={{ uri: data.videoUrl }}
                  style={{ width: 250, height: 250, backgroundColor: 'black' }}
                  paused={true}
                  pictureInPicture={true}
                  controls={true}
                />
              ) : (
                  <VideoPlayer
                    source={{ uri: data.videoUrl }}
                    videoStyle={{
                      width: '100%',
                      height: fullScreenHeight ? fullScreenHeight : 250,
                    }}
                    style={{
                      width: '100%',
                      height: fullScreenHeight ? fullScreenHeight : 250,
                    }}
                    disableVolume={true}
                    fullscreen={true}
                    paused={this.state.paused}
                    onLoad={() => this.videoIsReady()}
                    disablePlayPause={this.state.hidePlayPause}
                    disableSeekbar={this.state.hideSeekbar}
                    disableBack={true}
                    onEnterFullscreen={() =>
                      this.setState({ fullScreenHeight: windowHeight })
                    }
                    onExitFullscreen={() => this.setState({ fullScreenHeight: null })}
                  />
                )}
            </View>
          )}

          {/* {!fullScreenHeight && ( */}
          <View>
            <Text fontFamily={fontfamily} align={'left'} text={data.blogTitle} font={20} bold={true}
              style={{
                paddingLeft: 12,
                marginVertical: 12,
              }} />
            <Text fontFamily={fontfamily} align={'left'} text={data.blog} font={20}
              style={{
                paddingLeft: 12,
                marginVertical: 12,
              }} />
          </View>
          {/* )} */}
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
    marginHorizontal: 12,
    resizeMode: 'contain',
  },
  title: {
    flexDirection: 'row',
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  blogHeading: {
    color: '#fff',
    fontSize: 19,
    fontWeight: 'bold',
    paddingLeft: 6,
    lineHeight: 26,
    marginVertical: 8,
  },
  likes: {
    color: '#ccc',
    paddingLeft: 12,
    paddingBottom: 4,
    borderBottomColor: '#ccc',
    borderBottomWidth: 0.5,
  },
});
const mapDispatchToProps = dispatch => {
  return {
    loginUser: userData => dispatch(loginUser(userData)),
  };
};
const mapStateToProps = state => {
  return {
    userObj: state.auth.user,
    fontfamily: state.font.fontFamily
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(BlogDetail);
