import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ProductsScreen = () => {
  // Dados dos produtos
  const products = [
    { id: 1, name: 'Suco Laranja', price: 'R$ 12,50', category: '-' },
    { id: 2, name: 'Pizza 6 pedaços', price: 'R$ 45,00', category: '-' },
    { id: 3, name: 'Pão de Queijo', price: 'R$ 5,00', category: '-' },
    { id: 4, name: 'Sonho de Valsa', price: 'R$ 5,00', category: '-' },
    { id: 5, name: 'Caipirinha Limão', price: 'R$ 22,00', category: '-' },
    { id: 6, name: 'Coca Cola', price: 'R$ 12,00', category: '-' },
    { id: 7, name: 'Bombom', price: 'R$ 2,50', category: '-' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Produtos</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Atualizar</Text>
          </TouchableOpacity>
          <Text style={styles.buttonSeparator}>–</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Cabeçalho da tabela */}
      <View style={styles.tableHeader}>
        <Text style={[styles.columnHeader, styles.nameColumn]}>Nome</Text>
        <Text style={[styles.columnHeader, styles.priceColumn]}>Preço</Text>
        <Text style={[styles.columnHeader, styles.categoryColumn]}>Categoria</Text>
      </View>

      {/* Lista de produtos */}
      <ScrollView style={styles.productsList}>
        {products.map((product) => (
          <View key={product.id} style={styles.productRow}>
            <Text style={[styles.productCell, styles.nameColumn]}>{product.name}</Text>
            <Text style={[styles.productCell, styles.priceColumn]}>{product.price}</Text>
            <Text style={[styles.productCell, styles.categoryColumn]}>{product.category}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  buttonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  buttonSeparator: {
    marginHorizontal: 8,
    color: '#666',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
    marginBottom: 8,
  },
  columnHeader: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  productsList: {
    flex: 1,
  },
  productRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12,
  },
  productCell: {
    fontSize: 16,
  },
  nameColumn: {
    flex: 2,
  },
  priceColumn: {
    flex: 1,
    textAlign: 'center',
  },
  categoryColumn: {
    flex: 1,
    textAlign: 'center',
  },
});

export default ProductsScreen;