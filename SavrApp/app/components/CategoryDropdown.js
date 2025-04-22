import React, {useState, useEffect} from 'react';
import { View, Text, TouchableOpacity, Modal, Appearance } from 'react-native';
import getStyles from '../styles/AppStyles';
import { businessCategories } from "../constants/businessCategories";
import { COLORS } from '../constants/colors';
import { t } from 'i18next';

const CategoryDropdown = ({shop, onInputChange, category}) => {
    const [styles, setStyles] = useState(getStyles());
    useEffect(() => {
      const sub = Appearance.addChangeListener(() => setStyles(getStyles()));
      return () => sub.remove();
    }, []);

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
            style={styles.categoryDropdown.dropdownTrigger}
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
                    style={styles.categoryDropdown.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowCategoryDropdown(false)}
                >
                <View style={styles.categoryDropdown.dropdownMenu}>
                    {Object.entries(businessCategories).map(([key, cat]) => (
                    <TouchableOpacity
                        key={key}
                        style={styles.categoryDropdown.dropdownItem}
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

export default CategoryDropdown;