import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { fetchPostsApi, Post } from "../services/api";
import { Calendar, Eye, Sparkles, Feather } from "lucide-react-native";

export default function BlogScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<"All" | "Blog" | "Random">("All");
  const [loading, setLoading] = useState(true);

  const loadPosts = (cat?: string) => {
    setLoading(true);
    fetchPostsApi(cat).then((data) => {
      setPosts(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadPosts(filter);
  }, [filter]);

  const renderItem = ({ item }: { item: Post }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.categoryBadge}>
          {item.category === "Random" ? (
            <Sparkles size={11} color="#b45309" />
          ) : (
            <Feather size={11} color="#b45309" />
          )}
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Calendar size={11} color="#94a3b8" />
            <Text style={styles.metaText}>
              {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Eye size={11} color="#94a3b8" />
            <Text style={styles.metaText}>{item.views || 0}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.body}>{item.content.replace(/<[^>]*>?/gm, "")}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Category Tabs */}
      <View style={styles.tabsContainer}>
        {(["All", "Blog", "Random"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabBtn, filter === tab && styles.activeTabBtn]}
            onPress={() => setFilter(tab)}
          >
            <Text style={[styles.tabText, filter === tab && styles.activeTabText]}>
              {tab === "Random" ? "Random Thoughts" : tab === "Blog" ? "Blog Articles" : "All Posts"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#b45309" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No articles in this category.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faf9f6",
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    gap: 8,
  },
  tabBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
  },
  activeTabBtn: {
    backgroundColor: "#b45309",
  },
  tabText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
  },
  activeTabText: {
    color: "#ffffff",
  },
  list: {
    padding: 16,
    gap: 14,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#fef3c7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#78350f",
    textTransform: "uppercase",
  },
  metaRow: {
    flexDirection: "row",
    gap: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  metaText: {
    fontSize: 11,
    color: "#94a3b8",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    fontFamily: "serif",
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 22,
    fontFamily: "serif",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: "#94a3b8",
    fontSize: 14,
  },
});
