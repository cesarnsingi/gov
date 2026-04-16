import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";
import { useTranslation } from "../i18n/LanguageContext";

type Status = "submitted" | "under_review" | "in_progress" | "resolved" | "closed" | "rejected";

export default function StatusBadge({ status }: { status: Status }) {
  const { t } = useTranslation();

  const CONFIG: Record<Status, { label: string; color: string; bg: string }> = {
    submitted:    { label: t.statusSubmitted,   color: COLORS.statusOpen,     bg: COLORS.statusOpenBg },
    under_review: { label: t.statusUnderReview, color: COLORS.statusReview,   bg: COLORS.statusReviewBg },
    in_progress:  { label: t.statusInProgress,  color: COLORS.statusProgress, bg: COLORS.statusProgressBg },
    resolved:     { label: t.statusResolved,    color: COLORS.statusResolved, bg: COLORS.statusResolvedBg },
    closed:       { label: t.statusClosed,      color: COLORS.statusClosed,   bg: "rgba(107,114,128,0.10)" },
    rejected:     { label: t.statusRejected,    color: COLORS.statusRejected, bg: "rgba(239,68,68,0.10)" },
  };

  const c = CONFIG[status];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <View style={[styles.dot, { backgroundColor: c.color }]} />
      <Text style={[styles.label, { color: c.color }]}>{c.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  label: { fontSize: 11, fontWeight: "700", letterSpacing: 0.3 },
});
