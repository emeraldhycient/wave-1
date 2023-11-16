import React, { useEffect, useRef, useState } from "react";
import { Text, View, Platform, ScrollView, useWindowDimensions, TouchableOpacity } from "react-native";
import { StyleSheet, ActivityIndicator } from 'react-native';
import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker';
import { Video, AVPlaybackStatus, ResizeMode } from 'expo-av';
import videoApiSdk from "../../services/video/video.service";
import useCreateSrtFile from "../../hooks/useCreateSrtFile";
import CustomHeader from "../../components/common/customHeader";
import Colors from "../../theme/colors";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SubtitleEditor from "../../components/home/SubtitleEditor";
import * as Crypto from 'expo-crypto';
import LoadingModal from "../../components/common/LoadingModal";
import RBSheet from "react-native-raw-bottom-sheet";
import { Dropdown } from 'react-native-element-dropdown';
import Alert from "../../helpers/alert";
import VideoPlayer from 'expo-video-player'
import { styles as customStyle } from "../../css/stylesheet";



const getSourceVideo = async () => {
    const result = await launchImageLibraryAsync({
        mediaTypes: MediaTypeOptions.Videos
    })

    return (result.canceled) ? null : result.assets[0].uri
}

const Converter = ({ navigation }: any) => {
    const [subtitles, setsubtitles] = React.useState<{ Word: string, Start: string, Stop: string }[]>([]);
    const [subtitleId, setsubtitleId] = React.useState("0");
    const [source, setSource] = React.useState('');

    const [latestSource, setlatestSource] = React.useState("")

    const [actionType, setactionType] = useState("")

    const refRBSheet = useRef<any>();
    const { width } = useWindowDimensions()

    // result gotten from adding translation
    const [result, setResult] = React.useState('');

    const [isLoading, setLoading] = React.useState(false);


    const [fromlang, setFromLang] = useState([])
    const [tolang, setToLang] = useState([])

    const [from_lang, setfrom_lang] = useState("")
    const [to_lang, setto_lang] = useState("")

    const onPress = async () => {

        const sourceVideo = await getSourceVideo();

        if (!sourceVideo) {
            setLoading(() => false);
            return;
        }
        setSource(() => sourceVideo)

        translateVideo({ uri: sourceVideo })
    }

    // useEffect(() => {
    //     if (actionType || to_lang || from_lang) {
    //         onPress()
    //         refRBSheet.current.close()
    //     }
    // }, [from_lang, to_lang])



    const getLanguages = async () => {
        try {
            const tolang = await videoApiSdk.getToLanguages()
            const fromlang = await videoApiSdk.getFromLanguages()
            setToLang(tolang?.data)
            setFromLang(fromlang?.data)
        } catch (error: any) {
            console.log(error)
            Alert.error(error.response.data.message)
        }
    }


    useEffect(() => {
        // onPress()
        getLanguages()
        refRBSheet.current.open()
    }, [])


    let uriArray = source.split(".");
    let fileType = uriArray[uriArray.length - 1];

    const videoFilename = `${new Date()}.${fileType}`.replaceAll(" ", '')
    const videoFilenameed = videoFilename.replace('.mp4', '')


    const translateVideo = async ({ uri }: { uri: string }) => {
        setlatestSource("")
        setLoading(true)
        try {
            let formdata = new FormData();
            formdata.append('media', {
                name: videoFilename,
                type: 'video/*',
                uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
            } as any);

            const response = await videoApiSdk.getVideoAudioTranslationTranscription({ uri: formdata, from_lang, to_lang, action: actionType })

            setsubtitles(response?.data?.captions)
            setsubtitleId(response?.data?.id)
            console.log(response?.data)
            setLoading(false)

        } catch (error: any) {
            setLoading(false)
            console.log("translateVideo failure", error?.response?.data || error)
        }
    }

    const handleCompile = async () => {
        setlatestSource("")
        setLoading(true)
        try {
            const digest = await Crypto.digestStringAsync(
                Crypto.CryptoDigestAlgorithm.SHA256,
                videoFilenameed
            );

            const srtname = digest.slice(0, 6)

            const getsrt = await useCreateSrtFile(subtitles, srtname);
            setResult(getsrt.path)
            // console.log("srtconntent", getsrt.srtContent)

            try {
                let formdata = new FormData();

                formdata.append('media', {
                    name: videoFilename,
                    type: 'video/*',
                    uri: Platform.OS === 'ios' ? source.replace('file://', '') : source,
                } as any);

                formdata.append('srt', {
                    name: `${srtname}.srt`,
                    type: 'application/x-subrip',
                    uri: getsrt.path,
                } as any);


                formdata.append('media_path', videoFilename);

                const response = await videoApiSdk.encodeSrt({ data: formdata, id: subtitleId, srt: getsrt.path })

                // console.log("response", response?.data?.media)
                setlatestSource(response?.data?.media)
                // navigation.goBack()
                // refRBSheet.current.open()
                setLoading(false)

            } catch (error: any) {
                setLoading(false)
                console.log("encoding failure", error?.response?.data || error.message)
            }


        } catch (error) {
            console.error("An error occurred:", error);
        }
    };


    const handleSubtitleEditing = (index: number, text: string) => {
        // Make a copy of the subtitles array to avoid mutating the state directly
        const updatedSubtitles = [...subtitles];
        updatedSubtitles[index].Word = text;
        setsubtitles(updatedSubtitles);

    }

    return (
        <ScrollView style={{ flex: 1, height: '100%', backgroundColor: "#000000" }} contentContainerStyle={[{ margin: 0, backgroundColor: "#000000" }]}>
            <CustomHeader title=" " titleStyle={{ fontWeight: '600', fontSize: 20 }} rightIcon={<View style={{ backgroundColor: Colors.primary, height: 30, width: 30, borderRadius: 100, flexDirection: "column", alignItems: "center", justifyContent: 'center' }}><MaterialCommunityIcons name="database-export" size={20} color="#fff" style={{ marginTop: 2 }} /></View>} onRightPress={handleCompile} leftIcon={<View style={{ height: 30, width: 30, borderRadius: 100, flexDirection: "column", alignItems: "center", justifyContent: 'center' }}><Ionicons name="arrow-back" size={20} color="#fff" style={{ marginTop: 2 }} /></View>} onLeftPress={() => navigation.goBack()} />
            <View style={{
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#000000"
            }}>

                {isLoading && <View>
                    <ActivityIndicator color={Colors.primary} size={22} />
                    <Text style={{ color: Colors.white, fontSize: 14 }}>Loading video and subtitle</Text>
                </View>}
                <LoadingModal visible={isLoading} />
                {
                    latestSource && <>
                        <Plyr uri={latestSource} result={result} />
                        <ScrollView style={styles.subtitleEditoContainer} horizontal>
                            {
                                subtitles.length > 0 && subtitles.map((item: { Word: string, Start: string, Stop: string }, index) =>
                                    <SubtitleEditor subtitle={item} onSubtitleChange={(text: string) => handleSubtitleEditing(index, text)} index={index} />
                                )
                            }
                        </ScrollView>
                    </>

                }
                {
                    !latestSource && source &&
                    <>
                        <Plyr uri={source} />

                        <ScrollView style={styles.subtitleEditoContainer} horizontal>
                            {
                                subtitles.length > 0 && subtitles.map((item: { Word: string, Start: string, Stop: string }, index) =>
                                    <SubtitleEditor subtitle={item} onSubtitleChange={(text: string) => handleSubtitleEditing(index, text)} index={index} />
                                )
                            }
                        </ScrollView>
                    </>
                }
                <RBSheet
                    ref={refRBSheet}
                    closeOnDragDown={true}
                    closeOnPressMask={false}
                    height={400}
                    customStyles={{
                        wrapper: {
                            backgroundColor: "transparent"
                        },
                        container: {
                            backgroundColor: "rgba(29, 35, 41, 1)",
                        },
                        draggableIcon: {
                            backgroundColor: "#000"
                        }
                    }}
                >
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width, paddingHorizontal: 20, flexWrap: "wrap" }}>
                        <Dropdown
                            style={[styles.dropdown, { width: "100%", marginBottom: 30 }]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={[{ label: "Transcribe", value: "transcribe" }, { label: "Translate", value: "translate" }]}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={"Select Action"}
                            searchPlaceholder="Search..."
                            value={actionType}
                            onChange={(item: any) => {
                                setactionType(item?.value);
                            }}

                        />
                        {
                            actionType == "translate" &&
                            <>
                                <Dropdown
                                    style={[styles.dropdown]}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    iconStyle={styles.iconStyle}
                                    data={fromlang}
                                    search
                                    maxHeight={300}
                                    labelField="label"
                                    valueField="value"
                                    placeholder={"From Lan"}
                                    searchPlaceholder="Search..."
                                    value={from_lang}
                                    onChange={(item: any) => {
                                        setfrom_lang(item?.value);
                                    }}

                                />
                                <Dropdown
                                    style={[styles.dropdown]}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    iconStyle={styles.iconStyle}
                                    data={tolang}
                                    search
                                    maxHeight={300}
                                    labelField="label"
                                    valueField="value"
                                    placeholder={'To lang'}
                                    searchPlaceholder="Search..."
                                    value={to_lang}
                                    onChange={(item: any) => {
                                        setto_lang(item?.value);
                                    }}

                                />
                            </>

                        }
                        {
                            actionType == "transcribe" &&
                            <>
                                <Dropdown
                                    style={[styles.dropdown, { width: "100%", marginBottom: 30 }]}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    iconStyle={styles.iconStyle}
                                    data={tolang}
                                    search
                                    maxHeight={300}
                                    labelField="label"
                                    valueField="value"
                                    placeholder={'To lang'}
                                    searchPlaceholder="Search..."
                                    value={to_lang}
                                    onChange={(item: any) => {
                                        setto_lang(item?.value);
                                    }}

                                />
                            </>

                        }
                        {
                            actionType &&
                            <TouchableOpacity
                                style={{
                                    ...customStyle.primaryButton,
                                    width: "100%",
                                    marginVertical: 20,
                                }}
                                onPress={() => {
                                    onPress()
                                    refRBSheet.current.close()
                                }}
                            >
                                {
                                    isLoading ? <ActivityIndicator />
                                        :
                                        <Text style={{ color: "#CFD8D8", fontSize: 16 }}>Proceed</Text>
                                }
                            </TouchableOpacity>

                        }

                    </View>
                </RBSheet>
            </View>
        </ScrollView>
    );
}

export default Converter


const Plyr = (props: {
    uri: string,
    result?: string
}) => {
    const video = React.useRef(null);
    const [status, setStatus] = React.useState<AVPlaybackStatus | {}>({});

    return (
        <View style={styles.videoContainer}>
            <VideoPlayer
                style={{ height: 500 }}
                videoProps={{
                    shouldPlay: false,
                    resizeMode: ResizeMode.CONTAIN,
                    useNativeControls: true,
                    videoStyle: { height: 500, width: "100%" },
                    source: {
                        uri: props.uri,
                    },
                }}
            />
        </View>

    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
    },


    dropdown: {
        height: 50,
        width: "45%",
        borderRadius: 8,
        paddingHorizontal: 13,
        borderWidth: 1,
        borderColor: Colors.grey,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
        color: "white"
    },
    selectedTextStyle: {
        fontSize: 16,
        color: "white"
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});
