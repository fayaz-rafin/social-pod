'use client';
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface GroupGoal {
  id: string;
  title: string;
  target: number;
  completed: number;
  unit: string;
  emoji: string;
}

interface GroupChallenge {
  title: string;
  description: string;
  daysLeft: number;
  reward: string;
  completionRate: number;
  participantsOnTrack: number;
  totalParticipants: number;
}

interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  distance: string;
  category: string;
  meetupFrequency: string;
  image: string;
  tags: string[];
  isJoined: boolean;
  goals: GroupGoal[];
  challenge: GroupChallenge;
}

export default function GroupPodsPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("all");
  const [joinedGroups, setJoinedGroups] = useState<Set<string>>(new Set());

  // Mock data for fitness groups
  const groups: Group[] = [
    {
      id: "1",
      name: "Sunset Weight Loss Warriors",
      description: "Daily evening walks and meal prep sessions. We're all working towards our summer body goals!",
      members: 24,
      distance: "0.3 miles",
      category: "weight-loss",
      meetupFrequency: "Daily 6PM",
      image: "🏃‍♀️",
      tags: ["Walking", "Meal Prep", "Support"],
      isJoined: false,
      goals: [
        { id: "1", title: "Weekly Loblaws Shops", target: 4, completed: 3, unit: "visits", emoji: "🛒" },
        { id: "2", title: "Healthy Items Purchased", target: 50, completed: 38, unit: "items", emoji: "🥬" },
        { id: "3", title: "PC Points Earned", target: 1000, completed: 750, unit: "points", emoji: "⭐" }
      ],
      challenge: {
        title: "Summer Body Challenge",
        description: "Lose 15 lbs collectively as a group by summer",
        daysLeft: 45,
        reward: "350 bonus points for weight loss supplements & healthy meal services",
        completionRate: 68,
        participantsOnTrack: 16,
        totalParticipants: 24
      }
    },
    {
      id: "2", 
      name: "Keto Kitchen Collective",
      description: "Share keto recipes, grocery hauls, and track progress together. Beginners welcome!",
      members: 18,
      distance: "0.8 miles",
      category: "nutrition",
      meetupFrequency: "Weekly Sat 10AM",
      image: "🥑",
      tags: ["Keto", "Recipes", "Progress"],
      isJoined: false,
      goals: [
        { id: "1", title: "Keto Products Bought", target: 25, completed: 18, unit: "items", emoji: "🥑" },
        { id: "2", title: "Organic Section Visits", target: 12, completed: 9, unit: "visits", emoji: "🌱" },
        { id: "3", title: "No Name Keto Items", target: 15, completed: 12, unit: "items", emoji: "🏷️" }
      ],
      challenge: {
        title: "30-Day Keto Reset",
        description: "Complete 30 days of strict keto together",
        daysLeft: 8,
        reward: "400 bonus points for keto products & MCT oils",
        completionRate: 73,
        participantsOnTrack: 13,
        totalParticipants: 18
      }
    },
    {
      id: "3",
      name: "Morning Cardio Club",
      description: "Start your day right! Morning runs, cycling, and HIIT workouts to burn those calories.",
      members: 31,
      distance: "1.2 miles", 
      category: "cardio",
      meetupFrequency: "Mon/Wed/Fri 7AM",
      image: "🚴‍♂️",
      tags: ["Running", "HIIT", "Morning"],
      isJoined: false,
      goals: [
        { id: "1", title: "Sports Drinks Purchased", target: 20, completed: 15, unit: "bottles", emoji: "🥤" },
        { id: "2", title: "Energy Bar Section Visits", target: 8, completed: 6, unit: "visits", emoji: "🍫" },
        { id: "3", title: "Early Morning Shops", target: 12, completed: 9, unit: "trips", emoji: "🌅" }
      ],
      challenge: {
        title: "Cardio Consistency Challenge",
        description: "Complete 36 morning sessions as a group in 6 weeks",
        daysLeft: 12,
        reward: "500 bonus points for cardio equipment & fitness trackers",
        completionRate: 84,
        participantsOnTrack: 26,
        totalParticipants: 31
      }
    },
    {
      id: "4",
      name: "Accountability Buddies",
      description: "Daily check-ins, progress photos, and motivation. We keep each other on track!",
      members: 42,
      distance: "2.1 miles",
      category: "support",
      meetupFrequency: "Daily Online + Weekend Meetup",
      image: "💪",
      tags: ["Accountability", "Support", "Check-ins"],
      isJoined: false,
      goals: [
        { id: "1", title: "PC App Check-ins", target: 30, completed: 28, unit: "days", emoji: "📱" },
        { id: "2", title: "Wellness Products Bought", target: 15, completed: 12, unit: "items", emoji: "💊" },
        { id: "3", title: "Group Shopping Trips", target: 6, completed: 4, unit: "trips", emoji: "👥" }
      ],
      challenge: {
        title: "Ultimate Accountability Month",
        description: "100% daily check-in rate for entire group",
        daysLeft: 6,
        reward: "450 bonus points for wellness products & mental health apps",
        completionRate: 93,
        participantsOnTrack: 39,
        totalParticipants: 42
      }
    },
    {
      id: "5",
      name: "Yoga & Mindful Eating",
      description: "Combine gentle yoga with mindful eating practices for sustainable weight loss.",
      members: 16,
      distance: "1.5 miles",
      category: "wellness",
      meetupFrequency: "Tue/Thu 6:30PM",
      image: "🧘‍♀️",
      tags: ["Yoga", "Mindfulness", "Wellness"],
      isJoined: false,
      goals: [
        { id: "1", title: "Organic Produce Bought", target: 30, completed: 24, unit: "items", emoji: "🥬" },
        { id: "2", title: "Mindful Food Section", target: 12, completed: 9, unit: "visits", emoji: "🧘‍♀️" },
        { id: "3", title: "Herbal Tea Purchases", target: 8, completed: 6, unit: "boxes", emoji: "🍵" }
      ],
      challenge: {
        title: "Mindful Wellness Journey",
        description: "Complete mindful eating + yoga practice for 3 weeks",
        daysLeft: 5,
        reward: "375 bonus points for yoga gear & meditation apps",
        completionRate: 78,
        participantsOnTrack: 12,
        totalParticipants: 16
      }
    },
    {
      id: "6",
      name: "Strength Training Newbies",
      description: "Learn proper form and build lean muscle. Perfect for beginners wanting to tone up!",
      members: 19,
      distance: "0.9 miles",
      category: "strength",
      meetupFrequency: "Sat/Sun 9AM",
      image: "🏋️‍♀️",
      tags: ["Strength", "Beginner", "Form"],
      isJoined: false,
      goals: [
        { id: "1", title: "Protein Products Bought", target: 20, completed: 15, unit: "items", emoji: "🥩" },
        { id: "2", title: "Supplement Aisle Visits", target: 8, completed: 5, unit: "visits", emoji: "💊" },
        { id: "3", title: "PC Blue Menu Items", target: 25, completed: 18, unit: "items", emoji: "🏷️" }
      ],
      challenge: {
        title: "Newbie Gains Challenge",
        description: "Master 5 basic exercises with perfect form",
        daysLeft: 18,
        reward: "425 bonus points for strength equipment & protein powders",
        completionRate: 62,
        participantsOnTrack: 12,
        totalParticipants: 19
      }
    }
  ];

  const filters = [
    { id: "all", label: "All Groups", emoji: "🌟" },
    { id: "weight-loss", label: "Weight Loss", emoji: "⚡" },
    { id: "nutrition", label: "Nutrition", emoji: "🥗" },
    { id: "cardio", label: "Cardio", emoji: "❤️" },
    { id: "support", label: "Support", emoji: "🤝" }
  ];

  const filteredGroups = activeFilter === "all" 
    ? groups 
    : groups.filter(group => group.category === activeFilter);

  const toggleJoinGroup = (groupId: string) => {
    const newJoinedGroups = new Set(joinedGroups);
    if (newJoinedGroups.has(groupId)) {
      newJoinedGroups.delete(groupId);
    } else {
      newJoinedGroups.add(groupId);
      // Navigate to group progress page when joining
      router.push(`/grouppods/${groupId}/progress`);
      return;
    }
    setJoinedGroups(newJoinedGroups);
  };

  return (
    <div className="min-h-screen bg-[#FDE500] px-4 pt-6 pb-6 w-full max-w-md mx-auto">
      {/* Top bar */}
      <div className="w-full flex justify-between items-center mb-6">
        <span className="text-xs font-semibold tracking-wide">9:41</span>
        <div className="flex gap-1 items-center">
          <span className="inline-block w-1.5 h-1.5 bg-black rounded-full"></span>
          <span className="inline-block w-1.5 h-1.5 bg-black rounded-full"></span>
          <span className="inline-block w-1.5 h-1.5 bg-black rounded-full"></span>
        </div>
        <div className="flex gap-1 items-center">
          <span className="inline-block w-4 h-2 bg-black rounded-sm"></span>
          <span className="inline-block w-2 h-2 bg-black rounded-full"></span>
        </div>
      </div>

      {/* Header */}
      <div className="w-full mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🛒</span>
          <h1 className="text-4xl font-extrabold leading-tight text-black">
            Loblaws Pods
          </h1>
        </div>
        <p className="text-lg font-semibold text-black/80">
          Shop smarter with your fitness community
        </p>
        <p className="text-sm text-black/60 mt-1">
          📍 Earn rewards while achieving your goals
        </p>
      </div>

      {/* Filter chips */}
      <div className="w-full mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                activeFilter === filter.id
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              <span>{filter.emoji}</span>
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Groups list */}
      <div className="w-full space-y-4 flex-1">
        {filteredGroups.map((group) => (
          <div
            key={group.id}
            className="bg-white rounded-2xl p-4 shadow-md border border-gray-100"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{group.image}</div>
                <div>
                  <h3 className="font-bold text-black text-lg">{group.name}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span>👥 {group.members} members</span>
                    <span>📍 {group.distance}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Goals Section */}
            <div className="mb-3">
              <h4 className="font-semibold text-black text-sm mb-2">🛒 Loblaws Goals</h4>
              <div className="grid grid-cols-1 gap-2">
                {group.goals.slice(0, 2).map((goal) => {
                  const progressPercentage = Math.min((goal.completed / goal.target) * 100, 100);
                  return (
                    <div key={goal.id} className="bg-gray-50 rounded-lg p-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700 flex items-center gap-1">
                          <span>{goal.emoji}</span>
                          {goal.title}
                        </span>
                        <span className="text-xs text-gray-600">
                          {goal.completed}/{goal.target} {goal.unit}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div 
                          className="bg-orange-500 h-1 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => toggleJoinGroup(group.id)}
                className={`flex-1 py-2 px-4 rounded-full font-semibold text-sm transition-colors ${
                  joinedGroups.has(group.id)
                    ? "bg-green-500 text-white"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {joinedGroups.has(group.id) ? "✓ Joined" : "Join Group"}
              </button>
              <button 
                onClick={() => router.push(`/grouppods/${group.id}/progress`)}
                className="px-4 py-2 bg-gray-100 text-black rounded-full font-semibold text-sm hover:bg-gray-200 transition-colors"
              >
                View Goals
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom spacing for better scroll */}
      <div className="h-20"></div>
    </div>
  );
} 