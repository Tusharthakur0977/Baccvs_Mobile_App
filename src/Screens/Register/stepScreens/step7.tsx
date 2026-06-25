import React from "react";
import { StyleSheet, View } from "react-native";
import { CustomText } from "../../../Components/CustomText";
import CustomButton from "../../../Components/Buttons/CustomButton";
import COLORS from "../../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../../Utilities/Metrics";

interface Step7Props {
  selectedGender: string | null;
  setSelectedGender: (gender: string) => void;
}

const Step7 = ({ selectedGender, setSelectedGender }: Step7Props) => {
  const handleGenderSelect = (gender: string) => {
    setSelectedGender(gender);
  };

  return (
    <View style={styles.container}>
      <CustomText fontSize={24} fontFamily="bold">
        What’s your gender?
      </CustomText>
      <View style={styles.buttonRow}>
        <CustomButton
          title="Male"
          textSize={14}
          onPress={() => handleGenderSelect("Male")}
          isFullWidth
          style={[
            styles.genderbtn,
            selectedGender === "Male" && styles.selectedGender,
          ]}
        />
        <CustomButton
          title="Female"
          textSize={14}
          onPress={() => handleGenderSelect("Female")}
          isFullWidth
          style={[
            styles.genderbtn,
            selectedGender === "Female" && styles.selectedGender,
          ]}
        />
      </View>
    </View>
  );
};

export default Step7;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: verticalScale(15),
  },
  buttonRow: {
    flexDirection: "row",
    width: "100%",
    gap: horizontalScale(10),
  },
  genderbtn: {
    backgroundColor: COLORS.inputColor,
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
  },
  selectedGender: {
    borderColor: COLORS.primaryPink,
  },
});
