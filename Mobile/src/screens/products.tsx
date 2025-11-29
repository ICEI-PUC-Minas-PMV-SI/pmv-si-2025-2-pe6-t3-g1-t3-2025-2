import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import api from '../api';
import { ProductResponseDTO } from '../api/dto';
import { useLoading } from '../context/loadingContext';

const ProductsScreen = () => {
  const navigation = useNavigation();
  const {withLoading, isLoading} = useLoading();
  const [productsData, setProductsData] = React.useState<ProductResponseDTO[]>([]);

  async function fetchProducts() {
    withLoading(async () => {
      await api.products.getAllProducts().then(data => {
        console.log(data);
        setProductsData(data);
      });
    });
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Produtos</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.button} onPress={fetchProducts}>
            <Text style={styles.buttonText}>Atualizar</Text>
          </TouchableOpacity>
          <Text style={styles.buttonSeparator}>–</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
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
        {productsData.map((product) => (
          <View key={product.id} style={styles.productRow}>
            <Text style={[styles.productCell, styles.nameColumn]}>{product.nome}</Text>
            <Text style={[styles.productCell, styles.priceColumn]}>R$ {product.preco}</Text>
            <Text style={[styles.productCell, styles.categoryColumn]}>-</Text>
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