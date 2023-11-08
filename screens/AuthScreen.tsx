import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { styles } from "../css/stylesheet";
import authService from "../services/auth/auth.service";
import Alert from "../helpers/alert";
import countries from "../constants/countries.json"
import useAuthenticationState from "../states/zustandStore/authentication";
import { setToken } from "../states/asyncStore/token";
import Colors from "../theme/colors";
import { Dropdown } from 'react-native-element-dropdown';


function AuthScreen({ navigation }: any) {
  const [isSignIn, setIsSignIn] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("70886396721");
  const [couuntryCode, setcouuntryCode] = useState("");
  const [password, setPassword] = useState("");

  const [isFocus, setIsFocus] = useState(false);


  const [isLoading, setisLoading] = useState(false)

  const toggleSignIn = () => {
    // Toggle between sign-in and sign-up forms
    setIsSignIn(!isSignIn);
  };

  const setUser = useAuthenticationState((state: any) => state.setUser);
  const setIsAuthenticated = useAuthenticationState((state: any) => state.setIsAuthenticated);
  // const setToken = useAuthenticationState((state: any) => state.setToken);

  const handleSignUp = async () => {
    if (!phone || !fullName || !couuntryCode && !isLoading) {
      Alert.error("please enter your phone and fullname")
      return;
    }

    setisLoading(true)
    try {
      const response = await authService.register({ phone_no: `${couuntryCode}${phone}`, name: fullName })
      console.log(response.data)
      setUser(response.data.detail)
      Alert.success('Account created sucessfully.you can login now')
      toggleSignIn()
      setisLoading(false)

    } catch (error: any) {
      Alert.error(error?.response?.data?.detail)
      console.log(error?.response.data)
      setisLoading(false)

    }
  };

  const handleSendOtp = async () => {
    if (!phone || !couuntryCode && !isLoading) {
      Alert.error("please enter your phone ")
      return;
    }

    setisLoading(true)
    const code = couuntryCode.replace('+', '')
    console.log(code)
    try {
      const response = await authService.sendOtp({ phone_no: `${code}${phone}` })
      console.log(response.data)
      Alert.success(`An otp has been sent to the phone above, ${response.data.detail}`)
      setisLoading(false)
    } catch (error: any) {
      Alert.error(error?.response?.data?.detail)
      console.log(error?.response.data)
      setisLoading(false)
    }

  };
  const handleLogin = async () => {
    if (!phone || !couuntryCode || !password && !isLoading) {
      Alert.error("please enter your phone correctly and enter the otp  ")
      return;
    }

    setisLoading(true)
    try {
      const response = await authService.login({ phone_no: `${couuntryCode}${phone}`, otp: password })
      console.log(response.data)
      setIsAuthenticated(true)
      setToken(response.data.access)
      Alert.success(`login successful`)
      setisLoading(false)
      navigation.navigate("Payment");
    } catch (error: any) {
      setisLoading(false)
      Alert.error(error?.response?.data?.detail)
      console.log(error?.response.data)

    }

  };

  const handleForgotPassword = () => {
    // navigate to forgot password here.
    navigation.navigate("ForgotPassword");
  };

  return (
    <ScrollView style={{ flex: 1, height: '100%', backgroundColor: "#000000" }} contentContainerStyle={[{ margin: 0, backgroundColor: "#000000" }, { paddingVertical: 50 }]}>
      <View style={{
        height: "100%", alignItems: "center",
        justifyContent: "center",
      }}>
        <StatusBar style="light" backgroundColor="#000000" />
        <Image source={require('./../assets/icon.png')} style={{ height: 130, width: 130 }} />
        <Text
          style={[
            styles.smallText,
            {
              marginBottom: 40,
              textAlign: "center",
              width: "80%",
              color: "gray",
            },
          ]}
        >
          Transform Your Videos with our Editing Magic, make the best captions
        </Text>

        {/* Conditional Rendering Based on isSignIn */}
        {isSignIn && (
          <>
            <Text
              style={{ ...styles.smallText, textAlign: "left", width: "90%" }}
            >
              Full Name
            </Text>
            <TextInput
              placeholder="John Doe"
              onChangeText={(text) => setFullName(text)}
              value={fullName}
              style={styles.input}
              placeholderTextColor={"gray"}
            />
            <Text
              style={{ ...styles.smallText, textAlign: "left", width: "90%" }}
            >
              Phone Number
            </Text>
            <View style={{ display: "flex", flexDirection: "row", gap: 0 }}>
              <View style={styles.countryDropDown}>
                <Dropdown
                  style={[styless.dropdown, isFocus && { borderColor: 'blue' }]}
                  placeholderStyle={styless.placeholderStyle}
                  selectedTextStyle={styless.selectedTextStyle}
                  inputSearchStyle={styless.inputSearchStyle}
                  iconStyle={styless.iconStyle}
                  data={countries}
                  search
                  maxHeight={300}
                  labelField="code"
                  valueField="code"
                  placeholder={!isFocus ? 'code' : '...'}
                  searchPlaceholder="Search..."
                  value={couuntryCode}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={item => {
                    setcouuntryCode(item?.code);
                    setIsFocus(false);
                  }}
                 
                />
               
              </View>
              <TextInput
                keyboardType="numeric"
                placeholder="Phone number"
                onChangeText={(text) => setPhone(text)}
                value={phone}
                style={styles.phoneInput}
                placeholderTextColor={"gray"}
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'flex-start', width: "100%", paddingHorizontal: 30 }}>
              <TouchableOpacity
                onPress={() => setIsSignIn(false)}
              >
                <Text style={styles.smallText}>Already have an account?</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "black",
                  borderWidth: 1,
                }}
                onPress={() => setIsSignIn(false)}
              >
                <Text style={{ color: Colors.primary, fontSize: 16, textAlign: "left" }}>Login</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{
                ...styles.primaryButton,
                width: "90%",
                marginVertical: 20,
              }}
              onPress={handleSignUp}
            >
              {
                isLoading ? <ActivityIndicator />
                  :
                  <Text style={{ color: "#CFD8D8", fontSize: 16 }}>Sign Up</Text>
              }
            </TouchableOpacity>

          </>
        )}

        {!isSignIn && (
          <>
            <Text
              style={{ ...styles.smallText, textAlign: "left", width: "90%" }}
            >
              Phone Number
            </Text>
            <View style={{ display: "flex", flexDirection: "row", gap: 0 }}>
              <View style={styles.countryDropDown}>
                <Dropdown
                  style={[styless.dropdown, isFocus && { borderColor: 'blue' }]}
                  placeholderStyle={styless.placeholderStyle}
                  selectedTextStyle={styless.selectedTextStyle}
                  inputSearchStyle={styless.inputSearchStyle}
                  iconStyle={styless.iconStyle}
                  data={countries}
                  search
                  maxHeight={300}
                  labelField="code"
                  valueField="code"
                  placeholder={!isFocus ? 'code' : '...'}
                  searchPlaceholder="Search..."
                  value={couuntryCode}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={item => {
                    setcouuntryCode(item?.code);
                    setIsFocus(false);
                  }}

                />
               
              </View>
              <TextInput
                keyboardType="numeric"
                placeholder="Phone number"
                onChangeText={(text) => setPhone(text)}
                value={phone}
                style={styles.phoneInput}
                placeholderTextColor={"gray"}
              />
            </View>
            <Text
              style={{ ...styles.smallText, textAlign: "left", width: "90%" }}
            >
              One-Time-Password
            </Text>
            <View style={{ display: "flex", flexDirection: "row", gap: 0 }}>
              <TextInput
                placeholder="Enter the OTP you recieved"
                onChangeText={(text) => setPassword(text)}
                value={password}
                keyboardType="numeric"
                maxLength={6}
                style={styles.passwordInput}
                placeholderTextColor={"gray"}
              />
              <TouchableOpacity
                onPress={handleSendOtp}
                style={styles.passwordToggle}
              >
                <Text style={styles.smallText}>Get OTP</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'flex-start', width: "100%", paddingHorizontal: 30 }}>
              <TouchableOpacity
                onPress={() => setIsSignIn(true)}
              >
                <Text style={styles.smallText}>Don't have an account?</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "black",
                  borderWidth: 1,
                }}
                onPress={() => setIsSignIn(true)}
              >
                <Text style={{ color: Colors.primary, fontSize: 16, textAlign: "left" }}>Sign Up</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{
                ...styles.primaryButton,
                width: "90%",
                marginVertical: 20,
              }}
              onPress={handleLogin}
            >
              {
                isLoading ? <ActivityIndicator />
                  :
                  <Text style={{ color: "#CFD8D8", fontSize: 16 }}>Login</Text>
              }
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}

export default AuthScreen;

const styless = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    // width,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F6F6F6",
  },
  headerTitle: { color: "#000", fontWeight: "bold", fontSize: 16 },
  saveAreaViewContainer: { flex: 1, backgroundColor: "#FFF" },
  viewContainer: {
    flex: 1,
    // width,
    backgroundColor: "#FFF",
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: "10%",
    paddingBottom: "20%",
  },
  dropdown: {
    height: 50,
    width: 100,
    borderRadius: 8,
    paddingHorizontal: 13,
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
    color:"white"
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
  // dropdown1BtnStyle: {
  //   width: "80%",
  //   height: 50,
  //   backgroundColor: "#FFF",
  //   borderRadius: 8,
  //   borderWidth: 1,
  //   borderColor: "#444",
  // },
  // dropdown1BtnTxtStyle: { color: "#444", textAlign: "left" },
  // dropdown1DropdownStyle: { backgroundColor: "#EFEFEF" },
  // dropdown1RowStyle: {
  //   backgroundColor: "#EFEFEF",
  //   borderBottomColor: "#C5C5C5",
  // },
  // dropdown1RowTxtStyle: { color: "#444", textAlign: "left" },
  // dropdown1SelectedRowStyle: { backgroundColor: "rgba(0,0,0,0.1)" },
  // dropdown1searchInputStyleStyle: {
  //   backgroundColor: "#EFEFEF",
  //   borderRadius: 8,
  //   borderBottomWidth: 1,
  //   borderBottomColor: "#444",
  // },

  // dropdown2BtnStyle: {
  //   width: "80%",
  //   height: 50,
  //   backgroundColor: "#444",
  //   borderRadius: 8,
  // },
  // dropdown2BtnTxtStyle: {
  //   color: "#FFF",
  //   textAlign: "center",
  //   fontWeight: "bold",
  // },
  // dropdown2DropdownStyle: {
  //   backgroundColor: "#444",
  //   borderRadius: 12,
  // },
  // dropdown2RowStyle: { backgroundColor: "#444", borderBottomColor: "#C5C5C5" },
  // dropdown2RowTxtStyle: {
  //   color: "#FFF",
  //   textAlign: "center",
  //   fontWeight: "bold",
  // },
  // dropdown2SelectedRowStyle: { backgroundColor: "rgba(255,255,255,0.2)" },
  // dropdown2searchInputStyleStyle: {
  //   backgroundColor: "#444",
  //   borderBottomWidth: 1,
  //   borderBottomColor: "#FFF",
  // },

  // dropdown3BtnStyle: {
  //   width: "80%",
  //   height: 50,
  //   backgroundColor: "#FFF",
  //   paddingHorizontal: 0,
  //   borderWidth: 1,
  //   borderRadius: 8,
  //   borderColor: "#444",
  // },
  // dropdown3BtnChildStyle: {
  //   flex: 1,
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   paddingHorizontal: 18,
  // },
  // dropdown3BtnImage: { width: 15, height: 15, resizeMode: "contain" },
  // dropdown3BtnTxt: {
  //   color: "#444",
  //   textAlign: "center",
  //   fontWeight: "bold",
  //   fontSize: 24,
  //   marginHorizontal: 12,
  // },
  // dropdown3DropdownStyle: { backgroundColor: "slategray" },
  // dropdown3RowStyle: {
  //   backgroundColor: "slategray",
  //   borderBottomColor: "#444",
  //   height: 50,
  // },
  // dropdown3RowChildStyle: {
  //   flex: 1,
  //   flexDirection: "row",
  //   justifyContent: "flex-start",
  //   alignItems: "center",
  //   paddingHorizontal: 18,
  // },
  // dropdownRowImage: { width: 15, height: 15, resizeMode: "cover" },
  // dropdown3RowTxt: {
  //   color: "#F1F1F1",
  //   textAlign: "center",
  //   fontWeight: "bold",
  //   fontSize: 24,
  //   marginHorizontal: 12,
  // },
  // dropdown3searchInputStyleStyle: {
  //   backgroundColor: "slategray",
  //   borderBottomWidth: 1,
  //   borderBottomColor: "#FFF",
  // },
});
