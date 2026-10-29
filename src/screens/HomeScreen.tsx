import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { fetchStoriesApi, fetchPostsApi, Story, Post } from "../services/api";
import { BookOpen, Sparkles, Feather, ChevronRight, Eye, Layers } from "lucide-react-native";

export default function HomeScreen({ navigation }: any) {
  const [stories, setStories] = useState<Story[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [sData, pData] = await Promise.all([fetchStoriesApi(), fetchPostsApi()]);
      setStories(sData);
      setPosts(pData);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            loadData();
          }}
          tintColor="#b45309"
        />
      }
    >
      {/* Hero Header */}
      <View style={styles.heroCard}>
        <View style={styles.badge}>
          <Feather size={12} color="#78350f" />
          <Text style={styles.badgeText}>Author &amp; Storyteller</Text>
        </View>
        <Text style={styles.heroTitle}>Hannah Montemayor</Text>
        <Text style={styles.heroSubtitle}>
          Stories written from the heart, thoughts whispered to the stars. Explore serialized novels, reflections, and candid thoughts.
        </Text>
        <TouchableOpacity
          style={styles.heroButton}
          onPress={() => navigation.navigate("StoriesTab")}
        >
          <BookOpen size={16} color="#ffffff" />
          <Text style={styles.heroButtonText}>Browse All Novels</Text>
        </TouchableOpacity>
      </View>

      {/* Featured Novels Section */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionOverline}>SERIALIZED NOVELS</Text>
          <Text style={styles.sectionTitle}>Featured Stories</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("StoriesTab")}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="small" color="#b45309" style={{ marginVertical: 20 }} />
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesScroll}>
          {stories.map((story) => (
            <TouchableOpacity
              key={story.id}
              style={styles.storyCard}
              activeOpacity={0.85}
              onPress={() => navigation.navigate("StoryDetail", { storyId: story.id, title: story.title })}
            >
              <View style={styles.coverPlaceholder}>
                <BookOpen size={32} color="#94a3b8" />
                {story.genre && (
                  <View style={styles.genreTag}>
                    <Text style={styles.genreTagText}>{story.genre}</Text>
                  </View>
                )}
              </View>

              <View style={styles.storyInfo}>
                <Text style={styles.storyTitle} numberOfLines={1}>
                  {story.title}
                </Text>
                <Text style={styles.storyDesc} numberOfLines={2}>
                  {story.desc}
                </Text>
                <View style={styles.storyMeta}>
                  <View style={styles.metaItem}>
                    <Layers size={12} color="#64748b" />
                    <Text style={styles.metaText}>{story.totalChapters || 0} Ch.</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Eye size={12} color="#64748b" />
                    <Text style={styles.metaText}>{story.views || 0} reads</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Latest Blog & Thoughts */}
      <View style={[styles.sectionHeader, { marginTop: 30 }]}>
        <View>
          <Text style={styles.sectionOverline}>REFLECTIONS</Text>
          <Text style={styles.sectionTitle}>Recent Posts</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("BlogTab")}>
          <Text style={styles.seeAllText}>Read More</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.postsList}>
        {posts.slice(0, 3).map((post) => (
          <TouchableOpacity
            key={post.id}
            style={styles.postCard}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("BlogTab")}
          >
            <View style={styles.postCategoryRow}>
              <Text style={styles.postCategory}>{post.category}</Text>
              <Text style={styles.postDate}>
                {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </Text>
            </View>
            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.postSnippet} numberOfLines={2}>
              {post.content.replace(/<[^>]*>?/gm, "")}
            </Text>
          </TouchableOpacity>
        ))}
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
  heroCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fef3c7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#78350f",
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0f172a",
    fontFamily: "serif",
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 22,
    marginBottom: 18,
  },
  heroButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#1c1917",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  heroButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 14,
  },
  sectionOverline: {
    fontSize: 10,
    fontWeight: "800",
    color: "#b45309",
    letterSpacing: 1.2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0f172a",
    fontFamily: "serif",
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#b45309",
  },
  storiesScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  storyCard: {
    width: 220,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginRight: 14,
    overflow: "hidden",
  },
  coverPlaceholder: {
    height: 120,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  genreTag: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(15, 23, 42, 0.85)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  genreTagText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "600",
  },
  storyInfo: {
    padding: 14,
  },
  storyTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#0f172a",
    fontFamily: "serif",
    marginBottom: 4,
  },
  storyDesc: {
    fontSize: 12,
    color: "#64748b",
    lineHeight: 18,
    marginBottom: 10,
  },
  storyMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: "#64748b",
  },
  postsList: {
    gap: 12,
  },
  postCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  postCategoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  postCategory: {
    fontSize: 11,
    fontWeight: "700",
    color: "#b45309",
    textTransform: "uppercase",
  },
  postDate: {
    fontSize: 11,
    color: "#94a3b8",
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
    fontFamily: "serif",
    marginBottom: 6,
  },
  postSnippet: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 19,
  },
});
