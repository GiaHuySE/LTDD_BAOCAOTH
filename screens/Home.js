import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Animated,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { COLOURS, Items } from "../components/database/Database";
import { StatusBar } from "expo-status-bar";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

// //link all name animations: https://github.com/oblador/react-native-animatable
// //link how to code animation: https://blog.bitsrc.io/top-5-animation-libraries-in-react-native-d00ec8ddfc8d
import * as Animatable from 'react-native-animatable';

import { SafeAreaView } from "react-native-safe-area-context";

const widthScreen = Dimensions.get("window").width;
const heightScreen = Dimensions.get("window").height;

const Home = ({ navigation }) => {
  //splash-screen
  const splashscreen = useRef(new Animated.Value(0)).current;
  const [isVisible, setisVisible] = useState(true);
  useEffect(() => {
    Animated.sequence([
      Animated.timing(splashscreen, {
        toValue: 1,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  useEffect(() => {
    let myTimeout = setTimeout(() => {
      setisVisible(false);
    }, 5000); //5s
    return () => clearTimeout(myTimeout);
  }, []);
  function showSplashScreen() {
    return (
      <Animated.View
        style={[
          { flex: 1, backgroundColor: "#7FBBF3", alignItems: 'center', justifyContent: 'center' },
          { opacity: splashscreen },
        ]}
      >
        <Animated.Image
          style={[{ width: widthScreen, height: '32%' }]}
          source={require("../assets/headphone_5.gif")}
          resizeMode="cover"
        />
        <Animated.Image
          style={[{ width: '50%', height: '20%' }]}
          source={require("../assets/loading.gif")}
          resizeMode="contain"
        />
        <Text style={{ fontSize: 28, fontWeight: "bold", color: "#fff", marginTop: '5%' }}>
          WELCOME TO Hi-Fi SHOP !
        </Text>
      </Animated.View>
    );
  }

  const [products, setProduct] = useState([]);
  const [accessories, setAccessories] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getDataFromDB();
    });
  }, [navigation]);

  const getDataFromDB = () => {
    let productList = [];
    let accessoryList = [];
    for (let index = 0; index < Items.length; index++) {
      if (Items[index].category == "product") {
        productList.push(Items[index]);
      } else if (Items[index].category == "accessory") {
        accessoryList.push(Items[index]);
      }
    }
    setProduct(productList);
    setAccessories(accessoryList);
  };

  const ProductCard = ({ data }) => {
    return (
      <TouchableOpacity
        style={{ width: "48%", marginVertical: 14 }}
        onPress={() =>
          navigation.navigate("ProductInfo", { productID: data.id })
        }
      >
        <View
          style={{
            width: "100%",
            height: 100,
            borderRadius: 10,
            backgroundColor: COLOURS.backgroundLight,
            position: "relative",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          {data.isOff ? (
            <View
              style={{
                position: "absolute",
                width: "20%",
                height: "24%",
                backgroundColor: COLOURS.green,
                top: 0,
                left: 0,
                borderTopLeftRadius: 10,
                borderBottomRightRadius: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: COLOURS.white,
                  fontWeight: "bold",
                  letterSpacing: 1,
                }}
              >
                {data.offPercentage}%
              </Text>
            </View>
          ) : null}
          <Image
            source={data.productImage}
            style={{ width: "80%", height: "80%", resizeMode: "contain" }}
          />
        </View>
        <Text
          style={{
            fontSize: 12,
            color: COLOURS.black,
            fontWeight: "600",
            marginBottom: 2,
          }}
        >
          {data.productName}
        </Text>
        {data.category == "accessory" ? (
          data.isAvailable ? (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome
                name="circle"
                style={{ fontSize: 12, marginRight: 6, color: COLOURS.green }}
              />
              <Text style={{ fontSize: 12, color: COLOURS.green }}>
                Available
              </Text>
            </View>
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome
                name="circle"
                style={{ fontSize: 12, marginRight: 6, color: COLOURS.red }}
              />
              <Text style={{ fontSize: 12, color: COLOURS.red }}>
                Unavailable
              </Text>
            </View>
          )
        ) : null}
        <Text>
          {data.productPrice} {"\u20AB"}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: COLOURS.white,
      }}
    >
      {isVisible ? (
        showSplashScreen()
      ) : (
        <Animatable.View animation="fadeInDownBig">
          {/* <StatusBar backgroundColor={COLOURS.white} barStyle="dark-content" /> */}
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: 'center',
                padding: 16,
              }}
            >
              <TouchableOpacity>
                <Entypo
                  name="shopping-bag"
                  style={{
                    fontSize: 18,
                    color: COLOURS.backgroundMedium,
                    padding: 12,
                    borderRadius: 10,
                    backgroundColor: COLOURS.backgroundLight,
                  }}
                />
              </TouchableOpacity>
              <Image
                source={require("../assets/headphone_4.gif")}
                style={{ width: 100, height: 100 }}
                resizeMode="contain"
              />
              <TouchableOpacity onPress={() => navigation.navigate("MyCart")}>
                <MaterialCommunityIcons
                  name="cart"
                  style={{
                    fontSize: 18,
                    color: COLOURS.backgroundMedium,
                    padding: 12,
                    borderRadius: 10,
                    backgroundColor: COLOURS.backgroundLight,
                    borderWidth: 1,
                    borderColor: COLOURS.backgroundLight,
                  }}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                marginBottom: 10,
                padding: 16,
                backgroundColor: "#7FBBF3",
              }}
            >
              <Text
                style={{
                  fontSize: 26,
                  color: COLOURS.black,
                  fontWeight: "500",
                  letterSpacing: 1,
                  marginBottom: 10,
                }}
              >
                Hi-Fi Shop &amp; Service
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: COLOURS.black,
                  fontWeight: "400",
                  letterSpacing: 1,
                  lineHeight: 24,
                }}
              >
                Audio shop on Rustaveli Ave 57.
                {"\n"}This shop offer both products and services
              </Text>
            </View>
            <View
              style={{
                padding: 16,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: COLOURS.black,
                      fontWeight: "500",
                      letterSpacing: 1,
                    }}
                  >
                    Products
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: COLOURS.black,
                      fontWeight: "400",
                      opacity: 0.5,
                      marginLeft: 10,
                    }}
                  >
                    41
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    color: COLOURS.blue,
                    fontWeight: "400",
                  }}
                >
                  SeeAll
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}
              >
                {products.map((data) => {
                  return <ProductCard data={data} key={data.id} />;
                })}
              </View>
            </View>

            <View
              style={{
                padding: 16,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: COLOURS.black,
                      fontWeight: "500",
                      letterSpacing: 1,
                    }}
                  >
                    Accessory
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: COLOURS.black,
                      fontWeight: "400",
                      opacity: 0.5,
                      marginLeft: 10,
                    }}
                  >
                    78
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    color: COLOURS.blue,
                    fontWeight: "400",
                  }}
                >
                  SeeAll
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}
              >
                {accessories.map((data) => {
                  return <ProductCard data={data} key={data.id} />;
                })}
              </View>
            </View>
          </ScrollView>
        </Animatable.View>
      )}
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({});
