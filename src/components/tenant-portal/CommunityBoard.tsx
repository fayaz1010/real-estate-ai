import { Users, Plus, Trash2, AlertTriangle, Send } from "lucide-react";
import { useState, useEffect } from "react";

import { tenantPortalService } from "../../services/tenantPortalService";
import type { CommunityPost } from "../../types/tenantPortal";

const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export const CommunityBoard: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    tenantPortalService
      .getCommunityPosts()
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim() || !newAuthor.trim()) return;

    setSubmitting(true);
    try {
      const created = await tenantPortalService.createCommunityPost({
        author: newAuthor.trim(),
        content: newContent.trim(),
      });
      setPosts((prev) => [created, ...prev]);
      setNewContent("");
      setNewAuthor("");
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await tenantPortalService.deleteCommunityPost(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete post");
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen bg-[#f8f9fa] flex items-center justify-center"
        role="status"
      >
        <div
          className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#091a2b]"
          aria-hidden="true"
        />
        <span className="sr-only">Loading community board...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-[Open_Sans]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="font-montserrat text-2xl sm:text-3xl font-bold text-[#091a2b]">
            Community Board
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Connect with your neighbors
          </p>
        </header>

        {error && (
          <div
            className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center gap-3"
            role="alert"
          >
            <AlertTriangle
              className="w-5 h-5 text-red-600 flex-shrink-0"
              aria-hidden="true"
            />
            <p className="text-sm text-red-700">{error}</p>
            <button
              type="button"
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800 text-sm"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* New Post Toggle */}
        <div className="mb-6">
          {!showForm ? (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-[#091a2b] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              New Post
            </button>
          ) : (
            <form
              onSubmit={handleCreatePost}
              className="bg-white rounded-2xl shadow-sm p-6"
            >
              <h2 className="font-montserrat text-lg font-semibold text-[#091a2b] mb-4">
                Create a Post
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="post-author"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Your Name
                  </label>
                  <input
                    id="post-author"
                    type="text"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="Enter your name"
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#091a2b]/20 focus:border-[#091a2b] transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="post-content"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Message
                  </label>
                  <textarea
                    id="post-content"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Share something with the community..."
                    required
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#091a2b]/20 focus:border-[#091a2b] transition-colors resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  type="submit"
                  disabled={
                    submitting || !newContent.trim() || !newAuthor.trim()
                  }
                  className="flex items-center gap-2 bg-[#091a2b] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                  {submitting ? "Posting..." : "Post"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setNewContent("");
                    setNewAuthor("");
                  }}
                  className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl shadow-sm p-6"
                aria-label={`Post by ${post.author}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#091a2b] text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {post.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#091a2b]">
                        {post.author}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDate(post.date)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeletePost(post.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors p-1"
                    aria-label={`Delete post by ${post.author}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-600">{post.content}</p>
              </article>
            ))
          ) : (
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
              <Users
                className="w-10 h-10 text-gray-300 mx-auto mb-3"
                aria-hidden="true"
              />
              <p className="text-sm text-gray-500">
                No community posts yet. Be the first to share!
              </p>
            </div>
          )}
        </div>

        <footer className="mt-12 text-center">
          <p className="text-xs text-gray-400">
            Your AI Property Manager — Never Miss a Beat
          </p>
        </footer>
      </div>
    </div>
  );
};
