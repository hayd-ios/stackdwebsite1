"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { fetchUserData, fetchUsersStacks } from "../../service/firebaseService";
import { formatDistance, format, formatRelative } from "date-fns";
import Link from "next/link";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [stacks, setStacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  const formatDate = (dateString) => {
    try {
      // First check if it's a Firebase Timestamp
      if (dateString?.seconds) {
        return formatRelative(new Date(dateString.seconds * 1000), new Date());
      }

      // Handle regular date strings
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return formatRelative(date, new Date());
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  };

  const formatTimeDistance = (dateString) => {
    try {
      // First check if it's a Firebase Timestamp
      if (dateString?.seconds) {
        return formatDistance(new Date(dateString.seconds * 1000), new Date(), {
          addSuffix: true,
        });
      }

      // Handle regular date strings
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return formatDistance(date, new Date(), { addSuffix: true });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!user?.uid) return;

        const [userInfo, userStacks] = await Promise.all([
          fetchUserData(user.uid),
          fetchUsersStacks(user.uid),
        ]);

        setUserData(userInfo);
        setStacks(userStacks);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Welcome Message */}
          <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg">
            <h2 className="text-lg font-semibold">
              Welcome, {userData?.fullname.split(" ")[0]} 👋
            </h2>
            <p className="text-sm text-neutral-400">
              Overview of your stacks and images.
            </p>
          </div>
          {/* Stack Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-neutral-400">
                Total Stacks
              </h3>
              <p className="text-2xl font-bold text-white mt-1">
                {stacks.length}
              </p>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-neutral-400">
                Total Images
              </h3>
              <p className="text-2xl font-bold text-white mt-1">
                {stacks.reduce((acc, stack) => acc + stack.imageCount, 0)}
              </p>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-neutral-400">
                Private Stacks
              </h3>
              <p className="text-2xl font-bold text-white mt-1">
                {stacks.filter((stack) => stack.isPrivate).length}
              </p>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-neutral-400">
                Public Stacks
              </h3>
              <p className="text-2xl font-bold text-white mt-1">
                {stacks.filter((stack) => !stack.isPrivate).length}
              </p>
            </div>
          </div>

          {/* Recent Stacks */}
          <div className="border border-neutral-800 rounded-lg">
            <div className="p-4 border-b border-neutral-800">
              <h2 className="text-lg font-semibold">Recent Stacks</h2>
            </div>
            <div className="divide-y divide-neutral-800">
              {stacks?.map((stack) => (
                <div
                  key={stack.id}
                  className="p-4 hover:bg-neutral-900 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-neutral-800 rounded flex items-center justify-center">
                        <span className="text-lg">{stack.imageCount}</span>
                      </div>
                      <div>
                        <h3 className="font-medium">
                          {stack.caption || "Untitled Stack"}
                        </h3>
                        <div className="text-sm text-neutral-400">
                          Created {formatDate(stack.timestamp)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          stack.isPrivate
                            ? "bg-purple-900/30 text-purple-400"
                            : "bg-emerald-900/30 text-emerald-400"
                        }`}
                      >
                        {stack.isPrivate ? "Private" : "Public"}
                      </span>
                      <button className="text-neutral-400 hover:text-white">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-6 gap-2">
                    {stack.imageUrls.slice(0, 6).map((url, index) => (
                      <div
                        key={index}
                        className="aspect-square bg-neutral-800 rounded overflow-hidden"
                      >
                        <img
                          src={url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm text-neutral-400">
                    <div className="flex items-center space-x-4">
                      <span>{stack.imageCount} images</span>
                      {stack.notificationSent && (
                        <span className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Notifications sent
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-neutral-400">
                      Sent {formatTimeDistance(stack.uploadCompleted)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Create New Stack Button */}
          <div className="fixed bottom-8 right-8">
            <button className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg transition-colors">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
