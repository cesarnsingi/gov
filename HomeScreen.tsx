import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "../i18n/LanguageContext";
import { useAuthStore } from "../store/useAuthStore";
import LanguageSwitcher from "../components/LanguageSwitcher";
import StatusBadge from "../components/StatusBadge";
import { COLORS } from "../constants/colors";

const MOCK_RECENT = [
  { id: "r1", title: "Buraco na Av. 4 de Fevereiro",  cat: "road",    status: "in_progress" as const, date: "20 Mar", emoji: "🛣️" },
  { id: "r2", title: "Candeeiro avariado — Maianga",  cat: "light",   status: "resolved"    as const, date: "18 Mar", emoji: "💡" },
  { id: "r3", title: "Lixo acumulado — Rua Direita",  cat: "waste",   status: "under_review"as const, date: "15 Mar", emoji: "🗑️" },
];

const NEWS = [
  "🏗️ Obras de requalificação da Av. Lenine continuam em março",
  "🌊 Nova estação de tratamento de água inaugurada em Viana",
  "🗳️ Recenseamento eleitoral decorre até 30 de Abril",
];

export default function HomeScreen({ navigation }: any) {
  const { t } = useTranslation();
  const { citizen } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const [newsIndex, setNewsIndex] = useState(0);

  const firstName = citizen?.fullName.split(" ")[0] ?? "";

  const QUICK_ACTIONS = [
    { icon: "warning-outline",    label: t.homeReportIssue, color: COLORS.primary, onPress: () => navigation.navigate("ReportTab") },
    { icon: "map-outline",        label: t.homeViewMap,     color: COLORS.accent,  onPress: () => navigation.navigate("MapTab") },
    { icon: "list-outline",       label: t.homeMyReports,   color: COLORS.statusProgress, onPress: () => navigation.navigate("MyReports") },
    { icon: "briefcase-outline",  label: t.homeServices,    color: COLORS.statusResolved, onPress: () => navigation.navigate("ServicesTab") },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 800); }} tintColor={COLORS.primary} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.govLogo}>
              <Text style={styles.govLogoText}>🏛️</Text>
            </View>
            <View>
              <Text style={styles.appName}>{t.appName}</Text>
              <Text style={styles.greeting}>{t.homeGreeting(firstName)}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <LanguageSwitcher compact />
            <TouchableOpacity style={styles.notifBtn}>
              <Ionicons name="notifications-outline" size={20} color={COLORS.text} />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* News ticker */}
        <TouchableOpacity style={styles.newsBanner} onPress={() => setNewsIndex((i) => (i + 1) % NEWS.length)}>
          <View style={styles.newsPill}><Text style={styles.newsPillText}>NOTÍCIA</Text></View>
          <Text style={styles.newsText} numberOfLines={1}>{NEWS[newsIndex]}</Text>
          <Ionicons name="chevron-forward" size={14} color={COLORS.textMuted} />
        </TouchableOpacity>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {[
            { label: t.homeOpenIssues,    value: "247",  color: COLORS.statusOpen,     icon: "warning" },
            { label: t.homeResolvedToday, value: "12",   color: COLORS.statusResolved, icon: "checkmark-circle" },
            { label: t.homeActiveReports, value: citizen?.totalReports.toString() ?? "0", color: COLORS.accent, icon: "document-text" },
          ].map((stat, i) => (
            <View key={i} style={styles.statCard}>
              <Ionicons name={stat.icon as any} size={18} color={stat.color} />
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.homeQuickActions}</Text>
          <View style={styles.actionsGrid}>
            {QUICK_ACTIONS.map((action, i) => (
              <TouchableOpacity key={i} style={styles.actionBtn} onPress={action.onPress}>
                <View style={[styles.actionIcon, { backgroundColor: `${action.color}12` }]}>
                  <Ionicons name={action.icon as any} size={24} color={action.color} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent reports */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>{t.homeRecentActivity}</Text>
            <TouchableOpacity onPress={() => navigation.navigate("MyReports")}>
              <Text style={styles.seeAll}>{t.seeAll}</Text>
            </TouchableOpacity>
          </View>

          {MOCK_RECENT.map((report) => (
            <TouchableOpacity
              key={report.id}
              style={styles.reportCard}
              onPress={() => navigation.navigate("ReportDetail", { report })}
            >
              <View style={styles.reportIconBox}>
                <Text style={styles.reportEmoji}>{report.emoji}</Text>
              </View>
              <View style={styles.reportInfo}>
                <Text style={styles.reportTitle} numberOfLines={2}>{report.title}</Text>
                <Text style={styles.reportDate}>{report.date}</Text>
              </View>
              <StatusBadge status={report.status} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Ward info */}
        <View style={styles.wardCard}>
          <Ionicons name="location" size={18} color={COLORS.primary} />
          <View style={styles.wardText}>
            <Text style={styles.wardLabel}>Município</Text>
            <Text style={styles.wardName}>{citizen?.ward}</Text>
          </View>
          <TouchableOpacity style={styles.wardMapBtn} onPress={() => navigation.navigate("MapTab")}>
            <Text style={styles.wardMapText}>{t.homeViewMap}</Text>
            <Ionicons name="chevron-forward" size={14} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 14, paddingBottom: 12 },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  govLogo: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.primary, alignItems: "center", justifyContent: "center" },
  govLogoText: { fontSize: 18 },
  appName: { color: COLORS.primary, fontSize: 16, fontWeight: "900", letterSpacing: 0.5 },
  greeting: { color: COLORS.textSub, fontSize: 12 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  notifBtn: { position: "relative", padding: 8, backgroundColor: COLORS.surface, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border },
  notifDot: { position: "absolute", top: 8, right: 8, width: 7, height: 7, borderRadius: 4, backgroundColor: COLORS.primary },
  newsBanner: { flexDirection: "row", alignItems: "center", gap: 8, marginHorizontal: 20, backgroundColor: COLORS.surface, borderRadius: 12, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border },
  newsPill: { backgroundColor: COLORS.primary, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  newsPillText: { color: "#fff", fontSize: 9, fontWeight: "800", letterSpacing: 0.5 },
  newsText: { flex: 1, color: COLORS.textSub, fontSize: 12 },
  statsRow: { flexDirection: "row", paddingHorizontal: 20, gap: 10, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: COLORS.surface, borderRadius: 14, padding: 12, alignItems: "center", gap: 4, borderWidth: 1, borderColor: COLORS.border },
  statValue: { fontSize: 20, fontWeight: "900" },
  statLabel: { color: COLORS.textMuted, fontSize: 10, textAlign: "center" },
  section: { paddingHorizontal: 20, marginBottom: 20 },
  sectionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { color: COLORS.text, fontSize: 15, fontWeight: "800", marginBottom: 12 },
  seeAll: { color: COLORS.primary, fontSize: 13, fontWeight: "600" },
  actionsGrid: { flexDirection: "row", gap: 10 },
  actionBtn: { flex: 1, alignItems: "center", gap: 8, backgroundColor: COLORS.surface, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: COLORS.border },
  actionIcon: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  actionLabel: { color: COLORS.textSub, fontSize: 11, fontWeight: "600", textAlign: "center" },
  reportCard: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.surface, borderRadius: 14, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border, gap: 10 },
  reportIconBox: { width: 44, height: 44, backgroundColor: COLORS.surfaceAlt, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  reportEmoji: { fontSize: 20 },
  reportInfo: { flex: 1, gap: 4 },
  reportTitle: { color: COLORS.text, fontSize: 13, fontWeight: "600", lineHeight: 18 },
  reportDate: { color: COLORS.textMuted, fontSize: 11 },
  wardCard: { flexDirection: "row", alignItems: "center", gap: 10, marginHorizontal: 20, backgroundColor: COLORS.primaryBg, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: COLORS.primary, marginBottom: 20 },
  wardText: { flex: 1 },
  wardLabel: { color: COLORS.textMuted, fontSize: 11 },
  wardName: { color: COLORS.primary, fontSize: 14, fontWeight: "700" },
  wardMapBtn: { flexDirection: "row", alignItems: "center", gap: 3 },
  wardMapText: { color: COLORS.primary, fontSize: 12, fontWeight: "600" },
});
