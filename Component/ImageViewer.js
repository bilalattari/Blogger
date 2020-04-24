import React, { Fragment } from 'react'
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native'
import { withNavigation } from 'react-navigation'
import Modal from 'react-native-modal'
import { Icon } from 'react-native-elements'
import ImageViewer from 'react-native-image-zoom-viewer';
class ImageZoom extends React.Component {
    constructor(props) {
        super(props)
    }
    static navigationOptions = {
        header: null
    }

    render() {
        let images = [{
            url: this.props.imageUrl,
        }]
        return (
            <Modal visible={this.props.isVisible} transparent={true}>
                <TouchableOpacity style={{
                    height: 60, width: 60, justifyContent: "center", alignItems: 'center',
                    position: 'absolute', top: 12, right: 12, zIndex: 1200
                }} onPress={() => this.props.onCancel()} >
                    <Icon type={"font-awesome"} name={'times'} color={'#fff'} />
                </TouchableOpacity>
                <ImageViewer
                    enableImageZoom={true}
                    imageUrls={images} />
            </Modal>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    pickerHeading: { paddingLeft: '6%', fontWeight: '700', marginTop: 6 }
})
export default withNavigation(ImageZoom)
