import React, { useRef, useEffect, useState } from "react";
import { View, ScrollView, useWindowDimensions, StyleSheet } from "react-native";

import videoApiSdk from "../../services/video/video.service";
import Empty from "../../components/home/Empty";
import CustomHeader from "../../components/common/customHeader";
import Colors from "../../theme/colors";
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import RBSheet from "react-native-raw-bottom-sheet";
import ActionCard from "../../components/home/ActionCard";
import { ResizeMode } from 'expo-av'
import VideoPlayer from 'expo-video-player'
import LoadingModal from "../../components/common/LoadingModal";


const Home = ({ navigation }: any) => {


  const refRBSheet = useRef<any>();
  const { width } = useWindowDimensions()

  const handleNextPage = (pageName: string) => {
    navigation.navigate(pageName)
    refRBSheet.current.close()
  }


  const [myvideos, setmyvideos] = useState([])
  const [page, setpage] = useState(1)

  const [isloading, setisloading] = useState(false)

  const fetchVideos = async () => {
    setisloading(true)
    try {
      const resp = await videoApiSdk.getVideos({})
      setmyvideos(resp?.data?.results)
      setisloading(false)
    } catch (error: any) {
      console.log(error)
      setisloading(false)
    }
  }

  useEffect(() => {
    fetchVideos()
  }, [])


  return (
    <>
      <CustomHeader headerStyle={{ height: 70, paddingTop: 30, backgroundColor: "#000000" }} title="Projects" titleStyle={{ fontWeight: '600', fontSize: 20 }} rightIcon={<View style={{ backgroundColor: Colors.primary, height: 30, width: 30, borderRadius: 100, flexDirection: "column", alignItems: "center", justifyContent: 'center' }}><Feather name="plus" size={20} color="#fff" style={{ marginTop: 2 }} /></View>} onRightPress={() => refRBSheet.current.open()} />
      <ScrollView style={{ flex: 1, height: '100%', backgroundColor: "#000000" }} contentContainerStyle={[{ margin: 0, backgroundColor: "#000000" }]}>
        <View style={{
          height: "100%"
        }}>
          <View style={{ width: "46%",marginVertical:10, }}>
            <ActionCard icon={<AntDesign name="clouduploado" size={26} color={Colors.primary} style={{ marginBottom: 5 }} />} title={"Videos"} subtext={`Total Projects : ${myvideos?.length} `} onPress={()=>{}} />
          </View>
          {
            myvideos.length > 0 ?
              myvideos.map((item:any, index) => (
                <View key={index} style={styles.card}>
                  <VideoPlayer
                    style={{height:400}}
                    videoProps={{
                      shouldPlay: false,
                      resizeMode: ResizeMode.CONTAIN,
                      useNativeControls: true,
                      videoStyle:{height:400,width:"100%"},
                      source: {
                        uri: item?.media,
                      },
                    }}
                  />
                </View>
              ))
              :
              <View style={{
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <Empty onPress={() => { }} />
              </View>
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
            <ScrollView>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width, paddingHorizontal: 20, flexWrap: "wrap" }}>
                <View style={{ width: "46%" }}>
                  <ActionCard icon={<AntDesign name="clouduploado" size={26} color={Colors.primary} style={{ marginBottom: 5 }} />} title={"Import"} subtext={"Upload your footage"} onPress={() => handleNextPage("converter")} />
                </View>
                <View style={{ width: "46%" }}>
                  <ActionCard icon={<MaterialIcons name="online-prediction" size={26} color={Colors.primary} style={{ marginBottom: 5 }} />} title={"AI Dubbing"} subtext={"Translate your voice"} onPress={undefined} />
                </View>

              </View>
            </ScrollView>
          </RBSheet>
          <LoadingModal visible={isloading} />
        </View>
      </ScrollView>
    </>

  );
};

export default Home;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoContainer: {
    backgroundColor: '#ecf0f1',
    marginTop: 20,
    textAlign: 'center',
    padding: 10,

  },
  video: {
    alignSelf: 'center',
    width: 320,
    height: 200,
  },
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
  card: {
    backgroundColor:"rgba(255, 255, 255, 0.1)",
    marginBottom:10,
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,

    elevation: 2,
  }
});

