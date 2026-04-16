import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput, Alert, Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useTranslation } from "../i18n/LanguageContext";
import { COLORS } from "../constants/colors";

type Step = "category" | "details" | "location" | "success";

const CATEGORIES = (t: any) => [
  { id: "road",    emoji: "🛣️", label: t.catRoads,    color: COLORS.catRoad },
  { id: "light",   emoji: "💡", label: t.catLighting, color: COLORS.catLight },
  { id: "water",   emoji: "💧", label: t.catWater,    color: COLORS.catWater },
  { id: "waste",   emoji: "🗑️", label: t.catWaste,    color: COLORS.catWaste },
  { id: "safety",  emoji: "🚨", label: t.catSafety,   color: COLORS.catSafety },
  { id: "other",   emoji: "📋", label: t.catOther,    color: COLORS.catOther },
];

const REFERENCE = `LG-${new Date().getFullYear()}-${Math.floor(Math.random() * 90000 + 10000)}`;

export default function ReportScreen({ navigation }: any) {
  const { t } = useTranslation();
  const [step, setStep] = useState<Step>("category");
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [address, setAddress] = useState("");
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const categories = CATEGORIES(t);
  const cat = categories.find((c) => c.id === selectedCat);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsMultipleSelection: false,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotos((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") { Alert.alert("Permission needed"); return; }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!result.canceled && result.assets[0]) {
      setPhotos((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const getLocation = async () => {
    setLocating(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") { setLocating(false); return; }
    const loc = await Location.getCurrentPositionAsync({});
    const geo = await Location.reverseGeocodeAsync(loc.coords);
    if (geo[0]) {
      setAddress(`${geo[0].street ?? ""}, ${geo[0].subregion ?? ""}, Luanda`.trim());
    }
    setLocating(false);
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setStep("success"); }, 1200);
  };

  if (step === "success") {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <View style={styles.successScreen}>
          <View style={styles.successIcon}>
            <Text style={styles.successEmoji}>✅</Text>
          </View>
          <Text style={styles.successTitle}>{t.reportSuccess}</Text>
          <Text style={styles.successDesc}>{t.reportSuccessDesc}</Text>
          <View style={styles.refCard}>
            <Text style={styles.refLabel}>{t.reportRefNumber}</Text>
            <Text style={styles.refNumber}>{REFERENCE}</Text>
          </View>
          <View style={styles.successActions}>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate("MyReports")}>
              <Text style={styles.primaryBtnText}>{t.homeMyReports}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} onPress={() => { setStep("category"); setSelectedCat(null); setTitle(""); setDescription(""); setPhotos([]); setAddress(""); }}>
              <Text style={styles.secondaryBtnText}>{t.reportTitle}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      {/* Progress header */}
      <View style={styles.progressHeader}>
        {step !== "category" && (
          <TouchableOpacity onPress={() => setStep(step === "details" ? "category" : step === "location" ? "details" : "category")}>
            <Ionicons name="arrow-back" size={22} color={COLORS.text} />
          </TouchableOpacity>
        )}
        <Text style={styles.pageTitle}>{t.reportTitle}</Text>
        <View style={styles.progressDots}>
          {["category", "details", "location"].map((s, i) => (
            <View key={i} style={[styles.dot, (step === s || (i < ["category", "details", "location"].indexOf(step))) && styles.dotActive]} />
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Step 1: Category */}
        {step === "category" && (
          <>
            <Text style={styles.stepTitle}>{t.reportSelectCategory}</Text>
            <View style={styles.catGrid}>
              {categories.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  style={[styles.catCard, selectedCat === c.id && styles.catCardActive, selectedCat === c.id && { borderColor: c.color }]}
                  onPress={() => setSelectedCat(c.id)}
                >
                  <Text style={styles.catEmoji}>{c.emoji}</Text>
                  <Text style={[styles.catLabel, selectedCat === c.id && { color: c.color }]}>{c.label}</Text>
                  {selectedCat === c.id && <View style={[styles.catCheck, { backgroundColor: c.color }]}><Text style={styles.catCheckText}>✓</Text></View>}
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={[styles.nextBtn, !selectedCat && styles.nextBtnDisabled]}
              onPress={() => setStep("details")}
              disabled={!selectedCat}
            >
              <Text style={styles.nextBtnText}>{t.next}</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </TouchableOpacity>
          </>
        )}

        {/* Step 2: Details */}
        {step === "details" && (
          <>
            {cat && (
              <View style={[styles.selectedCatBadge, { backgroundColor: `${cat.color}12`, borderColor: cat.color }]}>
                <Text style={styles.catEmoji}>{cat.emoji}</Text>
                <Text style={[styles.catLabel, { color: cat.color }]}>{cat.label}</Text>
              </View>
            )}

            <Text style={styles.fieldLabel}>{t.reportIssueName}</Text>
            <TextInput
              style={styles.input}
              placeholder={t.reportIssueNamePlaceholder}
              placeholderTextColor={COLORS.textMuted}
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.fieldLabel}>{t.reportDescription}</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder={t.reportDescriptionPlaceholder}
              placeholderTextColor={COLORS.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <Text style={styles.fieldLabel}>{t.reportAddPhoto}</Text>
            <View style={styles.photoRow}>
              {photos.map((uri, i) => (
                <View key={i} style={styles.photoThumb}>
                  <Image source={{ uri }} style={styles.photoImg} />
                  <TouchableOpacity style={styles.photoRemove} onPress={() => setPhotos((p) => p.filter((_, j) => j !== i))}>
                    <Ionicons name="close" size={12} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
              {photos.length < 3 && (
                <TouchableOpacity style={styles.addPhotoBtn} onPress={() => Alert.alert(t.reportAddPhoto, "", [
                  { text: t.reportTakePhoto, onPress: takePhoto },
                  { text: t.reportChoosePhoto, onPress: pickImage },
                  { text: t.cancel, style: "cancel" },
                ])}>
                  <Ionicons name="camera-outline" size={24} color={COLORS.textMuted} />
                  <Text style={styles.addPhotoText}>{t.reportAddPhoto}</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={[styles.nextBtn, !title && styles.nextBtnDisabled]}
              onPress={() => setStep("location")}
              disabled={!title}
            >
              <Text style={styles.nextBtnText}>{t.next}</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </TouchableOpacity>
          </>
        )}

        {/* Step 3: Location */}
        {step === "location" && (
          <>
            <Text style={styles.stepTitle}>{t.reportLocation}</Text>

            <TouchableOpacity style={styles.locationBtn} onPress={getLocation} disabled={locating}>
              <View style={styles.locationBtnIcon}>
                <Ionicons name="location" size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.locationBtnText}>{locating ? t.loading : t.reportUseMyLocation}</Text>
            </TouchableOpacity>

            <Text style={styles.fieldLabel}>{t.reportAddress}</Text>
            <TextInput
              style={styles.input}
              placeholder={t.reportAddressPlaceholder}
              placeholderTextColor={COLORS.textMuted}
              value={address}
              onChangeText={setAddress}
            />

            {/* Map placeholder */}
            <View style={styles.mapPlaceholder}>
              <Ionicons name="map-outline" size={40} color={COLORS.textMuted} />
              <Text style={styles.mapPlaceholderText}>{t.reportSelectOnMap}</Text>
              <Text style={styles.mapPlaceholderSub}>Google Maps integrado na produção</Text>
            </View>

            <TouchableOpacity
              style={[styles.submitBtn, (!address || submitting) && styles.nextBtnDisabled]}
              onPress={handleSubmit}
              disabled={!address || submitting}
            >
              <Ionicons name="send" size={18} color="#fff" />
              <Text style={styles.nextBtnText}>{submitting ? t.loading : t.reportSubmitBtn}</Text>
            </TouchableOpacity>
          </>
        )}

        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  progressHeader: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  pageTitle: { flex: 1, color: COLORS.text, fontSize: 18, fontWeight: "800" },
  progressDots: { flexDirection: "row", gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.border },
  dotActive: { backgroundColor: COLORS.primary, width: 20 },
  scroll: { padding: 20, gap: 14, paddingBottom: 50 },
  stepTitle: { color: COLORS.text, fontSize: 16, fontWeight: "700" },
  catGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  catCard: { width: "30%", alignItems: "center", gap: 6, backgroundColor: COLORS.surface, borderRadius: 14, padding: 14, borderWidth: 1.5, borderColor: COLORS.border, position: "relative" },
  catCardActive: { backgroundColor: COLORS.primaryBg },
  catEmoji: { fontSize: 24 },
  catLabel: { color: COLORS.textSub, fontSize: 12, fontWeight: "600", textAlign: "center" },
  catCheck: { position: "absolute", top: 6, right: 6, width: 18, height: 18, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  catCheckText: { color: "#fff", fontSize: 10, fontWeight: "900" },
  selectedCatBadge: { flexDirection: "row", alignItems: "center", gap: 8, padding: 12, borderRadius: 12, borderWidth: 1 },
  fieldLabel: { color: COLORS.textSub, fontSize: 13, fontWeight: "600", marginTop: 4 },
  input: { backgroundColor: COLORS.surface, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, padding: 14, color: COLORS.text, fontSize: 15 },
  textarea: { minHeight: 90, textAlignVertical: "top" },
  photoRow: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  photoThumb: { width: 80, height: 80, borderRadius: 10, overflow: "hidden", position: "relative" },
  photoImg: { width: 80, height: 80 },
  photoRemove: { position: "absolute", top: 4, right: 4, width: 20, height: 20, borderRadius: 10, backgroundColor: "rgba(0,0,0,0.6)", alignItems: "center", justifyContent: "center" },
  addPhotoBtn: { width: 80, height: 80, borderRadius: 10, backgroundColor: COLORS.surface, borderWidth: 1.5, borderColor: COLORS.border, borderStyle: "dashed", alignItems: "center", justifyContent: "center", gap: 4 },
  addPhotoText: { color: COLORS.textMuted, fontSize: 9, textAlign: "center" },
  locationBtn: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: COLORS.primaryBg, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: COLORS.primary },
  locationBtnIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primaryGlow, alignItems: "center", justifyContent: "center" },
  locationBtnText: { color: COLORS.primary, fontSize: 14, fontWeight: "600" },
  mapPlaceholder: { height: 160, backgroundColor: COLORS.surface, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, alignItems: "center", justifyContent: "center", gap: 8 },
  mapPlaceholderText: { color: COLORS.textSub, fontSize: 14, fontWeight: "600" },
  mapPlaceholderSub: { color: COLORS.textMuted, fontSize: 11 },
  nextBtn: { backgroundColor: COLORS.primary, borderRadius: 14, padding: 16, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 8 },
  nextBtnDisabled: { opacity: 0.4 },
  nextBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  submitBtn: { backgroundColor: COLORS.accent, borderRadius: 14, padding: 16, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 8 },
  // Success
  successScreen: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32, gap: 16 },
  successIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.statusResolvedBg, alignItems: "center", justifyContent: "center" },
  successEmoji: { fontSize: 40 },
  successTitle: { color: COLORS.text, fontSize: 24, fontWeight: "900", textAlign: "center" },
  successDesc: { color: COLORS.textSub, fontSize: 15, textAlign: "center", lineHeight: 22 },
  refCard: { backgroundColor: COLORS.surface, borderRadius: 14, padding: 18, alignItems: "center", gap: 4, borderWidth: 1, borderColor: COLORS.border, width: "100%" },
  refLabel: { color: COLORS.textMuted, fontSize: 12 },
  refNumber: { color: COLORS.primary, fontSize: 20, fontWeight: "900", letterSpacing: 1 },
  successActions: { width: "100%", gap: 10 },
  primaryBtn: { backgroundColor: COLORS.primary, borderRadius: 14, padding: 14, alignItems: "center" },
  primaryBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  secondaryBtn: { backgroundColor: COLORS.surface, borderRadius: 14, padding: 14, alignItems: "center", borderWidth: 1, borderColor: COLORS.border },
  secondaryBtnText: { color: COLORS.primary, fontSize: 15, fontWeight: "700" },
});
