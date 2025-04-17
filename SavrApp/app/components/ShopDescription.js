// components/ShopDescription.js
import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet
} from 'react-native';

export default function ShopDescription({
  description,
  editMode,
  onChange,
  colors
}) {
  return (
    <View style={[styles.container, { borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.text }]}>Description</Text>
      {editMode === 'view' ? (
        <Text style={[styles.text, { color: colors.subtext }]}>
          {description || 'No description available for this shop.'}
        </Text>
      ) : (
        <>
          <TextInput
            style={[
              styles.textInput,
              { borderColor: colors.border, color: colors.text }
            ]}
            value={description}
            onChangeText={onChange}
            placeholder="Enter shop description"
            placeholderTextColor={colors.subtext}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          <Text style={[styles.label, { color: colors.subtext }]}>
            Describe your shop to attract customers
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  text: { fontSize: 16, lineHeight: 24 },
  textInput: {
    fontSize: 16,
    lineHeight: 24,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 4
  },
  label: { fontSize: 12, marginTop: 4 }
});