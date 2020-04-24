/* eslint-disable */

import React, { Fragment } from 'react';
import {
  StyleSheet, TextInput,
  View, TouchableOpacity,
  FlatList, ScrollView,
  Image
} from 'react-native';
import { connect } from 'react-redux'
import CustomInput from '../Component/Input'
import CustomButton from '../Component/Button'
import CustomHeader from '../Component/header'
import { withNavigation, NavigationEvents } from 'react-navigation'
import { Icon } from 'react-native-elements';
import { themeColor, pinkColor } from '../Constant';
import DocumentPicker from 'react-native-document-picker';
import firebaseLib from 'react-native-firebase'
import Text from '../Component/Text'
import firebase from '../utils/firebase'

class Chat extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      message: '',
      messageList: [],
      otherUserData: {}
    }
  }
  static navigationOptions = {
    header: null,
  };
  componentDidMount() {
    const { otherUserId } = this.props.navigation.state.params
    this.getAnotherUserData()
    const { userId } = this.props.userObj
    const { messageList, otherUserData } = this.state
    const db = firebaseLib.firestore()
    userObj = {
      [userId]: true,
      [otherUserId]: true,
      createdAt: Date.now()
    }
    db.collection("Rooms")
      .where("userObj." + userId, '==', true)
      .where("userObj." + otherUserId, '==', true)
      .onSnapshot(snapShot => {
        if (snapShot.empty) {
          db.collection('Rooms').add({ userObj }).then((doc) => {
            const roomId = doc.id
            this.setState({ roomId })
            return
          })
        }
        snapShot.docChanges.forEach((value) => {
          this.setState({ roomId: value.doc.id })
          db.collection('Rooms').doc(value.doc.id)
            .collection('Messages')
            .orderBy('createdAt')
            .onSnapshot(querySnapShot => {
              if (querySnapShot.empty) return
              querySnapShot.docChanges.forEach((values) => {
                messageList.push(values.doc.data())
              })
              this.setState({ messageList })
            })
        })
      })
  }

  getAnotherUserData = () => {
    const { otherUserId } = this.props.navigation.state.params
    const db = firebaseLib.firestore()
    console.log(otherUserId, 'otherUserIdotherUserId')
    db.collection("Users")
      .where('userId', '==', otherUserId).onSnapshot((snapShot) => {
        snapShot.docChanges.forEach((value) => {
          this.setState({ otherUserData: value.doc.data() })
        })
      })
  }
  async sendMessage() {
    const { otherUserId } = this.props.navigation.state.params
    const { userId, userName } = this.props.userObj
    const { roomId, message } = this.state
    const db = firebaseLib.firestore()
    if (!message) return alert('Write a message')
    const msgObj = {
      message: message,
      senderId: userId,
      recieverId: otherUserId,
      createdAt: Date.now(),
      senderName: userName
    }
    await db.collection('Rooms').doc(roomId).collection('Messages').add(msgObj)
    this.setState({ message: '' })
  }

  render() {
    const { navigation } = this.props.navigation
    const { message, messageList, otherUserData } = this.state
    const { userId } = this.props.userObj
    return (
      <View style={{ flex: 1, backgroundColor: themeColor }}>
        <CustomHeader title={'Messages'}
          navigation={this.props.navigation}
          customImage={otherUserData.photoUrl}
          navigation={this.props.navigation} />
        <ScrollView>
          {messageList.length !== 0 && <FlatList
            data={messageList}
            contentContainerStyle={{ flex: 1 }}
            keyExtractor={item => item}
            renderItem={({ item, index }) =>
              <View style={{
                minHeight: 30, borderRadius: 5, justifyContent: item.senderId === userId ? "flex-end" : "flex-start",
                width: "60%",
                alignSelf: item.senderId === userId ? "flex-end" : "flex-start", margin: 12, marginVertical: 8,
                backgroundColor: item.senderId === userId ? '#E2E6EC' : "#FE8369",
              }}>
                <View style={{
                  minHeight: 20, alignItems: item.senderId === userId ? "flex-end" : "flex-start",
                  flex: 1,
                }}>
                  <Text
                    text={item.message}
                    align = {item.senderId === userId ? "right" : "left"}
                    fontFamily={this.props.fontfamily}
                    style={[{
                      padding: 12, paddingVertical: 18, lineHeight : 22,
                      color: item.senderId === userId ? themeColor : "#fff",
                    }]} />
                </View>

                <View style={{
                  height: 15, backgroundColor: themeColor, width: '100%',
                  borderTopRightRadius: item.senderId === userId ? 41 : 0, borderTopLeftRadius: item.senderId === userId ? 0 : 41
                }}>
                </View>
              </View>
            }
          />}
        </ScrollView>
        <View style={styles.inputContainer}>
          {/* <TouchableOpacity style={{ width: '14%', }}>
            <Icon type={'font-awesome'} name={'camera'}
              color={'#fff'} containerStyle={{ alignSelf: 'center' }} />
          </TouchableOpacity> */}
          <TextInput placeholder={'Say Something'} placeholderTextColor={'grey'}
            style={{
              width: '81%', backgroundColor: '#fff', color: pinkColor,
              height: 40, borderRadius: 7, padding: 6 , fontFamily : this.props.fontfamily
            }}
            onChangeText={(message) => this.setState({ message })}
            value={message}
          />
          <TouchableOpacity style={{ width: '16%', }} onPress={() => this.sendMessage()}>
            <Icon type={'font-awesome'} name={'arrow-right'} color={'#fff'} containerStyle={{ alignSelf: 'center' }} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  msgImage: { height: 41, width: 41, borderRadius: 5, marginHorizontal: 10 },
  inputContainer: {
    justifyContent: "flex-end", flexDirection: "row", height: 60,
    borderTopColor: 'grey', borderTopWidth: 0.5, alignItems: 'center'
  },

})
const mapDispatchToProps = (dispatch) => {
  return {}
}
const mapStateToProps = (state) => {
  return {
    userObj: state.auth.user,
    fontfamily: state.font.fontFamily

  }
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(Chat))


