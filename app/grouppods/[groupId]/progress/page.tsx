'use client';
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

interface GroupGoal {
  id: string;
  title: string;
  target: number;
  completed: number;
  unit: string;
  emoji: string;
  description: string;
  isUserGoal?: boolean;
}

interface UserProgress {
  name: string;
  avatar: string;
  completedGoals: number;
  totalGoals: number;
  lastActivity: string;
  mainGoal: string;
}

interface GroupData {
  id: string;
  name: string;
  image: string;
  challenge: {
    title: string;
    description: string;
    daysLeft: number;
    reward: string;
    completionRate: number;
    participantsOnTrack: number;
    totalParticipants: number;
  };
  goals: GroupGoal[];
  userProgress: UserProgress[];
  userMainGoal: string;
}

export default function GroupProgressPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.groupId as string;
  
  const [activeTab, setActiveTab] = useState<'overview' | 'goals' | 'members'>('overview');

  // Mock data - in real app this would come from API based on groupId
  const groupData: GroupData = {
    id: groupId,
    name: "Sunset Weight Loss Warriors",
    image: "🏃‍♀️",
         challenge: {
       title: "Smart Shopper Challenge",
       description: "Order only weight-loss approved groceries for 30 days - tracked automatically",
       daysLeft: 18,
       reward: "$500 group grocery credit + free healthy meal kit subscriptions",
       completionRate: 72,
       participantsOnTrack: 17,
       totalParticipants: 24
     },
         goals: [
       {
         id: "1",
         title: "Correct Diet Items Purchased",
         target: 50,
         completed: 38,
         unit: "items",
         emoji: "✅",
         description: "Track purchases of weight-loss friendly items (lean proteins, vegetables, whole grains) from grocery orders",
         isUserGoal: true
       },
       {
         id: "2", 
         title: "Weekly Grocery Orders Completed",
         target: 8,
         completed: 6,
         unit: "orders",
         emoji: "🛒",
         description: "Complete weekly grocery orders with items aligned to your 'getting skinny' goal",
         isUserGoal: true
       },
       {
         id: "3",
         title: "Calorie-Dense Foods Avoided",
         target: 30,
         completed: 24,
         unit: "avoided items",
         emoji: "🚫",
         description: "Successfully avoid ordering high-calorie, processed foods during grocery shopping",
         isUserGoal: true
       },
       {
         id: "4",
         title: "Group Diet Score",
         target: 85,
         completed: 72,
         unit: "% healthy",
         emoji: "📊",
         description: "Group average of healthy vs unhealthy items in grocery orders tracked automatically",
         isUserGoal: false
       },
       {
         id: "5",
         title: "Smart Substitutions Made",
         target: 20,
         completed: 15,
         unit: "swaps",
         emoji: "🔄",
         description: "Replace unhealthy items with healthier alternatives in grocery orders (tracked by app)",
         isUserGoal: true
       },
       {
         id: "6",
         title: "Budget Efficiency Score",
         target: 90,
         completed: 78,
         unit: "% efficient",
         emoji: "💰",
         description: "Get maximum nutrition per dollar spent on groceries for weight loss goals",
         isUserGoal: false
       },
       {
         id: "7",
         title: "Meal Plan Adherence",
         target: 28,
         completed: 21,
         unit: "days",
         emoji: "📅",
         description: "Order groceries that match your pre-planned weight loss meal schedule",
         isUserGoal: true
       },
       {
         id: "8",
         title: "Group Order Participations",
         target: 6,
         completed: 4,
         unit: "group orders",
         emoji: "👥",
         description: "Join group grocery orders to get bulk discounts on healthy items",
         isUserGoal: false
       }
     ],
         userProgress: [
       { name: "You", avatar: "😊", completedGoals: 5, totalGoals: 8, lastActivity: "Ordered groceries 2 hours ago", mainGoal: "Getting Skinny" },
       { name: "Sarah M.", avatar: "🌟", completedGoals: 6, totalGoals: 8, lastActivity: "Smart swap made 4 hours ago", mainGoal: "Healthy Eating" },
       { name: "Mike R.", avatar: "💪", completedGoals: 4, totalGoals: 8, lastActivity: "Group order 1 day ago", mainGoal: "Budget Cooking" },
       { name: "Lisa K.", avatar: "🥗", completedGoals: 8, totalGoals: 8, lastActivity: "Diet compliance check 6 hours ago", mainGoal: "Meal Prep Pro" },
       { name: "James T.", avatar: "🏃‍♂️", completedGoals: 5, totalGoals: 8, lastActivity: "Avoided junk food 12 hours ago", mainGoal: "Getting Skinny" }
     ],
    userMainGoal: "Getting Skinny"
  };

  const userGoals = groupData.goals.filter(goal => goal.isUserGoal);
  const groupGoals = groupData.goals.filter(goal => !goal.isUserGoal);

  return (
    <div className="min-h-screen bg-[#FDE500] px-4 pt-6 pb-6 w-full max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={() => router.back()}
          className="p-2 bg-black text-white rounded-full"
        >
          ←
        </button>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{groupData.image}</span>
          <h1 className="text-xl font-bold text-black">{groupData.name}</h1>
        </div>
        <div className="w-10"></div>
      </div>

             {/* User's Main Goal Banner */}
       <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-4 mb-6 border border-green-200">
         <div className="flex items-center gap-3 mb-2">
           <span className="text-2xl">🎯</span>
           <div>
             <h3 className="font-bold text-green-800">Your Main Goal</h3>
             <p className="text-green-700 text-sm">{groupData.userMainGoal}</p>
           </div>
         </div>
         <p className="text-xs text-green-600">
           Your grocery purchases are automatically analyzed to ensure they align with weight loss goals!
         </p>
       </div>

       {/* Purchase Tracking Banner */}
       <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 mb-6 border border-blue-200">
         <div className="flex items-center justify-between mb-2">
           <div className="flex items-center gap-2">
             <span className="text-xl">🔍</span>
             <h3 className="font-bold text-blue-800">Smart Purchase Tracking</h3>
           </div>
           <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-semibold">ACTIVE</span>
         </div>
         <p className="text-xs text-blue-700 mb-3">
           We automatically scan your grocery orders and rate items based on your "getting skinny" goal
         </p>
         <div className="grid grid-cols-3 gap-2 text-xs">
           <div className="bg-green-100 p-2 rounded-lg text-center">
             <div className="font-bold text-green-800">89%</div>
             <div className="text-green-600">Diet Compliance</div>
           </div>
           <div className="bg-yellow-100 p-2 rounded-lg text-center">
             <div className="font-bold text-yellow-800">12</div>
             <div className="text-yellow-600">Items Flagged</div>
           </div>
           <div className="bg-blue-100 p-2 rounded-lg text-center">
             <div className="font-bold text-blue-800">6</div>
             <div className="text-blue-600">Orders This Week</div>
           </div>
         </div>
       </div>

      {/* Challenge Progress */}
      <div className="bg-white rounded-2xl p-4 mb-6 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-black">🏆 {groupData.challenge.title}</h3>
          <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
            {groupData.challenge.daysLeft} days left
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${groupData.challenge.completionRate}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-sm mb-3">
          <span className="text-gray-600">
            {groupData.challenge.participantsOnTrack}/{groupData.challenge.totalParticipants} members on track
          </span>
          <span className="font-bold text-purple-800">{groupData.challenge.completionRate}%</span>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
          <p className="text-sm text-yellow-800">
            <span className="font-semibold">🎁 Group Reward:</span> {groupData.challenge.reward}
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-white rounded-full p-1 mb-6 shadow-sm">
        {[
          { id: 'overview', label: 'Overview', emoji: '📊' },
          { id: 'goals', label: 'Goals', emoji: '🎯' },
          { id: 'members', label: 'Members', emoji: '👥' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2 px-3 rounded-full text-sm font-semibold transition-colors ${
              activeTab === tab.id
                ? 'bg-black text-white'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <span className="mr-1">{tab.emoji}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Your Personal Goals */}
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <h3 className="font-bold text-black mb-3 flex items-center gap-2">
              <span>🌟</span>
              Your Goals (Aligned with Getting Skinny)
            </h3>
            <div className="space-y-3">
              {userGoals.map((goal) => {
                const progressPercentage = Math.min((goal.completed / goal.target) * 100, 100);
                return (
                  <div key={goal.id} className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-green-800 flex items-center gap-2">
                        <span>{goal.emoji}</span>
                        {goal.title}
                      </span>
                      <span className="text-sm text-green-600">
                        {goal.completed}/{goal.target} {goal.unit}
                      </span>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-green-700">{goal.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-3 shadow-md text-center">
              <div className="text-2xl font-bold text-blue-600">{userGoals.filter(g => (g.completed/g.target) >= 1).length}</div>
              <div className="text-xs text-gray-600">Goals Completed</div>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-md text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(userGoals.reduce((acc, g) => acc + (g.completed/g.target), 0) / userGoals.length * 100)}%
              </div>
              <div className="text-xs text-gray-600">Overall Progress</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'goals' && (
        <div className="space-y-4">
          {/* All Goals */}
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <h3 className="font-bold text-black mb-3">📋 All Group Goals</h3>
            <div className="space-y-3">
              {groupData.goals.map((goal) => {
                const progressPercentage = Math.min((goal.completed / goal.target) * 100, 100);
                return (
                  <div key={goal.id} className={`rounded-lg p-3 border ${
                    goal.isUserGoal 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-medium flex items-center gap-2 ${
                        goal.isUserGoal ? 'text-green-800' : 'text-gray-800'
                      }`}>
                        <span>{goal.emoji}</span>
                        {goal.title}
                        {goal.isUserGoal && <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">Your Goal</span>}
                      </span>
                      <span className={`text-sm ${goal.isUserGoal ? 'text-green-600' : 'text-gray-600'}`}>
                        {goal.completed}/{goal.target} {goal.unit}
                      </span>
                    </div>
                    <div className={`w-full rounded-full h-2 mb-2 ${
                      goal.isUserGoal ? 'bg-green-200' : 'bg-gray-200'
                    }`}>
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          goal.isUserGoal ? 'bg-green-600' : 'bg-gray-500'
                        }`}
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                    <p className={`text-xs ${goal.isUserGoal ? 'text-green-700' : 'text-gray-600'}`}>
                      {goal.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'members' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <h3 className="font-bold text-black mb-3">👥 Member Progress</h3>
            <div className="space-y-3">
              {groupData.userProgress.map((user, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{user.avatar}</span>
                    <div>
                      <p className="font-semibold text-black">{user.name}</p>
                      <p className="text-xs text-gray-600">Goal: {user.mainGoal}</p>
                      <p className="text-xs text-gray-500">Active {user.lastActivity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-600">
                      {user.completedGoals}/{user.totalGoals}
                    </div>
                    <div className="text-xs text-gray-500">goals done</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 