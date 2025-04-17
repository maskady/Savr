// components/ShopHeader.js
import React from 'react';
import { View, TouchableOpacity, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { ArrowLeft, Save, Pencil, X, Share as ShareIcon } from 'lucide-react-native';

export default function ShopHeader({
  editMode, hasChanges, isSaving,
  onBack, onSave, onToggleEdit, onShare
}) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <ArrowLeft size={24} color="#fff" />
      </TouchableOpacity>
      <View style={styles.actions}>
        {editMode === 'edit' && hasChanges && (
          <TouchableOpacity
            style={[styles.button, isSaving && styles.disabledButton]}
            onPress={onSave}
            disabled={isSaving}
          >
            {isSaving
              ? <ActivityIndicator size="small" color="#fff"/>
              : <>
                  <Save size={16} color="#fff" style={styles.buttonIcon}/>
                  <Text style={styles.buttonText}>Save</Text>
                </>}
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.button, styles.toggleButton]}
          onPress={onToggleEdit}
          disabled={isSaving}
        >
          {editMode === 'view'
            ? <>
                <Pencil size={16} color="#fff" style={styles.buttonIcon}/>
                <Text style={styles.buttonText}>Edit</Text>
              </>
            : <>
                <X size={16} color="#fff" style={styles.buttonIcon}/>
                <Text style={styles.buttonText}>Cancel</Text>
              </>}
        </TouchableOpacity>
        <TouchableOpacity onPress={onShare} style={styles.shareButton}>
          <ShareIcon size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection:'row', alignItems:'center' },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(46,125,50,0.9)',
    borderRadius: 20,
  },
  disabledButton: { opacity:0.6 },
  toggleButton: { backgroundColor:'rgba(0,0,0,0.2)', marginLeft:8 },
  shareButton: { padding:8, backgroundColor:'rgba(0,0,0,0.2)', borderRadius:20, marginLeft:8 },
  text: { color:'#fff', marginLeft:6, fontWeight:'bold' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 20,
  },

  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 6,
    marginRight: 6,
  },
  buttonIcon: {
    marginRight: 6,
    marginLeft: 4,
  },
});