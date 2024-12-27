import React, { useState, useCallback, useRef } from 'react';
import {
  VStack,
  HStack,
  Box,
  Input,
  Text,
  Button,
  Pressable,
  Icon,
  Center,
  FlatList,
  useToast,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { categories as importedCategories } from './utils/MyCategory';
import { Category as ImportedCategory } from './utils/MyCategory';
import CategoryButton from './CategoryButton'; // Correct default import
import API from './utils/api'; // Assurez-vous que le chemin vers api.js est correct
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddExpenseScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState<ImportedCategory | null>(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const toast = useToast();
  const navigation = useNavigation();
  const amountRef = useRef<string>(amount);

  // Debounced function for handling input change
  const handleAmountChange = useCallback((value: string) => {
    amountRef.current = value; // Use ref to capture input value
    setAmount(value); // Update state only after debouncing
  }, []);

// Dans le frontend (AddExpenseScreen)
const handleSave = async () => {
  if (!amount || !selectedCategory) {
    toast.show({
      title: 'Please enter an amount and select a category',
      variant: 'solid',
      duration: 3000,
    });
    return;
  }

  // Récupérer le token depuis AsyncStorage
  const token = await AsyncStorage.getItem('authToken');  // Assurez-vous d'avoir le token dans AsyncStorage

  if (!token) {
    toast.show({
      title: 'User not authenticated',
      variant: 'solid',
      duration: 3000,
    });
    return;
  }

  // Récupérer l'ID utilisateur depuis AsyncStorage
  const userID = await AsyncStorage.getItem('userID');  // Récupérer l'ID utilisateur

  if (!userID) {
    toast.show({
      title: 'User not authenticated',
      variant: 'solid',
      duration: 3000,
    });
    return;
  }

  try {
    // Préparation des données pour l'API
    const expenseData = {
      amount: parseFloat(amount),
      date: new Date(),
      description,
      categoryID: selectedCategory._id,  // ID de la catégorie
      userID: userID,  // Utiliser l'ID de l'utilisateur récupéré
    };

    // Log des données avant l'envoi à l'API
    console.log("Selected category:", selectedCategory);
    console.log("Expense data:", expenseData);

    // Envoi des données à l'API
    const response = await API.post(
      '/api/expenses/addExpense',
      expenseData,
      {
        headers: {
          Authorization: `Bearer ${token}`,  // Utilisez le token dans les headers
        }
      }
    );

    console.log("Response from API:", response);

    if (response.status === 201) {
      toast.show({
        title: 'Expense saved successfully!',
        variant: 'solid',
        duration: 3000,
      });
      setAmount('');
      setDescription('');
      setSelectedCategory(null);
    }
  } catch (error) {
    console.error("Error saving expense:", error);
    toast.show({
      title: 'Failed to save expense. Try again!',
      variant: 'solid',
      duration: 3000,
    });
  }
};





  const handleCategorySelect = (category: ImportedCategory) => {
    setSelectedCategory(category);
    console.log(`Selected category ID: ${category._id}`); // Affiche l'ID dans la console
  };
  
  const handleClose = () => {
    navigation.goBack();
  };

  // Render category items
  const renderCategoryItem = ({ item }: { item: ImportedCategory }) => (
    <CategoryButton
      category={item}
      selected={selectedCategory?._id === item._id ? item : null}
      onSelect={handleCategorySelect}
    />
  );

  return (
    <VStack flex={1} px={4} pt={6}>
      <HStack justifyContent="space-between" alignItems="center" pb={4}>
        <Text fontSize="2xl" fontWeight="bold" color="purple.600">
          Add Expense
        </Text>
        <Pressable onPress={handleClose}>
          <Icon as={<Ionicons name="close" />} size="lg" color="gray.400" />
        </Pressable>
      </HStack>

      <Box bg="white" p={4} shadow={2} borderRadius="lg">
        <Text fontSize="md" fontWeight="bold" color="gray.700">
          Enter Amount (DH)
        </Text>
        <Input
          placeholder="0.00"
          fontSize="2xl"
          value={amount}
          onChangeText={handleAmountChange} // Using debounced input handler
          keyboardType="numeric"
          bg="gray.100"
          borderWidth={0}
          mt={2}
          py={3}
          px={4}
          borderRadius="md"
          color="purple.600"
        />
      </Box>

      <Box>
        <Text fontSize="md" fontWeight="bold" color="gray.700" mb={3}>
          Select Category
        </Text>
      </Box>

      {/* FlatList for Category Buttons in Grid */}
      <FlatList
    data={importedCategories || []}
    renderItem={renderCategoryItem}
    keyExtractor={(item, index) => item._id?.toString() || index.toString()}
    numColumns={3}
    columnWrapperStyle={{ justifyContent: 'space-between' }}
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{ paddingBottom: 50 }}
/>


      <Box bg="white" p={4} shadow={2} borderRadius="lg">
        <Text fontSize="md" fontWeight="bold" color="gray.700">
          Description
        </Text>
        <Input
          placeholder="Add a brief description"
          fontSize="md"
          value={description}
          onChangeText={setDescription}
          bg="gray.100"
          borderWidth={0}
          mt={2}
          py={3}
          px={4}
          borderRadius="md"
          color="purple.600"
        />
      </Box>

      <Center mt={6}>
        <Button
          bg="purple.600"
          px={8}
          py={4}
          borderRadius="full"
          onPress={handleSave}
          shadow={3}
          _pressed={{ bg: 'purple.700' }}
        >
          <Text fontSize="md" fontWeight="bold" color="white">
            EDIT
          </Text>
        </Button>
      </Center>
    </VStack>
  );
};

export default AddExpenseScreen;
