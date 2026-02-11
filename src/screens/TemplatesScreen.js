import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Searchbar, Chip } from 'react-native-paper';
import TemplateCard from '../components/TemplateCard';
import { WORKFLOW_TEMPLATES } from '../utils/constants';

const TemplatesScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Data Processing', 'Communication', 'Analysis', 'Automation'];

  const filteredTemplates = WORKFLOW_TEMPLATES.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUseTemplate = (template) => {
    navigation.navigate('Workflows', {
      screen: 'WorkflowBuilder',
      params: { 
        mode: 'create',
        template: template 
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search templates"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          iconColor="#8899A6"
          inputStyle={{ color: '#fff' }}
          theme={{ colors: { text: '#fff' } }}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
        >
          {categories.map((category) => (
            <Chip
              key={category}
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.selectedChip,
              ]}
              textStyle={{
                color: selectedCategory === category ? '#fff' : '#8899A6',
              }}
            >
              {category}
            </Chip>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.templatesGrid}>
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onUse={() => handleUseTemplate(template)}
            />
          ))}
        </View>

        {filteredTemplates.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No templates found</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    padding: 15,
    paddingBottom: 10,
  },
  searchBar: {
    backgroundColor: '#16213e',
    elevation: 0,
    marginBottom: 15,
  },
  categoryContainer: {
    flexDirection: 'row',
  },
  categoryChip: {
    marginRight: 8,
    backgroundColor: '#16213e',
  },
  selectedChip: {
    backgroundColor: '#6C5CE7',
  },
  scrollView: {
    flex: 1,
  },
  templatesGrid: {
    padding: 15,
    paddingTop: 5,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#8899A6',
    fontSize: 16,
  },
});

export default TemplatesScreen;
