import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Video, AVPlaybackStatus } from 'expo-av';
import CustomHeader from '../../components/common/customHeader';
import Colors from '../../theme/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';


const PlayVideo = ({ route, navigation }: any) => {
    const { videoUrl } = route.params

    const video = React.useRef(null);
    const [status, setStatus] = React.useState<AVPlaybackStatus | {}>({});


    return (
        <View style={styles.container}>
            <CustomHeader title=" " titleStyle={{ fontWeight: '600', fontSize: 20 }}  leftIcon={<View style={{ height: 30, width: 30, borderRadius: 100, flexDirection: "column", alignItems: "center", justifyContent: 'center' }}><Ionicons name="arrow-back" size={20} color="#fff" style={{ marginTop: 2 }} /></View>} onLeftPress={() => navigation.goBack()} />
            <View style={styles.videoContainer}>
                <Video
                    ref={video}
                    style={styles.video}
                    source={{
                        uri: videoUrl ?? "",
                    }}
                    useNativeControls
                    resizeMode="cover"
                    onPlaybackStatusUpdate={(status: AVPlaybackStatus) => setStatus(() => status)}

                />
            </View>
        </View>

    )
}

export default PlayVideo



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.black,
        alignItems: 'center',
        justifyContent: 'center',
    },
    video: {
        alignSelf: 'center',
        width: "100%",
        height: 500,
    },
    videoContainer: {
        backgroundColor: '#ecf0f1',
        margin: 8,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        width: "100%",
    }
    ,
    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    headTitle: { color: "#CFD8D8", fontSize: 28, marginBottom: 20 },

    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },

    subtitleEditoContainer: {
        backgroundColor: "rgba(29, 35, 41, 1)",
        padding: 3,
        borderRadius: 5
    }
});
