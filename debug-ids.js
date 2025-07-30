import { mockDataStore, generateProduct } from './src/mocks/data/mockData.js';

console.log('=== Debug ID Generation ===');

// Check existing products
const existingProducts = mockDataStore.getProducts();
console.log('Existing products count:', existingProducts.length);
console.log('First 10 product IDs:', existingProducts.slice(0, 10).map(p => p.id));

// Generate 5 new products
console.log('\n=== Generating 5 new products ===');
for (let i = 0; i < 5; i++) {
  const product = generateProduct();
  console.log(`Generated product ${i + 1}: ID ${product.id}, Name: ${product.name}`);
}

// Check for duplicates in existing products
const ids = existingProducts.map(p => p.id);
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
console.log('\n=== Duplicate Analysis ===');
console.log('Duplicate IDs found:', [...new Set(duplicateIds)]);

// Group by ID to see duplicates
const idGroups = {};
existingProducts.forEach(product => {
  if (!idGroups[product.id]) {
    idGroups[product.id] = [];
  }
  idGroups[product.id].push(product.name);
});

Object.entries(idGroups).forEach(([id, names]) => {
  if (names.length > 1) {
    console.log(`ID ${id} appears ${names.length} times:`, names);
  }
});
