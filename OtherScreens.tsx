// MapScreen.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "../i18n/LanguageContext";
import StatusBadge from "../components/StatusBadge";
import { COLORS } from "../constants/colors";

const MOCK_MAP_REPORTS = [
  { id: "m1", title: "Buraco — Av. 4 de Fevereiro",   cat: "road",   status: "in_progress" as const, district: "Maianga",    lat: -8.814, lng: 13.230, emoji: "🛣️" },
  { id: "m2", title: "Candeeiro avariado — Mutamba",   cat: "light",  status: "submitted"   as const, district: "Ingombota", lat: -8.820, lng: 13.234, emoji: "💡" },
  { id: "m3", title: "Lixo — Rua Direita",             cat: "waste",  status: "resolved"    as const, district: "Maianga",   lat: -8.816, lng: 13.228, emoji: "🗑️" },
  { id: "m4", title: "Fuga de água — Sambizanga",      cat: "water",  status: "under_review"as const, district: "Sambizanga",lat: -8.798, lng: 13.242, emoji: "💧" },
];

const FILTERS = (t: any) => [
  { id: "all",    label: t.mapFilterAll, color: COLORS.text },
  { id: "road",   label: t.catRoads,    color: COLORS.catRoad },
  { id: "light",  label: t.catLighting, color: COLORS.catLight },
  { id: "water",  label: t.catWater,    color: COLORS.catWater },
  { id: "waste",  label: t.catWaste,    color: COLORS.catWaste },
];

export function MapScreen() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? MOCK_MAP_REPORTS : MOCK_MAP_REPORTS.filter((r) => r.cat === filter);

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Text style={styles.pageTitle}>{t.mapTitle}</Text>

      {/* Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        {FILTERS(t).map((f) => (
          <TouchableOpacity key={f.id} style={[styles.filterBtn, filter === f.id && { backgroundColor: `${f.color}14`, borderColor: f.color }]} onPress={() => setFilter(f.id)}>
            <Text style={[styles.filterText, filter === f.id && { color: f.color }]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Map placeholder */}
      <View style={styles.mapPlaceholder}>
        <Ionicons name="map" size={48} color={COLORS.primary} />
        <Text style={styles.mapTitle}>Mapa Interactivo</Text>
        <Text style={styles.mapSub}>Google Maps / Mapbox integrado na produção</Text>
        <Text style={styles.mapCount}>{t.mapIssuesNearby(filtered.length)}</Text>
      </View>

      {/* Report list */}
      <ScrollView contentContainerStyle={styles.list}>
        {filtered.map((r) => (
          <View key={r.id} style={styles.listCard}>
            <View style={styles.listLeft}>
              <Text style={styles.listEmoji}>{r.emoji}</Text>
              <View>
                <Text style={styles.listTitle} numberOfLines={1}>{r.title}</Text>
                <Text style={styles.listDistrict}>📍 {r.district}</Text>
              </View>
            </View>
            <StatusBadge status={r.status} />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── MyReportsScreen ──────────────────────────────────────────
const MOCK_MY_REPORTS = [
  {
    id: "r1", title: "Buraco — Av. 4 de Fevereiro", status: "in_progress" as const, date: "20 Mar 2026", emoji: "🛣️",
    timeline: [
      { status: "submitted",    date: "20 Mar 10:00", note: "Reporte recebido" },
      { status: "under_review", date: "20 Mar 14:30", note: "Em análise pela equipa técnica" },
      { status: "in_progress",  date: "21 Mar 09:00", note: "Equipa de obras no local" },
    ],
  },
  {
    id: "r2", title: "Candeeiro avariado — Maianga", status: "resolved" as const, date: "18 Mar 2026", emoji: "💡",
    timeline: [
      { status: "submitted",    date: "18 Mar 08:00", note: "Reporte recebido" },
      { status: "under_review", date: "18 Mar 12:00", note: "Verificado no local" },
      { status: "in_progress",  date: "19 Mar 10:00", note: "Substituição agendada" },
      { status: "resolved",     date: "19 Mar 16:00", note: "Problema resolvido ✓" },
    ],
  },
];

export function MyReportsScreen({ navigation }: any) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<string | null>(null);

  const STATUS_COLOR: Record<string, string> = {
    submitted: COLORS.statusOpen, under_review: COLORS.statusReview,
    in_progress: COLORS.statusProgress, resolved: COLORS.statusResolved,
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Text style={styles.pageTitle}>{t.myReportsTitle}</Text>
      <ScrollView contentContainerStyle={styles.list}>
        {MOCK_MY_REPORTS.map((report) => (
          <View key={report.id} style={styles.reportCard2}>
            <TouchableOpacity style={styles.reportCardHeader} onPress={() => setExpanded(expanded === report.id ? null : report.id)}>
              <Text style={styles.listEmoji}>{report.emoji}</Text>
              <View style={styles.reportCardInfo}>
                <Text style={styles.listTitle} numberOfLines={2}>{report.title}</Text>
                <Text style={styles.listDistrict}>{report.date}</Text>
              </View>
              <View style={styles.reportCardRight}>
                <StatusBadge status={report.status} />
                <Ionicons name={expanded === report.id ? "chevron-up" : "chevron-down"} size={16} color={COLORS.textMuted} />
              </View>
            </TouchableOpacity>

            {expanded === report.id && (
              <View style={styles.timeline}>
                <Text style={styles.timelineTitle}>{t.myReportsTimeline}</Text>
                {report.timeline.map((step, i) => (
                  <View key={i} style={styles.timelineRow}>
                    <View style={styles.timelineLeft}>
                      <View style={[styles.timelineDot, { backgroundColor: STATUS_COLOR[step.status] ?? COLORS.textMuted }]} />
                      {i < report.timeline.length - 1 && <View style={styles.timelineLine} />}
                    </View>
                    <View style={styles.timelineContent}>
                      <Text style={styles.timelineNote}>{step.note}</Text>
                      <Text style={styles.timelineDate}>{step.date}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── ServicesScreen ───────────────────────────────────────────
const SERVICES_GRID = (t: any) => [
  { id: "pay",      icon: "card",          label: t.servicesPayFee,     color: COLORS.primary, emoji: "💳" },
  { id: "doc",      icon: "document",      label: t.servicesRequestDoc, color: COLORS.accent,  emoji: "📄" },
  { id: "id",       icon: "id-card",       label: t.servicesIdWallet,   color: COLORS.statusProgress, emoji: "🪪" },
  { id: "election", icon: "people",        label: t.servicesElections,  color: COLORS.statusResolved, emoji: "🗳️" },
  { id: "dir",      icon: "business",      label: t.servicesDirectory,  color: COLORS.catLight, emoji: "🏛️" },
  { id: "contact",  icon: "call",          label: t.servicesContactUs,  color: COLORS.catWater, emoji: "📞" },
];

export function ServicesScreen({ navigation }: any) {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Text style={styles.pageTitle}>{t.servicesTitle}</Text>
      <Text style={styles.servicesDesc}>{t.servicesDesc}</Text>

      <ScrollView contentContainerStyle={styles.servicesGrid}>
        {SERVICES_GRID(t).map((svc) => (
          <TouchableOpacity
            key={svc.id}
            style={styles.svcCard}
            onPress={() => { if (svc.id === "election") navigation.navigate("Elections"); }}
          >
            <View style={[styles.svcIcon, { backgroundColor: `${svc.color}12` }]}>
              <Text style={styles.svcEmoji}>{svc.emoji}</Text>
            </View>
            <Text style={styles.svcLabel}>{svc.label}</Text>
          </TouchableOpacity>
        ))}

        {/* Gov fees card */}
        <View style={styles.feesCard}>
          <View style={styles.feesHeader}>
            <Ionicons name="receipt-outline" size={20} color={COLORS.primary} />
            <Text style={styles.feesTitle}>Taxas Municipais</Text>
          </View>
          {[
            { label: "Licença Comercial", amount: "15.000 AOA" },
            { label: "Registo Predial", amount: "8.500 AOA" },
            { label: "Certidão de Residência", amount: "2.000 AOA" },
          ].map((fee, i) => (
            <View key={i} style={styles.feeRow}>
              <Text style={styles.feeName}>{fee.label}</Text>
              <TouchableOpacity style={styles.feePayBtn}>
                <Text style={styles.feeAmount}>{fee.amount}</Text>
                <Text style={styles.feePayText}>Pagar</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── ElectionsScreen ──────────────────────────────────────────
export function ElectionsScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Text style={styles.pageTitle}>{t.electionsTitle}</Text>
      <ScrollView contentContainerStyle={styles.list}>
        <View style={styles.electionCard}>
          <View style={styles.electionHeader}>
            <Text style={styles.electionEmoji}>🗳️</Text>
            <View>
              <Text style={styles.electionName}>Eleições Municipais 2026</Text>
              <Text style={styles.electionDate}>{t.electionsDate}: 7 de Agosto 2026</Text>
            </View>
          </View>
          <View style={styles.electionDetails}>
            {[
              { label: t.electionsType, value: "Autárquica" },
              { label: "Circunscrição", value: "Luanda" },
              { label: t.electionsRegistered, value: "Sim ✓" },
            ].map((d, i) => (
              <View key={i} style={styles.electionDetail}>
                <Text style={styles.electionDetailLabel}>{d.label}</Text>
                <Text style={styles.electionDetailValue}>{d.value}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.sectionHeader}>{t.electionsCandidates}</Text>
        {["MPLA", "UNITA", "PRS", "FNLA"].map((party) => (
          <View key={party} style={styles.candidateCard}>
            <View style={styles.candidateAvatar}><Text style={styles.candidateInitials}>{party.slice(0, 2)}</Text></View>
            <View>
              <Text style={styles.partyName}>{party}</Text>
              <Text style={styles.candidateProv}>Candidato Luanda</Text>
            </View>
          </View>
        ))}

        <Text style={styles.sectionHeader}>{t.electionsPollingStation}</Text>
        {["Escola Primária Maianga", "Centro Cívico Ingombota", "Liceu Mutu-Ya-Kevela"].map((ps, i) => (
          <View key={i} style={styles.pollingCard}>
            <Ionicons name="location" size={16} color={COLORS.primary} />
            <Text style={styles.pollingName}>{ps}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── ProfileScreen ────────────────────────────────────────────
export function ProfileScreen() {
  const { t } = useTranslation();
  const { useAuthStore: _auth } = require("../store/useAuthStore");
  const citizen = { fullName: "Ana Ferreira", phone: "+244 923 456 789", biNumber: "005234567LA042", ward: "Maianga", totalReports: 7, resolvedReports: 4, memberSince: "Jan 2025" };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.profileScroll}>
        <Text style={styles.pageTitle}>{t.profileTitle}</Text>

        {/* User card */}
        <View style={styles.userCard}>
          <View style={styles.userAvatar}><Text style={styles.userInitials}>{citizen.fullName.slice(0, 2).toUpperCase()}</Text></View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{citizen.fullName}</Text>
            <Text style={styles.userBi}>{citizen.biNumber}</Text>
            <Text style={styles.userWard}>📍 {citizen.ward}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.profileStats}>
          <View style={styles.pStat}><Text style={styles.pStatValue}>{citizen.totalReports}</Text><Text style={styles.pStatLabel}>{t.profileTotalReports}</Text></View>
          <View style={styles.pStatDiv} />
          <View style={styles.pStat}><Text style={[styles.pStatValue, { color: COLORS.statusResolved }]}>{citizen.resolvedReports}</Text><Text style={styles.pStatLabel}>{t.profileResolvedReports}</Text></View>
          <View style={styles.pStatDiv} />
          <View style={styles.pStat}><Text style={styles.pStatValue}>🏅</Text><Text style={styles.pStatLabel}>{t.profileMemberSince}</Text></View>
        </View>

        {/* Language */}
        <View style={styles.langSection}>
          <Text style={styles.sectionHeader2}>{t.profileLanguage}</Text>
          <LanguageSwitcher compact={false} />
        </View>

        {/* Menu */}
        <Text style={styles.sectionHeader2}>{t.profilePersonal}</Text>
        <View style={styles.menuCard}>
          {[
            { icon: "person-outline",            label: citizen.fullName,     sub: t.profilePersonal },
            { icon: "id-card-outline",           label: citizen.biNumber,     sub: t.authBiNumber },
            { icon: "notifications-outline",     label: t.profileNotifications },
            { icon: "shield-outline",            label: t.profileSecurity },
          ].map((item, i, arr) => (
            <React.Fragment key={i}>
              <View style={styles.menuRow}>
                <View style={styles.menuIcon}><Ionicons name={item.icon as any} size={18} color={COLORS.primary} /></View>
                <View style={styles.menuText}><Text style={styles.menuLabel}>{item.label}</Text>{item.sub && <Text style={styles.menuSub}>{item.sub}</Text>}</View>
                <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
              </View>
              {i < arr.length - 1 && <View style={styles.menuDivider} />}
            </React.Fragment>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={18} color={COLORS.primary} />
          <Text style={styles.logoutText}>{t.profileLogout}</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>🏛️ LuandaGov · Câmara Municipal de Luanda 🇦🇴</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

import LanguageSwitcher from "../components/LanguageSwitcher";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  pageTitle: { color: COLORS.text, fontSize: 22, fontWeight: "900", padding: 20, paddingBottom: 12 },
  servicesDesc: { color: COLORS.textSub, fontSize: 13, paddingHorizontal: 20, marginBottom: 12, marginTop: -8 },
  filterScroll: { paddingHorizontal: 20, marginBottom: 12 },
  filterBtn: { paddingHorizontal: 14, paddingVertical: 7, backgroundColor: COLORS.surface, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: COLORS.border },
  filterText: { color: COLORS.textSub, fontSize: 13, fontWeight: "600" },
  mapPlaceholder: { height: 220, backgroundColor: COLORS.surface, margin: 20, borderRadius: 16, alignItems: "center", justifyContent: "center", gap: 8, borderWidth: 1, borderColor: COLORS.border },
  mapTitle: { color: COLORS.text, fontSize: 16, fontWeight: "700" },
  mapSub: { color: COLORS.textMuted, fontSize: 12 },
  mapCount: { color: COLORS.primary, fontSize: 13, fontWeight: "600" },
  list: { padding: 20, paddingTop: 0, paddingBottom: 50, gap: 10 },
  listCard: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: COLORS.surface, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: COLORS.border },
  listLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  listEmoji: { fontSize: 24 },
  listTitle: { color: COLORS.text, fontSize: 13, fontWeight: "600", flex: 1 },
  listDistrict: { color: COLORS.textMuted, fontSize: 11, marginTop: 2 },
  // MyReports
  reportCard2: { backgroundColor: COLORS.surface, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, overflow: "hidden" },
  reportCardHeader: { flexDirection: "row", alignItems: "center", padding: 14, gap: 10 },
  reportCardInfo: { flex: 1 },
  reportCardRight: { alignItems: "flex-end", gap: 4 },
  timeline: { backgroundColor: COLORS.surfaceAlt, padding: 14, gap: 0 },
  timelineTitle: { color: COLORS.textSub, fontSize: 12, fontWeight: "700", marginBottom: 12, letterSpacing: 0.5 },
  timelineRow: { flexDirection: "row", gap: 12, marginBottom: 4 },
  timelineLeft: { alignItems: "center", width: 16 },
  timelineDot: { width: 12, height: 12, borderRadius: 6, marginTop: 2 },
  timelineLine: { width: 2, flex: 1, backgroundColor: COLORS.border, marginTop: 4 },
  timelineContent: { flex: 1, paddingBottom: 16 },
  timelineNote: { color: COLORS.text, fontSize: 13, fontWeight: "500" },
  timelineDate: { color: COLORS.textMuted, fontSize: 11, marginTop: 2 },
  // Services
  servicesGrid: { padding: 20, gap: 12, paddingBottom: 50 },
  svcCard: { backgroundColor: COLORS.surface, borderRadius: 14, padding: 18, alignItems: "center", gap: 10, borderWidth: 1, borderColor: COLORS.border, width: "47%", marginHorizontal: "1.5%" },
  svcIcon: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  svcEmoji: { fontSize: 24 },
  svcLabel: { color: COLORS.textSub, fontSize: 12, fontWeight: "600", textAlign: "center" },
  feesCard: { backgroundColor: COLORS.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: COLORS.border, gap: 12, width: "100%" },
  feesHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  feesTitle: { color: COLORS.text, fontSize: 15, fontWeight: "700" },
  feeRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 10 },
  feeName: { color: COLORS.textSub, fontSize: 13, flex: 1 },
  feePayBtn: { alignItems: "flex-end" },
  feeAmount: { color: COLORS.text, fontSize: 13, fontWeight: "700" },
  feePayText: { color: COLORS.primary, fontSize: 11, fontWeight: "600" },
  // Elections
  sectionHeader: { color: COLORS.textSub, fontSize: 13, fontWeight: "700", marginVertical: 10, letterSpacing: 0.5 },
  electionCard: { backgroundColor: COLORS.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: COLORS.border, gap: 14 },
  electionHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  electionEmoji: { fontSize: 32 },
  electionName: { color: COLORS.text, fontSize: 16, fontWeight: "800" },
  electionDate: { color: COLORS.textMuted, fontSize: 12 },
  electionDetails: { flexDirection: "row", gap: 20 },
  electionDetail: { gap: 2 },
  electionDetailLabel: { color: COLORS.textMuted, fontSize: 11 },
  electionDetailValue: { color: COLORS.text, fontSize: 13, fontWeight: "600" },
  candidateCard: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: COLORS.surface, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: COLORS.border },
  candidateAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primaryBg, alignItems: "center", justifyContent: "center" },
  candidateInitials: { color: COLORS.primary, fontSize: 12, fontWeight: "800" },
  partyName: { color: COLORS.text, fontSize: 14, fontWeight: "700" },
  candidateProv: { color: COLORS.textMuted, fontSize: 12 },
  pollingCard: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: COLORS.surface, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: COLORS.border },
  pollingName: { color: COLORS.text, fontSize: 13, fontWeight: "500" },
  // Profile
  profileScroll: { padding: 20, gap: 16, paddingBottom: 50 },
  userCard: { flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: COLORS.surface, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: COLORS.border },
  userAvatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.primaryBg, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: COLORS.primary },
  userInitials: { color: COLORS.primary, fontSize: 20, fontWeight: "900" },
  userInfo: { flex: 1, gap: 3 },
  userName: { color: COLORS.text, fontSize: 17, fontWeight: "800" },
  userBi: { color: COLORS.textSub, fontSize: 12 },
  userWard: { color: COLORS.textMuted, fontSize: 12 },
  profileStats: { flexDirection: "row", backgroundColor: COLORS.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: COLORS.border, justifyContent: "space-around" },
  pStat: { alignItems: "center", gap: 3 },
  pStatValue: { color: COLORS.primary, fontSize: 20, fontWeight: "900" },
  pStatLabel: { color: COLORS.textMuted, fontSize: 11 },
  pStatDiv: { width: 1, backgroundColor: COLORS.border },
  langSection: { gap: 10 },
  sectionHeader2: { color: COLORS.textSub, fontSize: 12, fontWeight: "700", letterSpacing: 0.5, textTransform: "uppercase" },
  menuCard: { backgroundColor: COLORS.surface, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, overflow: "hidden" },
  menuRow: { flexDirection: "row", alignItems: "center", padding: 14, gap: 12 },
  menuIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: COLORS.primaryBg, alignItems: "center", justifyContent: "center" },
  menuText: { flex: 1 },
  menuLabel: { color: COLORS.text, fontSize: 14, fontWeight: "600" },
  menuSub: { color: COLORS.textMuted, fontSize: 12, marginTop: 1 },
  menuDivider: { height: 1, backgroundColor: COLORS.border, marginHorizontal: 14 },
  logoutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: COLORS.primaryBg, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: COLORS.primary },
  logoutText: { color: COLORS.primary, fontSize: 15, fontWeight: "700" },
  footer: { color: COLORS.textMuted, fontSize: 12, textAlign: "center", lineHeight: 20 },
});
