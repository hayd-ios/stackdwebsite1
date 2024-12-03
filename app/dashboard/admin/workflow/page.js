"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "../../../../firebase/config";
import { useAuth, handleLogout } from "../../../../context/AuthContext";
import { fetchUserData } from "../../../../service/firebaseService";
import { useRouter } from "next/navigation";
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  orderBy,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../../firebase/config";
import { AlertTriangle, CheckCircle2, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";

export default function WorkflowPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    version: "",
    severity: "low",
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [issues, setIssues] = useState([]);
  const [issuesLoading, setIssuesLoading] = useState(true);
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const router = useRouter();
  const severityOptions = [
    { value: "low", label: "Low", color: "bg-blue-500/10 text-blue-500" },
    {
      value: "medium",
      label: "Medium",
      color: "bg-yellow-500/10 text-yellow-500",
    },
    { value: "high", label: "High", color: "bg-red-500/10 text-red-500" },
    {
      value: "critical",
      label: "Critical",
      color: "bg-red-900/10 text-red-500",
    },
  ];
  const [filterVersion, setFilterVersion] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("");
  const [uniqueVersions, setUniqueVersions] = useState([]);

  useEffect(() => {
    const checkAdminAndLoadData = async () => {
      try {
        // First check admin status
        const userDataResult = await fetchUserData(user?.uid);
        setUserData(userDataResult);

        if (!userDataResult?.isAdmin) {
          router.push("/dashboard");
          return;
        }

        // Only fetch issues if user is admin
        await fetchIssues();
      } catch (error) {
        console.error("Error loading admin data:", error);
        router.push("/dashboard");
      }
    };

    checkAdminAndLoadData();
  }, [router, user?.uid]);

  const fetchIssues = async () => {
    try {
      const issuesQuery = query(
        collection(db, "issues"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(issuesQuery);
      const issuesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      }));
      setIssues(issuesData);
    } catch (error) {
      console.error("Error fetching issues:", error);
    } finally {
      setIssuesLoading(false);
    }
  };

  useEffect(() => {
    // Extract unique versions from issues
    const versions = [...new Set(issues.map((issue) => issue.version))].sort();
    setUniqueVersions(versions);
  }, [issues]);

  const filteredIssues = issues.filter((issue) => {
    const matchesVersion = !filterVersion || issue.version === filterVersion;
    const matchesSeverity =
      !filterSeverity || issue.severity === filterSeverity;
    return matchesVersion && matchesSeverity;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const issueData = {
        ...formData,
        createdAt: serverTimestamp(),
        status: "open",
      };

      await addDoc(collection(db, "issues"), issueData);
      await fetchIssues();

      setNotification({
        type: "success",
        message: "Issue created successfully!",
      });

      setFormData({
        title: "",
        description: "",
        version: "",
        severity: "low",
      });
    } catch (error) {
      console.error("Error creating issue:", error);
      setNotification({
        type: "error",
        message: "Failed to create issue. Please try again.",
      });
    } finally {
      setLoading(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const updateIssueStatus = async (issueId, newStatus) => {
    try {
      const issueRef = doc(db, "issues", issueId);
      await updateDoc(issueRef, {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });

      // Refresh issues list
      await fetchIssues();

      setNotification({
        type: "success",
        message: `Issue status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error("Error updating issue status:", error);
      setNotification({
        type: "error",
        message: "Failed to update issue status",
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-white">Stackd.</h1>
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <button className="px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors">
                  Dashboard
                </button>
              </Link>
              {userData?.isAdmin && (
                <Link href="/dashboard/admin">
                  <button className="px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors">
                    Admin
                  </button>
                </Link>
              )}

              {userData?.isAdmin && (
                <Link href="/dashboard/admin/workflow">
                  <button className="px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors">
                    Workflow
                  </button>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-red-500/80 hover:text-red-400 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Workflow Management</h1>
            <p className="mt-2 text-neutral-400">
              Create and track issues for the application
            </p>
          </div>

          {notification && (
            <div
              className={`p-4 rounded-lg border ${
                notification.type === "success"
                  ? "bg-green-500/10 border-green-500/20 text-green-500"
                  : "bg-red-500/10 border-red-500/20 text-red-500"
              } flex items-center space-x-2`}
            >
              {notification.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-neutral-400 mb-1"
                >
                  Issue Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-neutral-900/90 border border-neutral-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                  placeholder="Brief description of the issue"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-neutral-400 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-neutral-900/90 border border-neutral-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                  placeholder="Detailed description of the issue..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="version"
                    className="block text-sm font-medium text-neutral-400 mb-1"
                  >
                    App Version
                  </label>
                  <input
                    type="text"
                    id="version"
                    name="version"
                    required
                    value={formData.version}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-neutral-900/90 border border-neutral-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                    placeholder="e.g., 1.0.0"
                  />
                </div>

                <div>
                  <label
                    htmlFor="severity"
                    className="block text-sm font-medium text-neutral-400 mb-1"
                  >
                    Severity
                  </label>
                  <select
                    id="severity"
                    name="severity"
                    required
                    value={formData.severity}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-neutral-900/90 border border-neutral-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                  >
                    {severityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-500"
              >
                {loading ? "Creating..." : "Create Issue"}
              </button>

              <div
                className={`px-3 py-1 rounded-full text-sm ${
                  severityOptions.find(
                    (option) => option.value === formData.severity
                  )?.color
                }`}
              >
                <div className="flex items-center space-x-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span>
                    {
                      severityOptions.find(
                        (option) => option.value === formData.severity
                      )?.label
                    }
                  </span>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="mt-16 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Recent Issues</h2>
            <span className="text-neutral-400">
              {filteredIssues.length} of {issues.length}{" "}
              {issues.length === 1 ? "issue" : "issues"}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-neutral-400 mb-1">
                Filter by Version
              </label>
              <select
                value={filterVersion}
                onChange={(e) => setFilterVersion(e.target.value)}
                className="w-full px-4 py-2 bg-neutral-900/90 border border-neutral-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
              >
                <option value="">All Versions</option>
                {uniqueVersions.map((version) => (
                  <option key={version} value={version}>
                    v{version}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-neutral-400 mb-1">
                Filter by Severity
              </label>
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="w-full px-4 py-2 bg-neutral-900/90 border border-neutral-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
              >
                <option value="">All Severities</option>
                {severityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {issuesLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-neutral-400">Loading issues...</p>
            </div>
          ) : issues.length === 0 ? (
            <div className="text-center py-8 text-neutral-400">
              No issues found. Create your first issue above.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800/50 rounded-lg p-4 hover:bg-neutral-800/50 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="font-medium">{issue.title}</h3>
                      <p className="text-sm text-neutral-400 line-clamp-2">
                        {issue.description}
                      </p>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-sm ${
                        severityOptions.find(
                          (option) => option.value === issue.severity
                        )?.color
                      }`}
                    >
                      <div className="flex items-center space-x-1">
                        <AlertTriangle className="w-4 h-4" />
                        <span>
                          {
                            severityOptions.find(
                              (option) => option.value === issue.severity
                            )?.label
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <span className="text-neutral-400">v{issue.version}</span>
                      <div className="flex items-center space-x-2">
                        <select
                          value={issue.status}
                          onChange={(e) =>
                            updateIssueStatus(issue.id, e.target.value)
                          }
                          className="bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-1 text-xs focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                        >
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="fixed">Fixed</option>
                          <option value="closed">Closed</option>
                        </select>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${
                            issue.status === "open"
                              ? "bg-green-500/10 text-green-500"
                              : issue.status === "in_progress"
                              ? "bg-yellow-500/10 text-yellow-500"
                              : issue.status === "fixed"
                              ? "bg-blue-500/10 text-blue-500"
                              : "bg-neutral-500/10 text-neutral-500"
                          }`}
                        >
                          {issue.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-neutral-400 text-[9px] md:text-md">
                      <Clock className="w-4 h-4 mr-1" />
                      {issue.createdAt
                        ? format(issue.createdAt, "MMM d, yyyy HH:mm")
                        : "Date unknown"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
