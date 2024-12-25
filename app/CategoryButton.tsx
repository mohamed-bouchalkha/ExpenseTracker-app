import React from 'react';
import { VStack, Pressable, Icon, Text } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { Category } from './utils/MyCategory';

interface CategoryButtonProps {
  category: Category;
  selected: Category | null;
  onSelect: (category: Category) => void;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({ category, selected, onSelect }) => {
  return (
    <Pressable
      onPress={() => onSelect(category)}
      bg={selected?.label === category.label ? `${category.color}.100` : 'gray.100'}
      px={4}
      py={3}
      borderRadius="md"
      alignItems="center"
      justifyContent="center"
      shadow={selected?.label === category.label ? 3 : 1}
      borderWidth={selected?.label === category.label ? 2 : 0}
      borderColor={selected?.label === category.label ? category.color : 'transparent'}
      flex={1} // Ensures equal width
      m={1} // Adds margin between buttons
    >
      <VStack space={1} alignItems="center">
        <Icon as={<Ionicons name={category.icon as any} />} size="lg" color={category.color} />
        <Text fontSize="sm" fontWeight="bold" color="gray.700">
          {category.label}
        </Text>
      </VStack>
    </Pressable>
  );
};

export default React.memo(CategoryButton);
