import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../../styles/LegalDocumentPolicyModalStyles";


export default function LegalDocumentPolicyModal({ visible, onClose }) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View 
        style={styles.backdrop} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View 
          activeOpacity={1} 
          style={styles.modalView}
        >
          <View style={styles.headerContainer}>
            <View style={styles.titleWrapper}>
              <View style={styles.headerIcon}>
                <MaterialIcons name="policy" size={24} color="#1877f2" />
              </View>
              <Text style={styles.modalTitle}>Legal Document Policies</Text>
            </View>
            <TouchableOpacity 
              onPress={onClose} 
              style={styles.closeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialIcons name="close" size={22} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.scrollContent}
            nestedScrollEnabled={true}
          >
            <View style={styles.policySection}>
              <View style={styles.sectionHeader}>
                <View style={[styles.iconWrapper, { backgroundColor: '#e3f2fd' }]}>
                  <MaterialIcons name="description" size={24} color="#1877f2" />
                </View>
                <Text style={styles.sectionTitle}>Document Requirements</Text>
              </View>
              <View style={styles.bulletPoints}>
                <View style={styles.bulletPoint}>
                  <View style={[styles.checkCircle, { backgroundColor: '#e3f2fd' }]}>
                    <MaterialIcons name="check" size={16} color="#1877f2" />
                  </View>
                  <Text style={styles.policyText}>Documents must be clear and legible</Text>
                </View>
                <View style={styles.bulletPoint}>
                  <View style={[styles.checkCircle, { backgroundColor: '#e3f2fd' }]}>
                    <MaterialIcons name="check" size={16} color="#1877f2" />
                  </View>
                  <Text style={styles.policyText}>Supported formats: JPG, PNG</Text>
                </View>
                <View style={styles.bulletPoint}>
                  <View style={[styles.checkCircle, { backgroundColor: '#e3f2fd' }]}>
                    <MaterialIcons name="check" size={16} color="#1877f2" />
                  </View>
                  <Text style={styles.policyText}>No edited or altered documents</Text>
                </View>
              </View>
            </View>

            <View style={styles.policySection}>
              <View style={styles.sectionHeader}>
                <View style={[styles.iconWrapper, { backgroundColor: '#e8f5e9' }]}>
                  <MaterialIcons name="security" size={24} color="#2e7d32" />
                </View>
                <Text style={[styles.sectionTitle, { color: '#2e7d32' }]}>Privacy & Security</Text>
              </View>
              <View style={styles.bulletPoints}>
                <View style={styles.bulletPoint}>
                  <View style={[styles.checkCircle, { backgroundColor: '#e8f5e9' }]}>
                    <MaterialIcons name="check" size={16} color="#2e7d32" />
                  </View>
                  <Text style={styles.policyText}>All documents are securely stored</Text>
                </View>
                <View style={styles.bulletPoint}>
                  <View style={[styles.checkCircle, { backgroundColor: '#e8f5e9' }]}>
                    <MaterialIcons name="check" size={16} color="#2e7d32" />
                  </View>
                  <Text style={styles.policyText}>Only authorized staff can access</Text>
                </View>
                <View style={styles.bulletPoint}>
                  <View style={[styles.checkCircle, { backgroundColor: '#e8f5e9' }]}>
                    <MaterialIcons name="check" size={16} color="#2e7d32" />
                  </View>
                  <Text style={styles.policyText}>Personal information is protected</Text>
                </View>
              </View>
            </View>

            <View style={styles.policySection}>
              <View style={styles.sectionHeader}>
                <View style={[styles.iconWrapper, { backgroundColor: '#fff3e0' }]}>
                  <MaterialIcons name="access-time" size={24} color="#f57c00" />
                </View>
                <Text style={[styles.sectionTitle, { color: '#f57c00' }]}>Processing Time</Text>
              </View>
              <View style={styles.bulletPoints}>
                <View style={styles.bulletPoint}>
                  <View style={[styles.checkCircle, { backgroundColor: '#fff3e0' }]}>
                    <MaterialIcons name="check" size={16} color="#f57c00" />
                  </View>
                  <Text style={styles.policyText}>Documents are reviewed within 24-48 hours</Text>
                </View>
                <View style={styles.bulletPoint}>
                  <View style={[styles.checkCircle, { backgroundColor: '#fff3e0' }]}>
                    <MaterialIcons name="check" size={16} color="#f57c00" />
                  </View>
                  <Text style={styles.policyText}>Status updates will be provided</Text>
                </View>
                <View style={styles.bulletPoint}>
                  <View style={[styles.checkCircle, { backgroundColor: '#fff3e0' }]}>
                    <MaterialIcons name="check" size={16} color="#f57c00" />
                  </View>
                  <Text style={styles.policyText}>You can check status anytime</Text>
                </View>
                <View style={styles.bulletPoint}>
                  <View style={[styles.checkCircle, { backgroundColor: '#fff3e0' }]}>
                    <MaterialIcons name="check" size={16} color="#f57c00" />
                  </View>
                  <Text style={styles.policyText}>Notifications for status changes</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}