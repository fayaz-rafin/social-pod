'use client';
import Image from "next/image";
import React, { useState } from "react";

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
}

export default function GroupPodsPage() {
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
      isJoined: false
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
      isJoined: false
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
      isJoined: false
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
      isJoined: false
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
      isJoined: false
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
      isJoined: false
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
        <h1 className="text-4xl font-extrabold leading-tight text-black mb-2">
          Group Pods
        </h1>
        <p className="text-lg font-semibold text-black/80">
          Find your fitness tribe nearby
        </p>
        <p className="text-sm text-black/60 mt-1">
          📍 Based on your interest: Getting Skinny
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

            <p className="text-black text-sm mb-3 leading-relaxed">
              {group.description}
            </p>

            <div className="flex items-center gap-2 mb-3">
              <div className="bg-gray-100 px-2 py-1 rounded-full">
                <span className="text-xs font-medium text-gray-700">
                  📅 {group.meetupFrequency}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {group.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-[#FDE500] text-black text-xs px-2 py-1 rounded-full font-medium"
                >
                  {tag}
                </span>
              ))}
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
              <button className="px-4 py-2 bg-gray-100 text-black rounded-full font-semibold text-sm hover:bg-gray-200 transition-colors">
                View
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