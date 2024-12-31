import React, { useState, useEffect } from 'react';
import { VStack, HStack, Box, Text, Button, Switch, Icon, Image, useColorMode, useToast } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import API from "./utils/api"; // Your Axios instance
import { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from "./FooterNavigationComp";
import { useNavigationState } from '@react-navigation/native';
import { BackHandler } from 'react-native';

const ProfilePage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { colorMode, toggleColorMode } = useColorMode(); // For dark mode
  const toast = useToast();
  const router = useRouter();
  const [activeFooter, setActiveFooter] = useState<string>("Profile");

   // Use useNavigationState to track the current route
   const currentRoute = useNavigationState((state) => state.routes[state.index].name);

   useEffect(() => {
     // Update activeFooter based on currentRoute
     if (currentRoute === "ProfileScreen") {
       setActiveFooter("Profile");
     } else if (currentRoute === "GraphReportScreen") {
       setActiveFooter("Graph");
     } else if (currentRoute === "HistoryPage") {
       setActiveFooter("History");
     } else if (currentRoute === "MainScreen") {
       setActiveFooter("Home");
     }
 
     const onBackPress = () => {
       // Handle back button press if necessary
       // Optionally, add logic to handle confirmation for exit
       return false; // Prevent default back action (optional)
     };
 
     BackHandler.addEventListener("hardwareBackPress", onBackPress);
 
     return () => {
       BackHandler.removeEventListener("hardwareBackPress", onBackPress);
     };
   }, [currentRoute]); // Re-run whenever the route changes
 
  // User status state (active or not)
  const [isActive, setIsActive] = useState(true); // Default: active

  // User name state
  const [userName, setUserName] = useState<string | null>(null);

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Shared value for fade animation
  const fadeAnim = useSharedValue(0); // Initial opacity is 0 (fully transparent)

  // Animated style for fade effect
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(fadeAnim.value, { duration: 500 }), // Fade effect with 500ms duration
    };
  });

  // Handle Dark Mode Toggle
  const handleDarkModeToggle = () => {
    toggleColorMode(); // This toggles between light and dark mode
    toast.show({
      title: colorMode === 'dark' ? 'Light Mode Enabled' : 'Dark Mode Enabled',
      variant: 'info',
      duration: 2000,
    });
  };

  const handleFooterPress = (label: string, route: string) => {
    setActiveFooter(label);
    if (
      route === "/MainScreen" ||
      route === "/GraphReportScreen" ||
      route === "/ProfileScreen" ||
      route === "/HistoryPage"
    ) {
      router.push(route);
    }
  };

  // Handle Change Password
  const handleChangePassword = () => {
    router.push('/Changepassword'); // Navigate to the Change Password page
  };
  const handleSetGoal = () => {
    router.push('/SetGoalScreen'); // Navigate to the Change Password page
  };
  const handleAbout = () => {
    router.push('/AboutScreen'); // Navigate to the Change Password page
  };
  const handleLogout = async () => {
    try {
      const userID = await AsyncStorage.getItem('userID');
      if (!userID) throw new Error('User ID not found');

      await API.post('/api/auth/logout', { userID });
      await AsyncStorage.multiRemove(['authToken', 'userID']);
      router.replace('./LoginScreen');
      toast.show({ title: 'Logged Out Successfully!', variant: 'success', duration: 2000 });
    } catch (error) {
      console.error('Logout Error:', error);
      toast.show({ title: 'Logout Failed', variant: 'error', duration: 2000 });
    }
  };
  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await API.get("/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Assume the response includes the user's firstName and lastName
      setUserName(`${response.data.firstName} ${response.data.lastName}`);
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError("Failed to load user data.");
    }
  };
  
  // Use effect to trigger fade-in on mount
  useEffect(() => {
    const checkAuthentication = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        setIsAuthenticated(true); // L'utilisateur est connecté
      } else {
        setIsAuthenticated(false); // L'utilisateur n'est pas connecté
      }
    };
  
    checkAuthentication();
    fadeAnim.value = 1; // Fade in after component mounts
    fetchUserProfile(); // Fetch the user profile when the component mounts

  }, []);

  return (
    <VStack
      flex={1}
      space={4}
      px={4}
      pt={6}
      pb={16} // Add padding at the bottom to avoid overlap with Footer
      bg={colorMode === 'dark' ? 'gray.800' : 'white'} // Change background color based on dark mode
      alignItems="center"
      justifyContent="center"
    >
      {/* Logo */}
      <Box bg="purple.600" p={6} rounded="full" shadow={3} mb={6} style={animatedStyle}>
        <Image
          source={require("./assets/expenselogo.png")} // Replace with your actual logo URL or local asset
          alt="App Logo"
          size="xl"
          resizeMode="contain"
        />
        
      </Box>

      {/* Account Name with Activity Status */}
      <HStack alignItems="center" space={2} mb={4} style={animatedStyle}>
      <Text fontSize="2xl" fontWeight="bold" color={colorMode === 'dark' ? 'white' : 'gray.700'}>
  {userName ? userName : 'Loading...'}
</Text>

<Box
  bg={isAuthenticated ? "green.500" : "red.500"}
  size={3}
  borderRadius="full"
  ml={2}
/>

      </HStack>

      {/* Dark Mode Toggle */}
      <HStack alignItems="center" space={2} mb={4}>
        <Text fontSize="md" color={colorMode === 'dark' ? 'white' : 'gray.700'}>
          Dark Mode
        </Text>
        <Switch
          isChecked={colorMode === 'dark'}
          onToggle={handleDarkModeToggle}
          colorScheme="purple"
        />
      </HStack>

      {/* Notification Button */}
      <Button
        mt={2}
        variant="outline"
        colorScheme="purple"
        leftIcon={<Icon as={<Ionicons name="information-circle" />} size="md" color="purple.600" />}
        width="80%"
        onPress={handleAbout}
        style={animatedStyle}
      >
        About
      </Button>
      {/* Goal Button*/}
      {/* <Button
        mt={2}
        variant="outline"
        colorScheme="purple"
        leftIcon={<Icon as={<Ionicons name="trophy" />} size="md" color="purple.600" />}
        width="80%"
        onPress={handleSetGoal}
        style={animatedStyle}
      >
        Goal Settings !
      </Button> */}
      {/* Change Password Button */}
      <Button
        mt={4}
        variant="solid"
        colorScheme="purple"
        leftIcon={<Icon as={<Ionicons name="key" />} size="md" color="white" />}
        width="80%"
        onPress={handleChangePassword}
        style={animatedStyle}
      >
        Change Password
      </Button>

      {/* Logout Button */}
      <Button
        mt={4}
        variant="outline"
        colorScheme="red"
        leftIcon={<Icon as={<Ionicons name="log-out" />} size="md" color="red.600" />}
        width="80%"
        onPress={handleLogout}
        style={animatedStyle}
      >
        Logout
      </Button>

      {/* Footer */}
      <Footer activeFooter={activeFooter} handleFooterPress={handleFooterPress} />
    </VStack>
  );
};

export default ProfilePage;
