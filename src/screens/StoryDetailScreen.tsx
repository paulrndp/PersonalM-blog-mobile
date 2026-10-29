import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { fetchStoryDetailApi, Story } from "../services/api";
import { BookOpen, Layers, Eye, ChevronRight, Play } from "lucide-react-native";

export default function StoryDetailScreen({ route, navigation }: any) {
  const { storyId } = route.params;
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStoryDetailApi(storyId).then((data) => {
      setStory(data);
      setLoading(false);
    });
  }, [storyId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#b45309" />
      </View>
    );
  }

  if (!story) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Story not found.</Text>
      </View>
    );
  }

  const firstChapterId = story.chapters && story.chapters.length > 0 ? story.chapters[0].id : null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Novel Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.coverBox}>
          <BookOpen size={48} color="#94a3b8" />
        </View>

        <View style={styles.tagsRow}>
          {story.genre && (
            <View style={styles.genreBadge}>
              <Text style={styles.genreBadgeText}>{story.genre}</Text>
            </View>
          )}
          {story.tags && <Text style={styles.tagsText}>{story.tags}</Text>}
        </View>

        <Text style={styles.title}>{story.title}</Text>
        <Text style={styles.synopsis}>{story.desc}</Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Layers size={14} color="#64748b" />
            <Text style={styles.statText}>{story.chapters?.length || story.totalChapters || 0} Chapters</Text>
          </View>
          <View style={styles.statItem}>
            <Eye size={14} color="#64748b" />
            <Text style={styles.statText}>{story.views || 0} Reads</Text>
          </View>
        </View>

        {firstChapterId && (
          <TouchableOpacity
            style={styles.startReadingButton}
            onPress={() => navigation.navigate("Reader", { chapterId: firstChapterId, storyTitle: story.title })}
          >
            <Play size={16} color="#ffffff" fill="#ffffff" />
            <Text style={styles.startReadingButtonText}>Start Reading Chapter 1</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Chapters Table of Contents */}
      <Text style={styles.tocHeading}>Table of Contents</Text>

      <View style={styles.tocList}>
        {story.chapters && story.chapters.length > 0 ? (
          story.chapters.map((chapter, index) => (
            <TouchableOpacity
              key={chapter.id}
              style={styles.tocItem}
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate("Reader", {
                  chapterId: chapter.id,
                  storyTitle: story.title,
                })
              }
            >
              <View style={styles.tocNumber}>
                <Text style={styles.tocNumberText}>{index + 1}</Text>
              </View>

              <View style={styles.tocInfo}>
                <Text style={styles.chapterTitle}>{chapter.title}</Text>
                <Text style={styles.chapterViews}>{chapter.views || 0} reads</Text>
              </View>

              <ChevronRight size={18} color="#94a3b8" />
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noChaptersText}>No chapters uploaded yet.</Text>
        )}
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#faf9f6",
  },
  errorText: {
    color: "#64748b",
    fontSize: 16,
  },
  headerCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 24,
  },
  coverBox: {
    width: 110,
    height: 150,
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  tagsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  genreBadge: {
    backgroundColor: "#fef3c7",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  genreBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#78350f",
  },
  tagsText: {
    fontSize: 12,
    color: "#94a3b8",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0f172a",
    fontFamily: "serif",
    textAlign: "center",
    marginBottom: 10,
  },
  synopsis: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    gap: 20,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 14,
    marginBottom: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
  startReadingButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#b45309",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: "100%",
    justifyContent: "center",
  },
  startReadingButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
  tocHeading: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "serif",
    color: "#0f172a",
    marginBottom: 12,
  },
  tocList: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden",
  },
  tocItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    gap: 12,
  },
  tocNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fef3c7",
    justifyContent: "center",
    alignItems: "center",
  },
  tocNumberText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#78350f",
  },
  tocInfo: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
    fontFamily: "serif",
    marginBottom: 2,
  },
  chapterViews: {
    fontSize: 11,
    color: "#94a3b8",
  },
  noChaptersText: {
    padding: 20,
    textAlign: "center",
    color: "#94a3b8",
    fontSize: 13,
  },
});
