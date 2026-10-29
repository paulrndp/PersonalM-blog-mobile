import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { fetchChapterApi, ChapterDetail } from "../services/api";
import { ArrowLeft, ArrowRight, Sun, Moon, Coffee } from "lucide-react-native";

type ReaderTheme = "light" | "sepia" | "dark";

export default function ReaderScreen({ route, navigation }: any) {
  const { chapterId, storyTitle } = route.params;
  const [data, setData] = useState<{
    chapter: ChapterDetail;
    prev: { id: number; title: string } | null;
    next: { id: number; title: string } | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Reader Preferences
  const [fontSize, setFontSize] = useState<number>(17);
  const [theme, setTheme] = useState<ReaderTheme>("sepia");

  useEffect(() => {
    setLoading(true);
    fetchChapterApi(chapterId).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [chapterId]);

  const themes = {
    light: {
      bg: "#ffffff",
      text: "#1c1917",
      muted: "#78716c",
      card: "#f5f5f4",
      border: "#e7e5e4",
    },
    sepia: {
      bg: "#fbf0d9",
      text: "#451a03",
      muted: "#78350f",
      card: "#f4e4c1",
      border: "#ecd5a3",
    },
    dark: {
      bg: "#18181b",
      text: "#f4f4f5",
      muted: "#a1a1aa",
      card: "#27272a",
      border: "#3f3f46",
    },
  };

  const currentTheme = themes[theme];

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: currentTheme.bg }]}>
        <ActivityIndicator size="large" color="#b45309" />
      </View>
    );
  }

  if (!data?.chapter) {
    return (
      <View style={[styles.center, { backgroundColor: currentTheme.bg }]}>
        <Text style={{ color: currentTheme.muted }}>Unable to load chapter content.</Text>
      </View>
    );
  }

  const { chapter, prev, next } = data;

  // Clean html tags to readable paragraphs
  const cleanContent = chapter.content
    ? chapter.content
        .replace(/<\/p>/gi, "\n\n")
        .replace(/<br\s*[\/]?>/gi, "\n")
        .replace(/<[^>]+>/gi, "")
        .trim()
    : "No text content.";

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentTheme.bg }]}>
      {/* Reader Controls Toolbar */}
      <View style={[styles.toolbar, { borderBottomColor: currentTheme.border }]}>
        {/* Font Size Adjusters */}
        <View style={styles.fontControls}>
          <TouchableOpacity
            style={[styles.toolBtn, { backgroundColor: currentTheme.card }]}
            onPress={() => setFontSize((s) => Math.max(14, s - 2))}
          >
            <Text style={[styles.toolBtnText, { color: currentTheme.text, fontSize: 12 }]}>A-</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toolBtn, { backgroundColor: currentTheme.card }]}
            onPress={() => setFontSize((s) => Math.min(26, s + 2))}
          >
            <Text style={[styles.toolBtnText, { color: currentTheme.text, fontSize: 16 }]}>A+</Text>
          </TouchableOpacity>
        </View>

        {/* Theme Switchers */}
        <View style={styles.themeControls}>
          <TouchableOpacity
            style={[styles.themeBtn, theme === "light" && styles.activeThemeBtn, { backgroundColor: "#ffffff" }]}
            onPress={() => setTheme("light")}
          >
            <Sun size={14} color="#1c1917" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.themeBtn, theme === "sepia" && styles.activeThemeBtn, { backgroundColor: "#fbf0d9" }]}
            onPress={() => setTheme("sepia")}
          >
            <Coffee size={14} color="#451a03" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.themeBtn, theme === "dark" && styles.activeThemeBtn, { backgroundColor: "#18181b" }]}
            onPress={() => setTheme("dark")}
          >
            <Moon size={14} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Reader Content Body */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.storyLabel, { color: currentTheme.muted }]}>
          {storyTitle || "Serial Novel"}
        </Text>
        <Text style={[styles.chapterHeading, { color: currentTheme.text }]}>
          {chapter.title}
        </Text>

        <Text
          style={[
            styles.storyBody,
            {
              fontSize,
              lineHeight: fontSize * 1.85,
              color: currentTheme.text,
            },
          ]}
        >
          {cleanContent}
        </Text>

        {/* Prev & Next Chapter Navigation */}
        <View style={[styles.bottomNav, { borderTopColor: currentTheme.border }]}>
          {prev ? (
            <TouchableOpacity
              style={[styles.navButton, { backgroundColor: currentTheme.card }]}
              onPress={() =>
                navigation.replace("Reader", {
                  chapterId: prev.id,
                  storyTitle,
                })
              }
            >
              <ArrowLeft size={16} color={currentTheme.text} />
              <View>
                <Text style={[styles.navSubtitle, { color: currentTheme.muted }]}>PREVIOUS PART</Text>
                <Text style={[styles.navTitle, { color: currentTheme.text }]} numberOfLines={1}>
                  {prev.title}
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={{ flex: 1 }} />
          )}

          {next ? (
            <TouchableOpacity
              style={[styles.navButton, { backgroundColor: currentTheme.card }]}
              onPress={() =>
                navigation.replace("Reader", {
                  chapterId: next.id,
                  storyTitle,
                })
              }
            >
              <View style={{ alignItems: "flex-end" }}>
                <Text style={[styles.navSubtitle, { color: currentTheme.muted }]}>NEXT PART</Text>
                <Text style={[styles.navTitle, { color: currentTheme.text }]} numberOfLines={1}>
                  {next.title}
                </Text>
              </View>
              <ArrowRight size={16} color={currentTheme.text} />
            </TouchableOpacity>
          ) : (
            <View style={{ flex: 1 }} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  fontControls: {
    flexDirection: "row",
    gap: 8,
  },
  toolBtn: {
    width: 34,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  toolBtnText: {
    fontWeight: "bold",
  },
  themeControls: {
    flexDirection: "row",
    gap: 8,
  },
  themeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  activeThemeBtn: {
    borderColor: "#b45309",
    borderWidth: 2,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
  },
  storyLabel: {
    fontSize: 12,
    textTransform: "uppercase",
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 6,
  },
  chapterHeading: {
    fontSize: 26,
    fontWeight: "bold",
    fontFamily: "serif",
    marginBottom: 24,
    lineHeight: 34,
  },
  storyBody: {
    fontFamily: "serif",
    marginBottom: 40,
  },
  bottomNav: {
    flexDirection: "row",
    gap: 12,
    paddingTop: 24,
    borderTopWidth: 1,
  },
  navButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 10,
  },
  navSubtitle: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  navTitle: {
    fontSize: 12,
    fontWeight: "bold",
    maxWidth: 110,
  },
});
