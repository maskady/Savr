// components/ContactSection.js
import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { Phone, MapPin } from 'lucide-react-native';

export default function ContactSection({
  shop,
  editMode,
  onCall,
  onNavigate,
  onInputChange,
  colors
}) {
  return (
    <View style={[styles.container, { borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.text }]}>Contact & Location</Text>

      <View style={styles.row}>
        <Phone size={20} color={colors.primary} />
        {editMode === 'view' ? (
          <TouchableOpacity onPress={onCall}>
            <Text style={[styles.text, { color: colors.text }]}>{shop.phone}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text }]}
              value={shop.phone}
              onChangeText={text => onInputChange('phone', text)}
              placeholder="Phone number"
              placeholderTextColor={colors.subtext}
              keyboardType="phone-pad"
            />
            <Text style={[styles.label, { color: colors.subtext }]}>
              Phone Number (e.g., +49 123 456 7890)
            </Text>
          </View>
        )}
      </View>

      <View style={styles.row}>
        <MapPin size={20} color={colors.primary} />
        <View style={styles.inputWrapper}>
          {editMode === 'view' ? (
            <TouchableOpacity onPress={onNavigate}>
              {shop.address && <Text style={[styles.text, { color: colors.text }]}>{shop.address}</Text>}
              {(shop.postalCode || shop.city) && (
                <Text style={[styles.text, { color: colors.text }]}>
                  {[shop.postalCode, shop.city].filter(Boolean).join(' ')}
                </Text>
              )}
              {shop.country && <Text style={[styles.text, { color: colors.text }]}>{shop.country}</Text>}
            </TouchableOpacity>
          ) : (
            <>
              {['address','postalCode','city','country'].map((field) => (
                <React.Fragment key={field}>
                  <TextInput
                    style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                    value={shop[field] || ''}
                    onChangeText={text => onInputChange(field, text)}
                    placeholder={field === 'address' ? 'Street address' : field[0].toUpperCase() + field.slice(1)}
                    placeholderTextColor={colors.subtext}
                  />
                  <Text style={[styles.label, { color: colors.subtext }]}>
                    {field === 'address' ? 'Street Address (e.g., 123 Main St)' :
                     field === 'postalCode' ? 'Postal Code (e.g., 10115)' :
                     field === 'city' ? 'City (e.g., Berlin)' :
                     'Country (e.g., Germany)'}
                  </Text>
                </React.Fragment>
              ))}
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 24, paddingBottom: 24, borderBottomWidth: 1 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  text: { fontSize: 16, marginLeft: 12, marginBottom: 4 },
  inputWrapper: { marginLeft: 12, flex: 1 },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 4
  },
  label: { fontSize: 12, marginBottom: 12, marginLeft: 4 }
});