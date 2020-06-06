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
import Spinner from 'react-native-loading-spinner-overlay';
import firebaseLib from 'react-native-firebase';
import { connect } from 'react-redux';
import Video from 'react-native-video';
import Text from '../Component/Text'
import VideoPlayer from 'react-native-video-controls';
import CustomHeader from '../Component/header';
import Loader from '../Component/Loader';
import { Icon } from 'react-native-elements'
import TrackPlayer, { ProgressComponent } from 'react-native-track-player';
import { TrackStatus } from './PostBlog'
import ControlPanel from '../screens/ControlPanel';
import Drawer from 'react-native-drawer';
import { NavigationEvents } from 'react-navigation';
import firebase from 'react-native-firebase';
TrackPlayer.setupPlayer();
class SelectBlog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      category: 0,
      blogsArr: [],
      errMessage: '',
      loading: true,
      selectedIndex: 0,
      controls: false,
      paused: true,
      AudioStatus: true,
      hidePlayPause: true,
      hideSeekbar: true,
      categoryList: [
        { name: "Photography", image: require('../assets/interest/photography.jpg'), selected: false },
        { name: "Food", image: require('../assets/interest/food.jpg'), selected: false },
        { name: "Health", image: require('../assets/interest/health.jpg'), selected: false },
        { name: "Lifestyle", image: require('../assets/interest/lifestyle.jpg'), selected: false },
        { name: "Politics", image: require('../assets/interest/politics.jpg'), selected: false },
        { name: "Sports", image: require('../assets/interest/sports.jpg'), selected: false },
        { name: "Travel", image: require('../assets/interest/travel.jpg'), selected: false },
        { name: "Music", image: require('../assets/interest/music.jpg'), selected: false },
        { name: "Business", image: require('../assets/interest/business.jpg'), selected: false },
      ],
    };
  }
  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    const { selectedIndex } = this.state;
    this.getBlog({ name: 'photography' }, selectedIndex);
  }
  navigateToDetail = async (item) => {
    let db = firebase.firestore()
    let userDate = (await db.collection('Users').doc(item.userId).get()).data()
    item.userObj = userDate
    this.props.navigation.navigate('BlogDetail', { data: item ,  navigateTo : 'SelectBlog' });
  }
  getBlog(item, index) {
    console.log(item.name, 'iteem')
    this.setState(
      { blogsArr: [], loading: true, selectedIndex: index },
      async () => {
        const {
          userObj: { following, blogCategory },
        } = this.props;
        const { blogsArr, errMessage } = this.state;
        const db = firebaseLib.firestore();
        try {
          const blogs =
            item === 'For you' ? await db
              .collection('Blog')
              .get() :
              await db
                .collection('Blog')
                .where('category', '==', item.name.toLowerCase())
                .get();
          if (blogs.empty) {
            this.setState({ errMessage: 'Sorry no Blogs found', blogsArr: [] });
          }
          blogs.docs.forEach(blog => {
            blogsArr.push(blog.data());
            this.setState({ blogsArr: [...blogsArr] });
          });
        } catch (e) {
          alert(e.message);
        }
        this.setState({ loading: false });
      },
    );
  }
  videoIsReady() {
    this.setState({ hidePlayPause: false, hideSeekbar: false });
  }
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
  closeControlPanel = () => {
    this._drawer.close();
  };
  openControlPanel = () => {
    this._drawer.open();
  };
  render() {
    const { navigation, fontfamily } = this.props;
    let { category, blogsArr, errMessage, loading, selectedIndex, categoryList } = this.state;
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
        <View style={{ backgroundColor: '#323643', flex: 1 }}>
          <CustomHeader
            home
            title={'SELECT BLOG'}
            // icon={true}
            navigation={navigation}
            onPress={() => this.openControlPanel()}
          />
          <Loader isVisible={loading} />
          <View
            style={{
              height: 50,
              borderBottomColor: '#ccc',
              borderBottomWidth: 0.3,
            }}>
            <FlatList
              data={categoryList}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <TouchableOpacity onPress={() => this.getBlog(item, index)}>
                  <Text
                    fontFamily={fontfamily}
                    align={'left'}
                    text={item.name}
                    style={{ padding: 12 }}
                    color={selectedIndex === index ? '#fff' : '#bbb'}
                    bold={selectedIndex === index ? 'bold' : 'normal'} />
                </TouchableOpacity>
              )}
            />
          </View>
          <ScrollView>
            <Image source={categoryList[selectedIndex].image}
              style={{ width: "100%", height: 220, marginVertical: 12, resizeMode: "stretch" }}
            />
            {!!blogsArr.length ? (
              <FlatList
                data={blogsArr}
                numColumns={2}
                renderItem={({ item, index }) => (
                  <TouchableOpacity key={index} style={styles.imageContainer}
                    onPress={() => this.navigateToDetail(item, this.props.userObj)}>
                    {!!item.audioUrl &&
                      <TouchableOpacity
                        style={{
                          height: 200, width: '100%', backgroundColor: '#000',
                          justifyContent: "center", alignItems: "center", borderRadius: 15, marginTop: 5
                        }}
                        onPress={() => this.navigateToDetail(item, this.props.userObj)}>
                        <Icon type={'font-awesome'} name={'microphone'} color={'#fff'} size={41} />
                      </TouchableOpacity>
                    }
                    {!!item.imageUrl && (
                      <Image source={{ uri: item.imageUrl }} style={styles.image} />
                    )}
                    {!!item.videoUrl && (
                      <TouchableOpacity
                        style={{
                          height: 200, width: '100%', backgroundColor: '#000',
                          justifyContent: "center", alignItems: "center",
                          borderRadius: 15, marginTop: 5
                        }}
                        onPress={() => this.navigateToDetail(item, this.props.userObj)}>
                        <Icon type={'antdesign'} name={'playcircleo'} color={'#fff'} size={45} />
                      </TouchableOpacity>
                    )}
                    <View style={{ paddingLeft: 12, marginTop: 4 }}>
                      <Text fontFamily={fontfamily} align={'left'} text={item.blog} bold={true}
                        numberOfLines={2}
                      />
                      <Text fontFamily={fontfamily} align={'left'} color={'#ccc'} text={item.comments.length + '  comments'} />
                    </View >
                  </TouchableOpacity>
                )}
              />
            ) : (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                  <Text fontFamily={fontfamily} text={errMessage} style={styles.errMessage} />
                </View>
              )}
          </ScrollView>
        </View>
      </Drawer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: { width: '47%', margin: 5 },
  image: {
    height: 200,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 4,
  },
  drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3 },
  main: { paddingLeft: 3 },
  errMessage: { color: '#fff', textAlign: 'center', fontSize: 20, marginTop: 20 },
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

export default connect(mapStateToProps, mapDispatchToProps)(SelectBlog);
