// components/ContactSection.js
import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import getStyles from '../styles/AppStyles';
import { COLORS } from '../constants/colors';
import { Phone, MapPin } from 'lucide-react-native';

export default function ContactSection({
  shop,
  editMode,
  onCall,
  onNavigate,
  onInputChange,
}) {
  const styles = getStyles();
  return (
    <View style={styles.contactSection.container}>
      <Text style={styles.contactSection.title}>Contact & Location</Text>

      <View style={styles.contactSection.row}>
        <Phone style={styles.contactSection.icon} />
        {editMode === 'view' ? (
          <TouchableOpacity onPress={onCall}>
            <Text style={styles.contactSection.text}>{shop.phone}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.contactSection.inputWrapper}>
            <TextInput
              style={styles.contactSection.input}
              value={shop.phone}
              onChangeText={text => onInputChange('phone', text)}
              placeholder="Phone number"
              placeholderTextColor={COLORS.placeholder}
              keyboardType="phone-pad"
            />
            <Text style={styles.contactSection.label}>
              Phone Number (e.g., +49 123 456 7890)
            </Text>
          </View>
        )}
      </View>

      <View style={styles.contactSection.row}>
        <MapPin style={styles.contactSection.icon} />
        <View style={styles.contactSection.inputWrapper}>
          {editMode === 'view' ? (
            <TouchableOpacity onPress={onNavigate}>
              {shop.address && <Text style={styles.contactSection.text}>{shop.address}</Text>}
              {(shop.postalCode || shop.city) && (
                <Text style={styles.contactSection.text}>
                  {[shop.postalCode, shop.city].filter(Boolean).join(' ')}
                </Text>
              )}
              {shop.country && <Text style={styles.contactSection.text}>{shop.country}</Text>}
            </TouchableOpacity>
          ) : (
            <>
              {['address','postalCode','city','country'].map((field) => (
                <React.Fragment key={field}>
                  <TextInput
                    style={styles.contactSection.input}
                    value={shop[field] || ''}
                    onChangeText={text => onInputChange(field, text)}
                    placeholder={field === 'address' ? 'Street address' : field[0].toUpperCase() + field.slice(1)}
                    placeholderTextColor={COLORS.placeholder}
                  />
                  <Text style={styles.contactSection.label}>
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
