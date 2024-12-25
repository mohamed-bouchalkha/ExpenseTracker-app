// categories.ts

export interface Category {
    label: string;
    icon: string;
    color: string;
    id: string;
  }
  
  export const categories: Category[] = [
    { label: 'Grocery', icon: 'cart', color: 'blue.500', id: 'category1' },
    { label: 'Fuel', icon: 'car', color: 'green.500', id: 'category2' },
    { label: 'Food & Drink', icon: 'fast-food', color: 'orange.500', id: 'category3' },
    { label: 'Travel', icon: 'airplane', color: 'yellow.500', id: 'category4' },
    { label: 'Medicine', icon: 'medkit', color: 'red.500', id: 'category5' },
    { label: 'Bills', icon: 'document-text', color: 'teal.500', id: 'category6' },
    { label: 'Gifts', icon: 'gift', color: 'cyan.500', id: 'category7' },
    { label: 'Clothes', icon: 'shirt', color: 'pink.500', id: 'category8' },
  ];
  