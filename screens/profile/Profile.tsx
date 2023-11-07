import { StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import React from 'react'
import CustomHeader from '../../components/common/customHeader'
import { ScrollView } from 'react-native'
import Colors from '../../theme/colors'
import ActionCard from '../../components/profile/ActionCard'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Profile = () => {
  const { width, height } = useWindowDimensions()

  return (
    <ScrollView style={{ flex: 1, height: '100%', backgroundColor: "#000000" }} contentContainerStyle={[{ margin: 0, backgroundColor: "#000000" }]}>
      <CustomHeader title="Igweze Hycient" titleStyle={{ fontWeight: '600', fontSize: 20 }} />
      <View style={{ flexDirection: "column", justifyContent: "space-between", height: height - 150 }}>
        <View>
          <Text style={{ color: Colors.grey, fontSize: 14, textAlign: "center" }}>igwezehycient86@gmail.com</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width, paddingHorizontal: 20, flexWrap: "wrap" }}>
            <View style={{ width: "46%" }}>
              <ActionCard icon={<AntDesign name="wechat" size={26} color={'#0DA84C'} style={{ marginBottom: 5 }} />} title={"Support"} onPress={() => { }} />
            </View>
            <View style={{ width: "46%" }}>
              <ActionCard icon={<MaterialIcons name="online-prediction" size={26} color={'#0DA84C'} style={{ marginBottom: 5 }} />} title={"Subrciption"} onPress={undefined} />
            </View>
          </View>
          <View style={{ paddingHorizontal: 30, paddingVertical: 30 }}>
            <Text style={{ color: Colors.grey, fontSize: 14 }}>LEGAL</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 15 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <SimpleLineIcons name="handbag" size={18} color={'#0DA84C'} style={{ marginBottom: 5, marginRight: 5 }} />
                <Text style={{ color: Colors.white, fontSize: 16, fontWeight: "500" }}>Privacy Policy</Text>
              </View>
              <MaterialIcons name="keyboard-arrow-right" size={26} color={Colors.white} style={{ marginBottom: 5 }} />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 15 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <SimpleLineIcons name="handbag" size={18} color={'#0DA84C'} style={{ marginBottom: 5, marginRight: 5 }} />
                <Text style={{ color: Colors.white, fontSize: 16, fontWeight: "500" }}>Terms of Use</Text>
              </View>
              <MaterialIcons name="keyboard-arrow-right" size={26} color={Colors.white} style={{ marginBottom: 5 }} />
            </View>
          </View>
        </View>
        <View>
          <View style={{ borderWidth: 0.4, borderColor: Colors.grey, height: 45, marginHorizontal: 30, marginTop: 30, marginBottom: 20, alignSelf: "center", width: width - 70, borderRadius: 7, justifyContent: "center" }}>
            <Text style={{ color: Colors.primary, fontSize: 16, fontWeight: "500", textAlign: "center" }}>Log Out</Text>
          </View>
          <View style={{ borderWidth: 0.4, borderColor: Colors.grey, height: 45, marginHorizontal: 30, marginTop: 5, marginBottom: 30, alignSelf: "center", width: width - 70, borderRadius: 7, justifyContent: "center" }}>
            <Text style={{ color: Colors.red, fontSize: 16, fontWeight: "500", textAlign: "center" }}>Delete Account</Text>
          </View>
        </View>
      </View>
    </ScrollView >
  )
}

export default Profile

const styles = StyleSheet.create({})