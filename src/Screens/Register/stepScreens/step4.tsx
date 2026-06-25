import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import CustomInput from "../../../Components/CustomInput";
import { CustomText } from "../../../Components/CustomText";
import { responsiveFontSize, verticalScale } from "../../../Utilities/Metrics";

interface Step4Props {
  password: string;
  confirmPassword: string;
  setPassword: (text: string) => void;
  setConfirmPassword: (text: string) => void;
}

const Step4 = ({
  password,
  confirmPassword,
  setPassword,
  setConfirmPassword,
}: Step4Props) => {
  const handlePasswordChange = (text: string) => {
    setPassword(text);
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <View style={styles.container}>
      <CustomText fontSize={responsiveFontSize(24)} fontFamily="bold">
        Create password
      </CustomText>
      <View style={{ gap: verticalScale(15) }}>
        <CustomInput
          value={password}
          placeholder="Create a password"
          onChangeText={handlePasswordChange}
          type="password"
        />
        <CustomInput
          value={confirmPassword}
          placeholder="Confirm password"
          onChangeText={handleConfirmPasswordChange}
          type="password"
        />
      </View>
    </View>
  );
};

export default Step4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: verticalScale(20),
  },
});
