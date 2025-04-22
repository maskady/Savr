// components/ShopHeader.js
import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ActivityIndicator, Text, Appearance } from 'react-native';
import getStyles from '../styles/AppStyles';
import { ArrowLeft, Save, Pencil, X, Share as ShareIcon } from 'lucide-react-native';

export default function ShopHeader({
  editMode, hasChanges, isSaving,
  onBack, onSave, onToggleEdit, onShare
}) {
  const [styles, setStyles] = useState(getStyles());
  return (
    <View style={styles.shopHeader.header}>
      <TouchableOpacity onPress={onBack} style={styles.shopHeader.backButton}>
        <ArrowLeft size={24} color={styles.shopHeader.buttonIcon.color} style={styles.shopHeader.buttonIcon} />
      </TouchableOpacity>
      <View style={styles.shopHeader.actions}>
        {editMode === 'edit' && hasChanges && (
          <TouchableOpacity
            style={[styles.shopHeader.button, isSaving && styles.shopHeader.disabledButton]}
            onPress={onSave}
            disabled={isSaving}
          >
            {isSaving
              ? <ActivityIndicator size="small" color={styles.shopHeader.buttonIcon.color}/>
              : <>
                  <Save size={16} color={styles.shopHeader.buttonIcon.color} style={styles.shopHeader.buttonIcon}/>
                  <Text style={styles.shopHeader.buttonText}>Save</Text>
                </>}
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.shopHeader.button, styles.shopHeader.toggleButton]}
          onPress={onToggleEdit}
          disabled={isSaving}
        >
          {editMode === 'view'
            ? <>
                <Pencil size={16} color={styles.shopHeader.buttonIcon.color} style={styles.shopHeader.buttonIcon}/>
                <Text style={styles.shopHeader.buttonText}>Edit</Text>
              </>
            : <>
                <X size={16} color={styles.shopHeader.buttonIcon.color} style={styles.shopHeader.buttonIcon}/>
                <Text style={styles.shopHeader.buttonText}>Cancel</Text>
              </>}
        </TouchableOpacity>
        <TouchableOpacity onPress={onShare} style={styles.shopHeader.shareButton}>
          <ShareIcon size={24} color={styles.shopHeader.buttonIcon.color} style={styles.shopHeader.buttonIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
