"use client";

import { useState, useEffect } from "react";
import {
  fetchAllUsers,
  fetchAllStacks,
  fetchUserData,
} from "../../../service/firebaseService";
import { formatDistance, format, formatRelative } from "date-fns";
import Image from "next/image";
import {
  Users,
  Image as ImageIcon,
  TrendingUp,
  Images,
  Share2,
  Lock,
  Search,
  Filter,
  MoreVertical,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase/config";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [stacks, setStacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [userData, setUserData] = useState(null);
  const [authorized, setAuthorized] = useState(false);

  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const checkAdminAndLoadData = async () => {
      try {
        // First, fetch and check user data
        const userDataResult = await fetchUserData(user?.uid);
        setUserData(userDataResult);

        if (!userDataResult?.isAdmin) {
          router.push("/dashboard");
          return; // Stop here if not admin
        }

        setAuthorized(true); // User is admin, mark as authorized

        // Then load the rest of the data
        const [usersData, stacksData] = await Promise.all([
          fetchAllUsers(),
          fetchAllStacks(),
        ]);

        setUsers(usersData);
        setStacks(stacksData);
      } catch (error) {
        console.error("Error in admin dashboard:", error);
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndLoadData();
  }, [router]);

  const formatDate = (timestamp) => {
    try {
      // Handle Firebase Timestamp
      if (timestamp?.seconds) {
        return format(new Date(timestamp.seconds * 1000), "MMM d, yyyy");
      }
      // Handle regular date strings or numbers
      if (timestamp) {
        return format(new Date(timestamp), "MMM d, yyyy");
      }
      return "No date";
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  };

  const formatTimeAgo = (timestamp) => {
    try {
      // Handle Firebase Timestamp
      if (timestamp?.seconds) {
        return formatDistance(new Date(timestamp.seconds * 1000), new Date(), {
          addSuffix: true,
        });
      }
      // Handle regular date strings or numbers
      if (timestamp) {
        return formatDistance(new Date(timestamp), new Date(), {
          addSuffix: true,
        });
      }
      return "No date";
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  // Filter functions
  const filteredUsers = users.filter(
    (user) =>
      user.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStacks = stacks.filter((stack) => {
    const matchesSearch = stack.caption
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all"
        ? true
        : filterStatus === "private"
        ? stack.isPrivate
        : !stack.isPrivate;
    return matchesSearch && matchesFilter;
  });

  const calculateAverageStacksPerWeek = (stacks) => {
    if (!stacks.length) return 0;

    // Get the earliest stack date
    const dates = stacks.map((stack) =>
      stack.timestamp?.seconds
        ? new Date(stack.timestamp.seconds * 1000)
        : new Date()
    );
    const earliestDate = new Date(Math.min(...dates));
    const now = new Date();

    // Calculate weeks difference
    const weeksDiff = Math.max(
      1,
      Math.ceil((now - earliestDate) / (1000 * 60 * 60 * 24 * 7))
    );

    return (stacks.length / weeksDiff).toFixed(1);
  };

  const calculateAverageImagesPerStack = (stacks) => {
    if (!stacks.length) return 0;
    const totalImages = stacks.reduce(
      (sum, stack) => sum + (stack.imageCount || 0),
      0
    );
    return (totalImages / stacks.length).toFixed(1);
  };

  const calculateAverageSharedWith = (stacks) => {
    if (!stacks.length) return 0;
    const totalShared = stacks.reduce((sum, stack) => {
      return sum + (stack.sharedWith?.length || 0);
    }, 0);
    return (totalShared / stacks.length).toFixed(1);
  };

  // Stats cards component
  const StatsCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800/50 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-neutral-400 text-sm">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );

  // Show loading state while checking authorization
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // If not authorized, don't render anything (will redirect)
  if (!authorized) {
    return null;
  }

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
        {/* Header with Stats */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total Users"
              value={users.length}
              icon={Users}
              color="bg-purple-500/10 text-purple-500"
            />
            <StatsCard
              title="Avg Stacks/Week"
              value={calculateAverageStacksPerWeek(stacks)}
              icon={TrendingUp} // Import this from lucide-react
              color="bg-blue-500/10 text-blue-500"
            />
            <StatsCard
              title="Avg Images/Stack"
              value={calculateAverageImagesPerStack(stacks)}
              icon={Images} // Import this from lucide-react
              color="bg-green-500/10 text-green-500"
            />
            <StatsCard
              title="Avg Shared/Stack"
              value={calculateAverageSharedWith(stacks)}
              icon={Share2} // Import this from lucide-react
              color="bg-pink-500/10 text-pink-500"
            />
            <StatsCard
              title="Total Stacks"
              value={stacks.length}
              icon={ImageIcon}
              color="bg-indigo-500/10 text-indigo-500"
            />
            <StatsCard
              title="Private Stacks"
              value={stacks.filter((s) => s.isPrivate).length}
              icon={Lock} // Import this from lucide-react
              color="bg-yellow-500/10 text-yellow-500"
            />
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-neutral-900/50 border border-neutral-800/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
              />
            </div>

            {activeTab === "stacks" && (
              <div className="flex items-center gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 bg-neutral-900/50 border border-neutral-800/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                >
                  <option value="all">All Stacks</option>
                  <option value="public">Public Only</option>
                  <option value="private">Private Only</option>
                </select>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="border-b border-neutral-800">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("users")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "users"
                    ? "border-purple-500 text-purple-500"
                    : "border-transparent text-neutral-400 hover:text-neutral-300"
                }`}
              >
                Users
              </button>
              <button
                onClick={() => setActiveTab("stacks")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "stacks"
                    ? "border-purple-500 text-purple-500"
                    : "border-transparent text-neutral-400 hover:text-neutral-300"
                }`}
              >
                Stacks
              </button>
            </nav>
          </div>

          {/* Tables with updated styling */}
          {activeTab === "users" ? (
            <div className="bg-neutral-900/50 backdrop-blur-xl rounded-xl border border-neutral-800/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-800">
                  <thead className="bg-neutral-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                        Stacks
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-neutral-800/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Image
                              src={user.profileImageUrl}
                              alt={user.fullname}
                              width={32}
                              height={32}
                              className="rounded-full w-8 h-8 object-cover"
                            />
                            <div className="ml-4">
                              <div className="font-medium">{user.fullname}</div>
                              <div className="text-sm text-neutral-400">
                                @{user.username}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-neutral-400">
                          {user.stackScore}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {
                            stacks.filter((stack) => stack.ownerUid === user.id)
                              .length
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button className="text-purple-500 hover:text-purple-400">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-neutral-900/50 backdrop-blur-xl rounded-xl border border-neutral-800/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-800">
                  <thead className="bg-neutral-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                        Stack
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                        Owner
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                        Images
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {filteredStacks.map((stack) => {
                      const owner = users.find(
                        (user) => user.id === stack.ownerUid
                      );
                      return (
                        <tr key={stack.id} className="hover:bg-neutral-800/50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded bg-neutral-700 flex items-center justify-center">
                                <span className="text-lg">
                                  {stack.imageCount || 0}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="font-medium">
                                  {stack.caption || "Untitled Stack"}
                                </div>
                                <div className="text-sm text-neutral-400">
                                  {stack.id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {owner?.fullname || "Unknown"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-neutral-400">
                            {formatTimeAgo(stack.timestamp)}
                            <span className="block text-xs text-neutral-500">
                              {formatDate(stack.timestamp)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {stack.imageCount || 0} images
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                stack.isPrivate
                                  ? "bg-purple-900/30 text-purple-400"
                                  : "bg-emerald-900/30 text-emerald-400"
                              }`}
                            >
                              {stack.isPrivate ? "Private" : "Public"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button className="text-purple-500 hover:text-purple-400">
                              View Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
