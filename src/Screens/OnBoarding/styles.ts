import { StyleSheet } from "react-native";
import COLORS from "../../Utilities/Colors";
import {
  deviceHeight,
  deviceWidth,
  horizontalScale,
  hp,
  responsiveFontSize,
  verticalScale,
  wp,
} from "../../Utilities/Metrics";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
  },
  slideImage: {
    height: deviceHeight * 0.8,
    width: deviceWidth,
    justifyContent: "flex-end",
  },

  slideContainer: {
    alignItems: "center",
    width: wp(100),
  },

  slideTextCont: {
    gap: verticalScale(15),
    width: wp(70),
    alignSelf: "center",
    paddingVertical: verticalScale(20),
  },

  image: {
    height: "100%",
    width: "100%",
    resizeMode: "contain",
  },

  indicatorCont: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: verticalScale(10),
    gap: horizontalScale(5),
  },

  indicator: {
    height: verticalScale(7),
    width: verticalScale(7),
    backgroundColor: COLORS.voilet,
    borderRadius: 100,
  },

  indicatorActive: {
    backgroundColor: COLORS.primaryPink,
    width: horizontalScale(25),
  },

  text: {
    textAlign: "center",
  },
});

export default styles;
