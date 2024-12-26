import React, { useState, useEffect } from 'react';
import { VStack, HStack, Box, Text, Button, Switch, Icon, Image, useColorMode, useToast } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import API from "./utils/api"; // Votre instance Axios
import { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfilePage = () => {
  const { colorMode, toggleColorMode } = useColorMode(); // For dark mode
  const [isDarkMode, setIsDarkMode] = useState(colorMode === 'dark');
  const toast = useToast();
  const router = useRouter();

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
    setIsDarkMode((prevMode) => !prevMode); // Update state for dark mode
    toast.show({
      title: isDarkMode ? 'Light Mode Enabled' : 'Dark Mode Enabled',
      variant: 'info',
      duration: 2000,
    });
  };

  // Handle Change Password
  const handleChangePassword = () => {
    router.push('/Changepassword'); // Navigate to the Change Password page
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
  
  // Use effect to trigger fade-in on mount
  useEffect(() => {
    fadeAnim.value = 1; // Fade in after component mounts
  }, []);

  return (
    <VStack flex={1} space={4} px={4} pt={6} bg="background" alignItems="center" justifyContent="center">
      {/* Logo */}
      <Box bg="purple.600" p={6} rounded="full" shadow={3} mb={6} style={animatedStyle}>
        <Image
          source={require("./assets/expenselogo.png")} // Replace with your actual logo URL or local asset
          alt="App Logo"
          size="xl"
          resizeMode="contain"
        />
      </Box>

      {/* Account Name */}
      <Text fontSize="2xl" fontWeight="bold" color="gray.700" mb={4} style={animatedStyle}>
        John Doe
      </Text>

      {/* Dark Mode Toggle */}
      <HStack alignItems="center" space={2} mb={4}>
        <Text fontSize="md" color="gray.700">
          Dark Mode
        </Text>
        <Switch
          isChecked={isDarkMode}
          onToggle={handleDarkModeToggle}
          colorScheme="purple"
        />
      </HStack>

      {/* Notification Button */}
      <Button
        mt={2}
        variant="outline"
        colorScheme="purple"
        leftIcon={<Icon as={<Ionicons name="notifications" />} size="md" color="purple.600" />}
        width="80%"
        onPress={() => toast.show({ title: 'Notification settings!' })}
        style={animatedStyle}
      >
        Notifications
      </Button>

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
    </VStack>
  );
};

export default ProfilePage;
