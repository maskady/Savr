import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet
} from 'react-native';
import { businessCategories } from "../constants/businessCategories";
import { COLORS } from '../constants/colors';
import { t } from 'i18next';

const CategoryDropdown = ({shop, onInputChange, category}) => {
    const colors = COLORS;

    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

    const placeholder = 'Select Category';
    category = category || shop?.primaryCategory;
    let text = placeholder;
    if (category) {
        text = businessCategories[category]?.name;
    }
    const textColor = text === placeholder ? colors.placeholder : colors.text;


    return (
        <>
        <TouchableOpacity
            style={[styles.dropdownTrigger, { borderColor: colors.border }]}
            onPress={() => setShowCategoryDropdown(true)}
        >
            <Text style={{ color: textColor }}>
                {text}
            </Text>
        </TouchableOpacity>
        {showCategoryDropdown && (
            <Modal
                transparent
                animationType="fade"
                onRequestClose={() => setShowCategoryDropdown(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowCategoryDropdown(false)}
                >
                <View style={styles.dropdownMenu}>
                    {Object.entries(businessCategories).map(([key, cat]) => (
                    <TouchableOpacity
                        key={key}
                        style={styles.dropdownItem}
                        onPress={() => {
                            onInputChange('primaryCategory', key);
                            setShowCategoryDropdown(false);
                        }}
                    >
                        <Text>{cat.name}</Text>
                    </TouchableOpacity>
                    ))}
                </View>
                </TouchableOpacity>
            </Modal>
        )}
        </>
    );
};

const styles = StyleSheet.create({

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  dropdownMenu: {
    backgroundColor: '#fff',
    width: 250,
    borderRadius: 4,
    maxHeight: 300
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 12
  },
  dropdownTrigger: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 4
  },
})

export default CategoryDropdown;