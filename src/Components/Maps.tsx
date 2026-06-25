import React, { FC, useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ICONS from "../../Assets/Icons";
import DatingUserCard from "../../Components/Cards/DatingUserCard";
import EventListCard from "../../Components/Cards/EventListCard";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import { darkMapStyle } from "../../Configs/DarkMapConfigs";
import dummyEvents from "../../Seeds/EventData";
import TagPeople from "../../Seeds/TagPeople";
import { MapsScreenProps } from "../../Typings/route";
import { IEvents, ITagPeople } from "../../Typings/type";
import { getDistance } from "../../Utilities/Helpers";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import { USER_LOCATION } from "../Home";
import styles from "./styles";

const Maps: FC<MapsScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState("people");
  const [inittialRegion, setInittialRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const [region, setRegion] = useState(inittialRegion);
  const [visiblePeople, setVisiblePeople] = useState<ITagPeople[]>([]);
  const [visibleEvents, setVisibleEvents] = useState<IEvents[]>([]);

  const filterPeopleInRegion = (region: {
    latitude: number;
    latitudeDelta: number;
    longitude: number;
    longitudeDelta: number;
  }) => {
    const filtered = TagPeople.map((person) => {
      const isWithinRegion =
        person.latitude >= region.latitude - region.latitudeDelta / 2 &&
        person.latitude <= region.latitude + region.latitudeDelta / 2 &&
        person.longitude >= region.longitude - region.longitudeDelta / 2 &&
        person.longitude <= region.longitude + region.longitudeDelta / 2;

      let distance = getDistance(
        USER_LOCATION.latitude,
        USER_LOCATION.longitude,
        person.latitude,
        person.longitude
      ).toFixed(1);

      return isWithinRegion ? { ...person, distance } : null;
    }).filter(Boolean) as ITagPeople[];

    setVisiblePeople(filtered);
  };

  const filterEventsInRegion = (region: {
    latitude: number;
    latitudeDelta: number;
    longitude: number;
    longitudeDelta: number;
  }) => {
    const filtered = dummyEvents
      .map((person) => {
        const isWithinRegion =
          person.latitude >= region.latitude - region.latitudeDelta / 2 &&
          person.latitude <= region.latitude + region.latitudeDelta / 2 &&
          person.longitude >= region.longitude - region.longitudeDelta / 2 &&
          person.longitude <= region.longitude + region.longitudeDelta / 2;

        let distance = getDistance(
          USER_LOCATION.latitude,
          USER_LOCATION.longitude,
          person.latitude,
          person.longitude
        ).toFixed(1);

        return isWithinRegion ? { ...person, distance } : null;
      })
      .filter(Boolean) as IEvents[];

    setVisibleEvents(filtered);
  };

  const renderHeader = () => {
    return (
      <View
        style={[
          styles.headerContainer,
          {
            top: insets.top + verticalScale(Platform.OS === "android" ? 10 : 0),
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconButton}
        >
          <CustomIcon Icon={ICONS.backArrow} height={24} width={24} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={1}
          onPress={() => navigation.navigate("searchHome", { isFromMap: true })}
          style={styles.searchButton}
        >
          <CustomIcon Icon={ICONS.SearchIcon} height={24} width={24} />
          <CustomText fontSize={14}>Search map</CustomText>
        </TouchableOpacity>
      </View>
    );
  };

  const renderBottomListContainer = () => {
    return (
      <View style={styles.bottomListContainer}>
        <View style={styles.tabsContainer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                selectedTab === "people" && styles.selectedTab,
              ]}
              onPress={() => setSelectedTab("people")}
            >
              <CustomText fontSize={14} fontFamily="medium">
                People
              </CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                selectedTab === "event" && styles.selectedTab,
              ]}
              onPress={() => setSelectedTab("event")}
            >
              <CustomText fontSize={14} fontFamily="medium">
                Event
              </CustomText>
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <CustomIcon Icon={ICONS.filtericon} height={20} width={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          {selectedTab === "people" && visiblePeople.length > 0 && (
            <FlatList
              data={visiblePeople}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                gap: horizontalScale(10),
                paddingBottom: insets.bottom,
              }}
              renderItem={({ item }) => (
                <DatingUserCard
                  userData={item}
                  onPress={() => {}}
                  distance={item.distance}
                />
              )}
            />
          )}
          {selectedTab === "event" && (
            <FlatList
              data={visibleEvents}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                gap: horizontalScale(10),
              }}
              renderItem={({ item }) => {
                let distance = getDistance(
                  USER_LOCATION.latitude,
                  USER_LOCATION.longitude,
                  item.latitude,
                  item.longitude
                ).toFixed(0);
                return (
                  <EventListCard
                    eventData={item}
                    onPress={() => {}}
                    distance={distance}
                  />
                );
              }}
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}

      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        customMapStyle={darkMapStyle}
        region={inittialRegion}
        zoomControlEnabled
        onRegionChangeComplete={(newRegion) => {
          setRegion(newRegion);
          filterPeopleInRegion(newRegion);
          filterEventsInRegion(newRegion);
        }}
      >
        {TagPeople.map((user) => (
          <Marker
            anchor={{ x: 0.5, y: 0.5 }}
            key={user.id}
            coordinate={{
              latitude: user.latitude,
              longitude: user.longitude,
            }}
          >
            <View style={styles.markerContainer}>
              <CustomIcon Icon={ICONS.MapMarkerIcon} height={25} width={25} />
              <Image source={{ uri: user.avatar }} style={styles.markerImage} />
            </View>
          </Marker>
        ))}
      </MapView>
      {renderBottomListContainer()}
    </View>
  );
};

export default Maps;

import React, { FC, useState, useEffect } from "react";
import {
  FlatList,
  Image,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import axios from "axios"; // Import axios or use fetch
import ICONS from "../../Assets/Icons";
import DatingUserCard from "../../Components/Cards/DatingUserCard";
import EventListCard from "../../Components/Cards/EventListCard";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import { darkMapStyle } from "../../Configs/DarkMapConfigs";
import { MapsScreenProps } from "../../Typings/route";
import { IEvents, ITagPeople } from "../../Typings/type";
import { getDistance } from "../../Utilities/Helpers";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import styles from "./styles";
import { useAppSelector } from "../../Redux/store";

// Define interfaces to match API response
interface IApiUser {
  _id: string;
  email: string;
  phoneNumber: string;
  userName: string;
  dob: string;
  gender: string;
  interestedIn: string;
  photos: string[];
  location: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
    address: string;
  };
  distance: number;
  distanceInKm: number;
}

// Map API user to ITagPeople
const mapApiUserToTagPeople = (apiUser: IApiUser): ITagPeople => ({
  id: apiUser._id,
  name: apiUser.userName,
  avatar: apiUser.photos[0] || "", // Use first photo as avatar
  latitude: apiUser.location.coordinates[1],
  longitude: apiUser.location.coordinates[0],
  distance: apiUser.distanceInKm.toString(), // Use distanceInKm from API
  // Add other fields required by ITagPeople, with defaults if necessary
  age: apiUser.dob
    ? Math.floor(
        (new Date().getTime() - new Date(apiUser.dob).getTime()) /
          (1000 * 60 * 60 * 24 * 365)
      ).toString()
    : "0",
  // Add other ITagPeople fields as needed
});

const Maps: FC<MapsScreenProps> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState("people");
  const { userData } = useAppSelector((state) => state.user);
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
    name: string;
  } | null>(null);
  const isFromIdentityModal = route?.params?.fromIdentityModal || false;
  const isFromLocationModal = route?.params?.fromLocationModal || false;
  const isFromModal = isFromIdentityModal || isFromLocationModal;
  const [initialRegion, setInitialRegion] = useState({
    latitude: userData?.location.latitude || 37.78825,
    longitude: userData?.location.longitude || -122.4324,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [region, setRegion] = useState(initialRegion);
  const [visiblePeople, setVisiblePeople] = useState<ITagPeople[]>([]);
  const [visibleEvents, setVisibleEvents] = useState<IEvents[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch nearby users from API
  const fetchNearbyUsers = async (region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const userResponse = await fetchData<GetNearbyUsersResponse>(
        ENDPOINTS.GetNearbyUsers,
        {
          longitude,
          latitude,
          maxDistance: 20,
        }
      );
      if (response.data.success) {
        const users: IApiUser[] = response.data.data.users;
        const mappedUsers = users.map(mapApiUserToTagPeople);
        setVisiblePeople(mappedUsers);
      } else {
        setError(response.data.message || "Failed to fetch users");
      }
    } catch (err) {
      setError("Error fetching nearby users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch events (placeholder; implement if you have an events API)
  const fetchNearbyEvents = async (region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }) => {
    // If you have an API for events, implement similar logic here
    // For now, keep using dummyEvents or set to empty
    setVisibleEvents([]); // Replace with API call when available
  };

  // Update region and fetch data
  const handleRegionChange = (newRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }) => {
    setRegion(newRegion);
    fetchNearbyUsers(newRegion);
    fetchNearbyEvents(newRegion);
  };

  const handleLocationConfirm = async () => {
    if (!selectedLocation) return;

    try {
      // Get location name using reverse geocoding (can use Google Maps API or keep as coordinates)
      const locationName = selectedLocation.name || 
        `${selectedLocation.latitude.toFixed(4)}, ${selectedLocation.longitude.toFixed(4)}`;

      // Call the callback if provided
      if (route?.params?.onLocationSelect) {
        route.params.onLocationSelect(locationName);
      }

      // Navigate back and reopen IdentityModal
      navigation.goBack();
    } catch (error) {
      console.error("Error confirming location:", error);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchNearbyUsers(initialRegion);
    fetchNearbyEvents(initialRegion);
  }, []);

  const renderHeader = () => {
    return (
      <View
        style={[
          styles.headerContainer,
          {
            top: insets.top + verticalScale(Platform.OS === "android" ? 10 : 0),
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconButton}
        >
          <CustomIcon Icon={ICONS.backArrow} height={24} width={24} />
        </TouchableOpacity>

        {isFromModal && selectedLocation ? (
          <TouchableOpacity
            onPress={handleLocationConfirm}
            style={{
              paddingVertical: verticalScale(8),
              paddingHorizontal: horizontalScale(12),
              backgroundColor: "#FF006B",
              borderRadius: 8,
            }}
          >
            <CustomText fontSize={14} fontFamily="medium">
              Confirm Location
            </CustomText>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.navigate("searchHome", { isFromMap: true })}
            style={styles.searchButton}
          >
            <CustomIcon Icon={ICONS.SearchIcon} height={24} width={24} />
            <CustomText fontSize={14}>Search map</CustomText>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderBottomListContainer = () => {
    return (
      <View style={styles.bottomListContainer}>
        <View style={styles.tabsContainer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                selectedTab === "people" && styles.selectedTab,
              ]}
              onPress={() => setSelectedTab("people")}
            >
              <CustomText fontSize={14} fontFamily="medium">
                People
              </CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                selectedTab === "event" && styles.selectedTab,
              ]}
              onPress={() => setSelectedTab("event")}
            >
              <CustomText fontSize={14} fontFamily="medium">
                Event
              </CustomText>
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <CustomIcon Icon={ICONS.filtericon} height={20} width={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          {loading && <CustomText>Loading...</CustomText>}
          {error && <CustomText style={{ color: "red" }}>{error}</CustomText>}
          {selectedTab === "people" && visiblePeople.length > 0 && (
            <FlatList
              data={visiblePeople}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                gap: horizontalScale(10),
                paddingBottom: insets.bottom,
              }}
              renderItem={({ item }) => (
                <DatingUserCard
                  userData={item}
                  onPress={() => {}}
                  distance={item.distance}
                />
              )}
            />
          )}
          {selectedTab === "event" && visibleEvents.length > 0 && (
            <FlatList
              data={visibleEvents}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                gap: horizontalScale(10),
              }}
              renderItem={({ item }) => (
                <EventListCard
                  eventData={item}
                  onPress={() => {}}
                  distance={item.distance}
                />
              )}
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        customMapStyle={darkMapStyle}
        region={initialRegion}
        zoomControlEnabled
        onRegionChangeComplete={handleRegionChange}
        onPress={(event) => {
          if (isFromModal) {
            const { latitude, longitude } = event.nativeEvent.coordinate;
            setSelectedLocation({
              latitude,
              longitude,
              name: `Location at ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            });
          }
        }}
      >
        {isFromModal && selectedLocation && (
          <Marker
            coordinate={{
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude,
            }}
          >
            <View style={styles.markerContainer}>
              <CustomIcon Icon={ICONS.MapMarkerIcon} height={25} width={25} />
            </View>
          </Marker>
        )}
        {!isFromIdentityModal &&
          visiblePeople.map((user) => (
            <Marker
              anchor={{ x: 0.5, y: 0.5 }}
              key={user.id}
              coordinate={{
                latitude: user.latitude,
                longitude: user.longitude,
              }}
            >
              <View style={styles.markerContainer}>
                <CustomIcon Icon={ICONS.MapMarkerIcon} height={25} width={25} />
                <Image source={{ uri: user.avatar }} style={styles.markerImage} />
              </View>
            </Marker>
          ))}
      </MapView>
      {!isFromModal && renderBottomListContainer()}
    </View>
  );
};

export default Maps;
