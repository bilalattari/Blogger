/* eslint-disable */

import React, { Fragment } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  BackHandler,
  CameraRoll,
  Image,
  Platform,
  AppRegistry,
  TextInput,
  Slider,
  Dimensions,
} from 'react-native';
import { Icon, Input, Button, } from 'react-native-elements';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import { request, PERMISSIONS, RESULTS, check } from 'react-native-permissions';
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-controls';
import Spinner from 'react-native-loading-spinner-overlay';
import { Picker } from 'native-base';
import { themeColor, pinkColor } from '../Constant';
import CustomButton from '../Component/Button';
import firebase from '../utils/firebase';
const dimensions = Dimensions.get('window');
import Modal from 'react-native-modal';
import Loader from '../Component/Loader'
import ControlPanel from '../screens/ControlPanel';
import Drawer from 'react-native-drawer';
import { NavigationEvents } from 'react-navigation';
import DocumentPicker from 'react-native-document-picker';
import TrackPlayer, { ProgressComponent } from 'react-native-track-player';
TrackPlayer.setupPlayer();

const windowHeight = dimensions.height;
const windowWidth = dimensions.width;

class PostBlog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      blogTitle: '',
      blog: '',
      videoPath: '',
      path: '',
      controls: false,
      paused: true,
      hidePlayPause: true,
      hideSeekbar: true,
      fullScreenHeight: null,
      fullScreenWidth: null,
      loading: false,
      selected: '',
      position: 0,
      bufferedPosition: 0,
      duration: 0,
      audioPath: "",
      AudioStatus: true,
      CurrentPlayTitle: '',
      CurrentPlayArtist: '',
      CurrentPlayImage: require('../assets/player/poster.jpg'),
      Volume: 60,
      blogsCategory: [
        { name: "Photography", image: require('../assets/interest/photography.jpg'), selected: false },
        { name: "Food", image: require('../assets/interest/food.jpg'), selected: false },
        { name: "Health", image: require('../assets/interest/health.jpg'), selected: false },
        { name: "Lifestyle", image: require('../assets/interest/lifestyle.jpg'), selected: false },
        { name: "Politics", image: require('../assets/interest/politics.jpg'), selected: false },
        { name: "Sports", image: require('../assets/interest/sports.jpg'), selected: false },
        { name: "Travel", image: require('../assets/interest/music.jpg'), selected: false },
        { name: "Music", image: require('../assets/interest/photography.jpg'), selected: false },
        { name: "Business", image: require('../assets/interest/business.jpg'), selected: false },
      ],
    };
  }
  static navigationOptions = {
    header: null,
  };
  closeControlPanel = () => {
    this._drawer.close();
  };
  openControlPanel = () => {
    this._drawer.open();
  };
  componentWillMount() {
    this.UpdateTrack();
  }
  async componentDidMount() {
    const { userObj } = this.props;
    TrackPlayer.updateOptions({
      stopWithApp: true,
      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
      ]
    });
    this.UpdateTrackUI();
    BackHandler.addEventListener('hardwareBackPress', this.savingDraft);
    const response = await firebase.getDocument('Drafts', userObj.userId);
    if (response.data()) {
      const blog = response.data().blog;
      const blogTitle = response.data().blogTitle;
      this.setState({ blog, blogTitle });
    }


  }
  togglePlayback = async () => {
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (currentTrack == null) {
      TrackPlayer.reset();
      await TrackPlayer.add({ url: this.state.audioPath });
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
  UpdateTrack = async () => {
    var current_id = await TrackPlayer.getCurrentTrack();
    if (current_id) {
      var track = await TrackPlayer.getTrack(current_id);
      this.setState({
        CurrentPlayTitle: this.state.CurrentPlayTitle ? this.state.CurrentPlayTitle : '',
        CurrentPlayArtist: this.state.CurrentPlayArtist ? this.state.CurrentPlayArtist : '',
        CurrentPlayImage: { uri: this.state.audioPath },
      });
    } else {
      this.setState({
        CurrentPlayTitle: this.state.CurrentPlayTitle ? this.state.CurrentPlayTitle : '',
        CurrentPlayArtist: this.state.CurrentPlayArtist ? this.state.CurrentPlayArtist : '',
        CurrentPlayImage: { uri: this.state.audioPath },
      });
    }
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

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.savingDraft);
  }

  onValueChange(value) {
    this.setState({
      selected: value,
    });
  }

  async publishBlog() {
    const { blogTitle, blog, mime, data, path, videoPath, selected, audioPath } = this.state;
    const { userObj } = this.props;
    // if(!blogTitle || !blog || (!path || !videoPath) ) return alert('All Feilds are required')
    if (!blogTitle) return alert('All Feilds are required');
    if (!blog) return alert('All Feilds are required');
    if (!selected) return alert('All Feilds are required');
    if (!videoPath && !path && !audioPath) return alert('All Feilds are required');

    this.setState({ loading: true });

    const blogData = {
      blogTitle,
      blog,
      userId: userObj.userId,
      imageUrl: '',
      videoUrl: '',
      audioUrl: '',
      category: selected,
      createdAt: Date.now(),
      deleted: false,
      likes: [],
      audioPath: "",
      comments: []
    };
    try {
      if (path) {
        const imageUrl = await firebase.uploadImage(path, userObj.userId);
        blogData.imageUrl = imageUrl;
      }
      if (videoPath) {
        const videoUrl = await firebase.uploadImage(videoPath, userObj.userId);
        blogData.videoUrl = videoUrl;
      }
      if (audioPath) {
        const audioUrl = await firebase.uploadImage(audioPath, userObj.userId);
        blogData.audioUrl = audioUrl;
      }
      await firebase.addDocument('Blog', blogData);
      alert('Published');
      this.setState({ blog: '', blogTitle: '', path: '' });
      await firebase.deleteDoc('Drafts', userObj.userId);
      this.props.navigation.goBack();
    } catch (e) {
      alert(e.message);
    }
    this.setState({ loading: false });
  }

  savingDraft = async () => {
    const { blogTitle, blog } = this.state;
    const { userObj } = this.props;
    if (!blogTitle && !blog) {
      return this.props.navigation.goBack();
    }
    const blogData = {
      blogTitle,
      blog,
      userId: userObj.userId,
      mime: '',
      showModel: false,
      data: '',
    };

    const response = await firebase.setDocument(
      'Drafts',
      userObj.userId,
      blogData,
    );
    alert('Saved To Draft');
    this.props.navigation.goBack();
  };
  back() {
    this.savingDraft();
  }

  galleryPermissionAndroid() {
    return request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
  }
  videoIsReady() {
    this.setState({ hidePlayPause: false, hideSeekbar: false });
  }

  async uploadMedia() {
    this.setState({ showModel: false })
    if (Platform.OS === 'android') {
      const result = await this.galleryPermissionAndroid();
      if (result !== RESULTS.GRANTED) return;
    }
    try {
      const image = await ImagePicker.openPicker({
        mediaType: 'photo',
        // width: 235,
        // height: 235,
        includeBase64: true,
        cropping: true,
      });
      this.setState({ path: image.path, videoPath: '' });
    } catch (e) {
      alert(e.message)
    }
  }


  async uploadVideo() {
    this.setState({ showModel: false })
    if (Platform.OS === 'android') {
      const result = await this.galleryPermissionAndroid();
      if (result !== RESULTS.GRANTED) return;
    }
    try {
      const video = await ImagePicker.openPicker({
        mediaType: 'video',
      });
      this.setState({ videoPath: video.path, path: '' });
    }
    catch (e) {
      console.log('Error', e.message)
      alert(e.message)
    }
  }
  uploadAudio = async () => {
    this.setState({ showModel: false })
    if (Platform.OS === 'android') {
      const result = await this.galleryPermissionAndroid();
      if (result !== RESULTS.GRANTED) return;
    }
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.audio],
      });
      this.setState({ audioPath: res.uri }, () => this.togglePlayback())
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }

  render() {
    const { navigation, fontfamily } = this.props;
    const {
      blogTitle,
      blog,
      mime,
      data,
      path,
      blogsCategory,
      videoPath,
      showModel,
      fullScreenHeight,
      fullScreenWidth,
      loading,
      selected
    } = this.state;
    const { position, bufferedPosition, duration } = this.state
    console.log(position, bufferedPosition, duration, 'position, bufferedPosition, duration')
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
          main: { opacity: (2 - ratio) / 2 },
        })}
        content={<ControlPanel />}>
        <NavigationEvents onDidBlur={() => this.closeControlPanel()} />
        <ScrollView stickyHeaderIndices={[0]} style={{ backgroundColor: '#323643', flex: 1 }}>
          <CustomHeader
            home
            title={'POST BLOG'}
            // icon={true}
            navigation={navigation}
            onPress={() => this.openControlPanel()}
          />
          <Loader isVisible={loading} />
          {/* {
          showModel ? */}
          <Modal
            isVisible={showModel}
            onBackdropPress={() => this.setState({ showModel: false })}
            onBackButtonPress={() => this.setState({ showModel: false })}>
            <View
              style={{
                height: 210,
                width: '90%',
                justifyContent: 'space-around',
                borderRadius: 5,
                backgroundColor: themeColor,
              }}>
              <CustomButton width={'85%'}
                buttonStyle={styles.border}
                onPress={() => this.uploadMedia()} title={'Upload Images'} />
              <CustomButton width={'85%'}
                buttonStyle={styles.border}
                onPress={() => this.uploadVideo()} title={'Upload Video'} />
              <CustomButton width={'85%'}
                buttonStyle={styles.border}
                onPress={() => this.uploadAudio()} title={'Upload Audio'} />
            </View>
          </Modal>
          {/* : null
        } */}
          {/* {!fullScreenHeight && (
          <View
            style={{
              height: 100,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginHorizontal: 15,
            }}>
            <Text
              style={{
                color: '#fff',
                fontSize: 25,
                fontWeight: 'bold',
                marginTop: 12,
              }}>
              Blog
            </Text>
            <Icon
              type={'font-awesome'}
              name={'angle-left'}
              color={'#fff'}
              containerStyle={{ marginTop: 8 }}
              size={25}
            />
          </View>
        )} */}
          {!fullScreenHeight && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 12,
                marginVertical: 12,
              }}>
              <CustomButton
                fontFamily={fontfamily}
                title={'Close'}
                buttonStyle={{ borderColor: '#ccc', borderWidth: 1 }}
                onPress={() => this.back()}
              />
              <CustomButton
                title={'Publish'}
                fontFamily={fontfamily}
                backgroundColor={pinkColor}
                onPress={() => this.publishBlog()}
              />
            </View>
          )}
          {!fullScreenHeight && (
            <>
              <TextInput
                placeholder={'Title'}
                value={blogTitle}
                placeholderTextColor={'#fff'}
                multiline={true}
                numberOfLines={2}
                underlineColorAndroid={themeColor}
                style={{
                  // textAlign: 'center',
                  color: '#fff',
                  fontWeight: 'bold',
                  minHeight: 80,
                  paddingLeft: 12,
                  fontFamily: fontfamily,
                  textDecorationLine: "none",
                  borderBottomColor: '#ccc',
                  borderBottomWidth: 1,
                  letterSpacing: 2,
                  textDecorationLine: "none",
                  fontSize: 20,
                }}
                onChangeText={text => this.setState({ blogTitle: text })}
              />
              <Input
                value={blog}
                multiline={true}
                numberOfLines={13}
                onChangeText={text => this.setState({ blog: text })}
                placeholder={'Your Blog'}
                placeholderTextColor={'#fff'}
                inputStyle={{ color: '#fff', letterSpacing: 2, fontFamily: fontfamily }}
              />
              <Picker
                note
                mode="dropdown"
                style={{ width: '96%', color: '#fff', alignSelf: 'center', fontWeight: "bold", fontFamily: fontfamily }}
                selectedValue={this.state.selected}
                placeholderIconColor={'#fff'}
                itemTextStyle={{ fontWeight: "bold" }}
                itemStyle={{ height: 40, fontFamily: fontfamily }}
                onValueChange={this.onValueChange.bind(this)}>
                <Picker.Item label="Select Category" value="" />
                {
                  blogsCategory.map((data, index) =>
                    <Picker.Item key={index} label={data.name} value={data.name.toLowerCase()} />
                  )
                }
              </Picker>
            </>
          )}
          {!!path && !fullScreenHeight && (
            <View style={{ alignItems: 'center', marginVertical: 10 }}>
              <Image source={{ uri: path }} style={{ width: 180, height: 180, borderRadius: 5 }} />
            </View>
          )}
          {!!videoPath && (
            <View
              style={{
                textAlign: 'center',
                alignItems: 'center',
                marginVertical: 10,
              }}>
              {Platform.OS === 'ios' ? (
                <Video
                  source={{ uri: videoPath }}
                  style={{ width: 250, height: 250, backgroundColor: 'black' }}
                  paused={true}
                  pictureInPicture={true}
                  controls={true}
                />
              ) : (
                  <VideoPlayer
                    source={{ uri: videoPath }}
                    videoStyle={{
                      width: '100%',
                      height: fullScreenHeight ? fullScreenHeight : 200,
                    }}
                    style={{
                      width: '100%',
                      height: fullScreenHeight ? fullScreenHeight : 200,
                    }}
                    disableVolume={true}
                    fullscreen={true}
                    paused={this.state.paused}
                    onLoad={() => this.videoIsReady()}
                    disablePlayPause={this.state.hidePlayPause}
                    disableSeekbar={this.state.hideSeekbar}
                    disableBack={true}
                    onEnterFullscreen={() =>
                      this.setState({
                        fullScreenHeight: windowHeight,
                        fullScreenWidth: windowWidth,
                      })
                    }
                    onExitFullscreen={() =>
                      this.setState({ fullScreenHeight: null, fullScreenWidth: null })
                    }
                  />
                )}
            </View>
          )}
          {!fullScreenHeight && (
            <CustomButton
              title={'Upload'}
              fontFamily={fontfamily}
              buttonStyle={{
                borderColor: '#ccc',
                borderWidth: 1,
                marginVertical: 21,
              }}
              width={'90%'}
              onPress={() => this.setState({ showModel: true })}
            />
          )}
          {
            this.state.audioPath !== "" ?
              <View style={{ justifyContent: 'center', flex: 2, alignItems: 'center' }}>
                <TrackStatus navigation={this.props.navigation} />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity onPress={() => this.togglePlayback()}
                    style={{ height: 40, width: 50 }} activeOpacity={1}>
                    <Icon type={'font-awesome'} name={this.state.AudioStatus ? 'play' : 'pause'}
                      color={'#fff'} size={25} />
                  </TouchableOpacity>
                </View>
              </View> : null
          }
        </ScrollView>
      </Drawer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColor,
  },
  border: { borderRadius: 4, borderColor: '#ccc', borderWidth: 0.5 }
});

const mapDispatchToProps = dispatch => {
  return {};
};
const mapStateToProps = state => {
  return {
    userObj: state.auth.user,
    fontfamily: state.font.fontFamily

  };
};
export default connect(mapStateToProps, mapDispatchToProps)(PostBlog);



export class TrackStatus extends ProgressComponent {
  state = {
    duration: 0,
    isSeeking: false,
    position: 0,
    SliderDisable: true
  }
  formatTime(seconds) {
    if (this.state.SliderDisable) {
      this.TrackSlider();
    }
    return seconds > 3600
      ?
      [
        parseInt(seconds / 60 / 60),
        parseInt(seconds / 60 % 60),
        parseInt(seconds % 60)
      ].join(":").replace(/\b(\d)\b/g, "0$1")
      :
      [
        parseInt(seconds / 60 % 60),
        parseInt(seconds % 60)
      ].join(":").replace(/\b(\d)\b/g, "0$1")
  }

  componentDidMount() {
    this.timehandler = setInterval(() => {
      if (this.props.navigation.isFocused()) {
        TrackPlayer.getDuration().then(
          duration => this.setState({ duration }),
        )
        TrackPlayer.getPosition().then(
          position => this.setState({ position }),
        )
      }
    },
      1000)
    // this.TrackSlider();
  }

  startTimeHandler = () => {

  }

  disableSlider = () => {
    this.setState({
      SliderDisable: false
    }, () => {
      if (this.timehandler) {
        clearTimeout(this.timehandler)
        this.timehandler = 0
      }
    });
  }
  TrackSlider = async () => {
    if (await TrackPlayer.getState() == 2) {
      this.setState({
        SliderDisable: false
      });
    } else if (await TrackPlayer.getState() == 3) {
      this.setState({
        SliderDisable: false
      });
    } else if (await TrackPlayer.getState() == 0) {
      this.setState({
        SliderDisable: true
      });
    }
  }
  componentWillUnmount() {
    // if (this.timehandler) {
    clearInterval(this.timehandler)
    // this.timehandler = 0
    // }
  }
  render() {
    return (
      <View>
        <View style={{ flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center' }}>
          {
            !this.props.profile ?
              <Text style={{ color: 'white', backgroundColor: 'transparent', width: 40,
               textAlign: 'center', fontSize: 12 }}>
                {/* { this.state.isSeeking ? this.formatTime(this.seek) : this.formatTime(this.state.position) } */}
                {this.formatTime(this.state.position)}
              </Text> : null
          }
          <Slider
            minimumValue={0}
            maximumValue={this.state.duration}
            thumbTintColor='#FFFFFF'
            minimumTrackTintColor='#000000'
            maximumTrackTintColor='#808080'
            step={1}
            disabled={this.state.SliderDisable}
            onValueChange={val => {
              TrackPlayer.pause();
              this.seek = val;
              this.setState({ isSeeking: true })
            }}
            onSlidingComplete={val => {
              TrackPlayer.play();
              this.setState(() => {
                TrackPlayer.seekTo(this.seek);
                this.position = this.seek;
              })
            }}
            // value={this.state.isSeeking ? this.seek : this.state.position}
            value={this.state.position}
            style={{ width: !this.props.profile ?  '75%' : "100%" }}
          />
          {
            !this.props.profile ?
              <Text style= {{ color: 'white', backgroundColor: 'transparent', width: 40,
              textAlign: 'center', fontSize: 12}}>{this.formatTime(this.state.duration)}</Text> : null}
        </View>
      </View>
    )
  }
}