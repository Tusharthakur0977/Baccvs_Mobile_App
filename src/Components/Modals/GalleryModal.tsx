import {
  CameraRoll,
  PhotoIdentifier,
} from "@react-native-camera-roll/camera-roll";
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import {
  FlatList,
  Image,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { launchCamera } from "react-native-image-picker";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ICONS from "../../Assets/Icons";
import { setIsGalleryModalVisible } from "../../Redux/slices/modalSlice";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import COLORS from "../../Utilities/Colors";
import {
  horizontalScale,
  hp,
  verticalScale,
  wp,
} from "../../Utilities/Metrics";
import CustomIcon from "../CustomIcon";
import { CustomText } from "../CustomText";
import { hasAndroidPermission } from "../../Utilities/Helpers";

type GalleryModalProps = {
  selectedItems: PhotoIdentifier[];
  setSelectedItems: Dispatch<SetStateAction<PhotoIdentifier[]>>;
};

const GalleryModal: FC<GalleryModalProps> = ({
  selectedItems,
  setSelectedItems,
}) => {
  const dispatch = useAppDispatch();
  const { isGalleryModalVisible } = useAppSelector((state) => state.modals);
  const insets = useSafeAreaInsets();

  const [photos, setPhotos] = useState<PhotoIdentifier[]>([]);

  const closeModal = () => dispatch(setIsGalleryModalVisible(false));

  const fetchPhotos = async (): Promise<void> => {
    const permissionGranted = await hasAndroidPermission();
    if (permissionGranted) {
      const result = await CameraRoll.getPhotos({
        first: 10,
        assetType: "All",
      });
      setPhotos(result.edges.map((edge) => edge as PhotoIdentifier));
    }
  };

  const toggleSelection = (item: any) => {
    setSelectedItems((prev) => {
      const exists = prev.find((selected) => selected.node.id === item.node.id);
      if (exists) {
        return prev.filter((selected) => selected.node.id !== item.node.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleOpenCamera = async () => {
    const result = await launchCamera(
      {
        quality: 0.1,
        mediaType: "photo",
      },
      (res) => {
        console.log(res);
      }
    );

    console.log(result, "LLLL");
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  return (
    <Modal
      useNativeDriver={true}
      hideModalContentWhileAnimating={true}
      animationIn="slideInUp"
      onBackdropPress={() => {}}
      avoidKeyboard={true}
      style={styles.mainCont}
      isVisible={isGalleryModalVisible}
      backdropOpacity={0.8}
    >
      <View
        style={[
          styles.container,
          {
            paddingTop:
              Platform.OS === "android"
                ? verticalScale(16)
                : insets.top + verticalScale(16),
            paddingBottom:
              Platform.OS === "android"
                ? verticalScale(16)
                : insets.bottom + verticalScale(16),
          },
        ]}
      >
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            <CustomIcon
              onPress={closeModal}
              Icon={ICONS.WhiteCrossIcon}
              width={20}
              height={20}
            />
            <CustomText fontFamily="medium">Recents</CustomText>
          </View>

          <TouchableOpacity
            onPress={closeModal}
            disabled={selectedItems.length === 0}
            style={[
              styles.selectButton,
              {
                opacity: selectedItems.length === 0 ? 0.5 : 1,
              },
            ]}
          >
            <CustomIcon Icon={ICONS.WhiteTickIcon} height={16} width={16} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <FlatList
            data={[
              {
                node: {
                  id: "camera",
                  type: "photo",
                  subTypes: "PhotoLive",
                  sourceType: ["user"],
                  group_name: ["camera"],
                  image: {
                    filename: null,
                    filepath: null,
                    extension: null,
                    uri: "",
                    height: 0,
                    width: 0,
                    fileSize: null,
                    playableDuration: 0,
                    orientation: null,
                  },
                  location: null,
                  modificationTimestamp: 101002,
                  timestamp: 129870,
                },
              },
              ...photos,
            ]}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
            contentContainerStyle={styles.flatListContent}
            columnWrapperStyle={styles.columnWrapper}
            renderItem={({ item, index }) => {
              const isSelected = selectedItems.some(
                (selected) => selected.node.id === item.node.id
              );

              if (item.node.id === "camera") {
                return (
                  <TouchableOpacity
                    onPress={handleOpenCamera}
                    style={styles.mediaContainer}
                  >
                    <CustomIcon
                      Icon={ICONS.CameraIcon}
                      height={24}
                      width={24}
                    />
                    <CustomText fontFamily="medium" fontSize={14}>
                      Camera
                    </CustomText>
                  </TouchableOpacity>
                );
              }

              return (
                <TouchableOpacity
                  style={styles.mediaContainer}
                  onPress={() => toggleSelection(item)}
                >
                  <View style={styles.selectionIndicator}>
                    {isSelected && (
                      <CustomIcon
                        Icon={ICONS.FillTickIcon}
                        width={16}
                        height={16}
                      />
                    )}
                  </View>
                  {item.node.image ? (
                    <Image
                      source={{ uri: item.node.image.uri }}
                      style={styles.image}
                    />
                  ) : (
                    <CustomText>🎥 Video</CustomText>
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </View>
        {selectedItems.length > 0 && (
          <View
            style={[
              styles.selectedImageCont,
              {
                bottom: insets.bottom + 0,
              },
            ]}
          >
            <FlatList
              data={selectedItems}
              horizontal
              contentContainerStyle={{ gap: horizontalScale(5) }}
              renderItem={({ item, index }) => {
                return (
                  <View style={styles.selectedImageItem}>
                    <Image
                      source={{ uri: item.node.image.uri }}
                      style={styles.selectedImage}
                    />
                    <TouchableOpacity
                      onPress={() => toggleSelection(item)}
                      style={styles.removeSelectedButton}
                    >
                      <CustomIcon
                        Icon={ICONS.WhiteCrossIcon}
                        height={12}
                        width={12}
                      />
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          </View>
        )}
      </View>
    </Modal>
  );
};

export default GalleryModal;

const styles = StyleSheet.create({
  mainCont: {
    flex: 1,
    margin: 0,
    padding: 0,
    backgroundColor: COLORS.appBackground,
  },
  container: {
    flex: 1,
    gap: verticalScale(20),
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: horizontalScale(16),
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(20),
  },
  selectButton: {
    backgroundColor: COLORS.primaryPink,
    paddingVertical: verticalScale(8),
    paddingHorizontal: horizontalScale(8),
    borderRadius: 100,
  },
  flatListContent: {
    rowGap: verticalScale(5),
  },
  columnWrapper: {
    justifyContent: "flex-start",
    columnGap: horizontalScale(5),
  },
  image: {
    width: wp(32),
    height: hp(14),
    borderRadius: 5,
  },
  mediaContainer: {
    width: wp(32),
    height: hp(14),
    justifyContent: "center",
    alignItems: "center",
    gap: verticalScale(10),
  },
  selectionIndicator: {
    position: "absolute",
    top: 3,
    right: 3,
    zIndex: 1000,
  },

  selectedImageCont: {
    position: "absolute",
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(10),
    width: wp(100),
  },
  selectedImageItem: {
    position: "relative",
    borderRadius: 5,
    overflow: "hidden",
  },
  selectedImage: {
    height: 50,
    width: 50,
    borderRadius: 5,
  },
  removeSelectedButton: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: COLORS.greyMedium,
    borderRadius: 100,
    padding: 3,
  },
});
