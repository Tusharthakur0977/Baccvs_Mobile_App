import React, { FC, useMemo, useState } from "react";
import {
  FlatList,
  ImageBackground,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
} from "react-native";
import CustomButton from "../../Components/Buttons/CustomButton";
import { CustomText } from "../../Components/CustomText";
import OnBoardingSlides, { SlideType } from "../../Seeds/OnBoardingSeeds";
import { OnBoardingProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import {
  deviceWidth,
  responsiveFontSize,
  verticalScale,
} from "../../Utilities/Metrics";
import styles from "./styles";

const OnBoarding: FC<OnBoardingProps> = ({ navigation }) => {
  const flatListRef = React.useRef<FlatList>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);

  const [layout, setLayout] = useState<null | { height: number }>();

  const updateCurrentSlideIndex = (
    e: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / deviceWidth);
    setCurrentSlideIndex(currentIndex);
  };

  const goToNextSlide = async () => {
    const nextSlideIndex = currentSlideIndex + 1;
    if (nextSlideIndex === OnBoardingSlides.length) {
      navigation.navigate("referral");
    } else {
      const offset = nextSlideIndex * deviceWidth;

      if (flatListRef.current) {
        flatListRef?.current.scrollToOffset({ offset });
        setCurrentSlideIndex(nextSlideIndex);
      }
    }
  };

  const renderSlides = ({
    item,
    index,
  }: {
    item: SlideType;
    index: number;
  }) => {
    return (
      <View key={item.id + index} style={styles.slideContainer}>
        <ImageBackground
          source={item?.image}
          style={styles.slideImage}
          resizeMode="cover"
        >
          <View
            onLayout={(e) => {
              setLayout({
                height: e.nativeEvent.layout.y,
              });
            }}
            style={styles.slideTextCont}
          >
            <CustomText
              fontFamily="bold"
              fontSize={24}
              style={{
                textAlign: "center",
              }}
            >
              {item?.title}
            </CustomText>
            <CustomText
              fontFamily="regular"
              color={COLORS.greyMedium}
              style={{
                textAlign: "center",
              }}
              fontSize={14}
            >
              {item?.subtitle}
            </CustomText>
          </View>
        </ImageBackground>
      </View>
    );
  };

  const renderIndicators = useMemo(() => {
    return (
      layout?.height && (
        <View
          style={[
            styles.indicatorCont,
            {
              position: "absolute",
              alignSelf: "center",
              top: layout?.height - verticalScale(20),
            },
          ]}
        >
          {OnBoardingSlides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentSlideIndex === index && styles.indicatorActive,
              ]}
            />
          ))}
        </View>
      )
    );
  }, [layout, currentSlideIndex]);

  return (
    <View style={styles.container}>
      <View>
        <FlatList
          ref={flatListRef}
          data={OnBoardingSlides}
          onMomentumScrollEnd={updateCurrentSlideIndex}
          showsHorizontalScrollIndicator={false}
          horizontal
          pagingEnabled
          renderItem={renderSlides}
        />
      </View>
      {renderIndicators}
      <View style={{ gap: verticalScale(10) }}>
        <CustomButton title="Get Started" onPress={goToNextSlide} isFullWidth />
        <CustomText
          fontSize={responsiveFontSize(14)}
          fontFamily="bold"
          style={styles.text}
        >
          Already have an account?{` `}
          <CustomText
            fontFamily="bold"
            fontSize={14}
            color={COLORS.primaryPink}
            onPress={() => {
              navigation.navigate("signIn");
            }}
          >
            Sign in
          </CustomText>
        </CustomText>
      </View>
    </View>
  );
};

export default OnBoarding;
