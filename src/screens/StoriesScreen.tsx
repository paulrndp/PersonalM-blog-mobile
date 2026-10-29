import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { fetchStoriesApi, Story } from "../services/api";
import { BookOpen, Search, Layers, Eye, ChevronRight } from "lucide-react-native";

export default function StoriesScreen({ navigation }: any) {
  const [stories, setStories] = useState<Story[]>([]);
  const [filtered, setFiltered] = useState<Story[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStoriesApi().then((data) => {
      setStories(data);
      setFiltered(data);
      setLoading(false);
    });
  }, []);

  const handleSearch = (text: string) => {
    setSearch(text);
    if (!text.trim()) {
      setFiltered(stories);
    } else {
      const q = text.toLowerCase();
      setFiltered(
        stories.filter(
          (s) =>
            s.title.toLowerCase().includes(q) ||
            s.desc.toLowerCase().includes(q) ||
            (s.genre && s.genre.toLowerCase().includes(q))
        )
      );
    }
  };

  const renderItem = ({ item }: { item: Story }) => (
    <TouchableOpacity
      style={styles.storyCard}
      activeOpacity={0.8}
      onPress={() => navigation.navigate("StoryDetail", { storyId: item.id, title: item.title })}
    >
      <View style={styles.thumbnailPlaceholder}>
        <BookOpen size={24} color="#64748b" />
      </View>

      <View style={styles.cardContent}>
        <View style={styles.genreBadge}>
          <Text style={styles.genreBadgeText}>{item.genre || "Fiction"}</Text>
        </View>

        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.desc} numberOfLines={2}>
          {item.desc}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.metaBadge}>
            <Layers size={11} color="#64748b" />
            <Text style={styles.metaText}>{item.totalChapters || 0} Parts</Text>
          </View>
          <View style={styles.metaBadge}>
            <Eye size={11} color="#64748b" />
            <Text style={styles.metaText}>{item.views || 0} reads</Text>
          </View>
          <ChevronRight size={16} color="#94a3b8" style={{ marginLeft: "auto" }} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={16} color="#94a3b8" />
        <TextInput
          placeholder="Search novels or genres..."
          placeholderTextColor="#94a3b8"
          value={search}
          onChangeText={handleSearch}
          style={styles.searchInput}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#b45309" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No stories found matching your search.</Text>
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#0f172a",
  },
  list: {
    padding: 16,
    paddingTop: 4,
    gap: 12,
  },
  storyCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
    gap: 14,
  },
  thumbnailPlaceholder: {
    width: 60,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cardContent: {
    flex: 1,
  },
  genreBadge: {
    backgroundColor: "#fef3c7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  genreBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#78350f",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
    fontFamily: "serif",
    marginBottom: 3,
  },
  desc: {
    fontSize: 12,
    color: "#64748b",
    lineHeight: 17,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  metaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  metaText: {
    fontSize: 11,
    color: "#64748b",
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
