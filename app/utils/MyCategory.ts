export interface Category {
  label: string;
  icon: string;
  color: string;
  _id: string; // Remplacez "id" par "_id"
}

export const categories: Category[] = [
  { label: 'Grocery', icon: 'cart', color: 'blue.500', _id: '676c6c194fbd03dcae6f6734' },
  { label: 'Fuel', icon: 'car', color: 'green.500', _id: '676c6c254fbd03dcae6f6737' },
  { label: 'Food & Drink', icon: 'fast-food', color: 'orange.500', _id: '676c6c2e4fbd03dcae6f673a' },
  { label: 'Travel', icon: 'airplane', color: 'yellow.500', _id: '676c6c454fbd03dcae6f673d' },
  { label: 'Medicine', icon: 'medkit', color: 'red.500', _id: '676c6c4c4fbd03dcae6f6740' },
  { label: 'Bills', icon: 'document-text', color: 'teal.500', _id: '676c6c544fbd03dcae6f6743' },
  { label: 'Gifts', icon: 'gift', color: 'cyan.500', _id: '676c6c5b4fbd03dcae6f6746' },
  { label: 'Clothes', icon: 'shirt', color: 'pink.500', _id: '676c6c624fbd03dcae6f6749' },
  { label: 'Autre', icon: 'ellipsis-horizontal', color: 'gray.500', _id: '676d2d474a61e04ec248a10a' },
];
