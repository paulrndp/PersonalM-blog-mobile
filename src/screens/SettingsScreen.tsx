import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { getApiUrl, setApiUrl, DEFAULT_API_URL } from "../services/api";
import { Server, CheckCircle, Info, Feather } from "lucide-react-native";

export default function SettingsScreen() {
  const [url, setUrl] = useState(getApiUrl());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setApiUrl(url.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    setUrl(DEFAULT_API_URL);
    setApiUrl(DEFAULT_API_URL);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* API Configuration Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Server size={18} color="#b45309" />
          <Text style={styles.cardTitle}>Backend API Configuration</Text>
        </View>

        <Text style={styles.cardDesc}>
          Set the address of your <Text style={{ fontWeight: "bold" }}>PersonalM-blog-api</Text> instance.
        </Text>

        <TextInput
          value={url}
          onChangeText={setUrl}
          placeholder="http://192.168.1.X:5000/api/v1"
          placeholderTextColor="#94a3b8"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save API URL</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
            <Text style={styles.resetBtnText}>Reset Default</Text>
          </TouchableOpacity>
        </View>

        {saved && (
          <View style={styles.savedBanner}>
            <CheckCircle size={14} color="#166534" />
            <Text style={styles.savedBannerText}>API URL updated successfully!</Text>
          </View>
        )}
      </View>

      {/* About App & Author */}
      <View style={[styles.card, { marginTop: 16 }]}>
        <View style={styles.cardHeader}>
          <Feather size={18} color="#b45309" />
          <Text style={styles.cardTitle}>About PersonalM Mobile</Text>
        </View>

        <Text style={styles.aboutText}>
          The official cross-platform reading app for author <Text style={{ fontWeight: "bold" }}>Hannah Montemayor</Text>.
        </Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>App Version:</Text>
          <Text style={styles.infoValue}>1.0.0 (Release)</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Framework:</Text>
          <Text style={styles.infoValue}>React Native &amp; Expo SDK 52</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Platforms:</Text>
          <Text style={styles.infoValue}>iOS &amp; Android Native</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Ecosystem:</Text>
          <Text style={styles.infoValue}>PersonalM Multi-Client Suite</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faf9f6",
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
    fontFamily: "serif",
  },
  cardDesc: {
    fontSize: 12,
    color: "#64748b",
    lineHeight: 18,
    marginBottom: 14,
  },
  input: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: "#0f172a",
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: "#b45309",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  saveBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 12,
  },
  resetBtn: {
    backgroundColor: "#f1f5f9",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  resetBtnText: {
    color: "#475569",
    fontWeight: "600",
    fontSize: 12,
  },
  savedBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#f0fdf4",
    padding: 8,
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  savedBannerText: {
    fontSize: 12,
    color: "#166534",
    fontWeight: "600",
  },
  aboutText: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 20,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  infoLabel: {
    fontSize: 12,
    color: "#64748b",
  },
  infoValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0f172a",
  },
});
