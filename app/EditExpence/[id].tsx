import React, { useState, useCallback, useEffect, useRef } from 'react';
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
import { useNavigation, useRoute } from '@react-navigation/native';
import { categories as importedCategories } from '../utils/MyCategory';
import { Category as ImportedCategory } from '../utils/MyCategory';
import CategoryButton from '../CategoryButton'; // Correct default import
import API from '../utils/api'; // Assurez-vous que le chemin vers api.js est correct
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditExpenseScreen = () => {

  const [selectedCategory, setSelectedCategory] = useState<ImportedCategory | null>(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const toast = useToast();
  const navigation = useNavigation();
  const route = useRoute();
  const amountRef = useRef<string>(amount);
  const expenseId = (route.params as { id?: string })?.id;

  

  const fetchExpenseData = async (id: string) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('User not authenticated');
      const response = await API.get(`/api/expenses/getExpense/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data); // Check the structure of the response
      const { amount, description, categoryID } = response.data;
      setAmount(amount.toString());
      setDescription(description);
      setSelectedCategory(importedCategories.find((cat) => cat._id === categoryID) || null);
    } catch (error) {
      console.error('Error fetching expense data:', error);
      toast.show({
        title: 'Failed to load expense data',
        variant: 'solid',
        duration: 3000,
      });
    }
  };
  

  const handleSave = async () => {
    if (!amount || !selectedCategory) {
      toast.show({
        title: 'Please enter an amount and select a category',
        variant: 'solid',
        duration: 3000,
      });
      return;
    }

    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      toast.show({
        title: 'User not authenticated',
        variant: 'solid',
        duration: 3000,
      });
      return;
    }

    const userID = await AsyncStorage.getItem('userID');
    if (!userID) {
      toast.show({
        title: 'User not authenticated',
        variant: 'solid',
        duration: 3000,
      });
      return;
    }

    try {
      const expenseData = {
        amount: parseFloat(amount),
        description,
        categoryID: selectedCategory._id,
        userID,
      };

      const url = isEditMode
        ? `/api/expenses/updateExpense/${expenseId}`
        : '/api/expenses/addExpense';

      const method = isEditMode ? 'put' : 'post';

      const response = await API[method](url, expenseData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === (isEditMode ? 200 : 201)) {
        toast.show({
          title: `Expense ${isEditMode ? 'updated' : 'saved'} successfully!`,
          variant: 'solid',
          duration: 3000,
        });
        navigation.goBack();
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'saving'} expense:`, error);
      toast.show({
        title: `Failed to ${isEditMode ? 'update' : 'save'} expense. Try again!`,
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

  const renderCategoryItem = ({ item }: { item: ImportedCategory }) => (
    <CategoryButton
      category={item}
      selected={selectedCategory?._id === item._id ? item : null}
      onSelect={handleCategorySelect}
    />
  );
  useEffect(() => {
    console.log('Categories:', importedCategories); // Ensure categories are available
  }, []);
    
  useEffect(() => {
    console.log('Expense ID:', expenseId); // Check if the ID is valid
    if (expenseId) {
      setIsEditMode(true);
      fetchExpenseData(expenseId);
    }
  }, [expenseId]);
  
  return (
    <VStack flex={1} px={4} pt={6}>
      <HStack justifyContent="space-between" alignItems="center" pb={4}>
        <Text fontSize="2xl" fontWeight="bold" color="purple.600">
          {isEditMode ? 'Edit Expense' : 'Add Expense'}
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
          onChangeText={setAmount}
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
            {isEditMode ? 'UPDATE' : 'SAVE'}
          </Text>
        </Button>
      </Center>
    </VStack>
  );
};

export default EditExpenseScreen;
