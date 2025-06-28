import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export interface ListItem {
  budget: number;
  grocer_list: string[];
  total_spending: number;
}

export interface User {
  user_id: string;
  user_name: string;
  user_points: number;
  user_lists: ListItem[];       // Now an array of objects
  user_goals: string[];
}

export interface Item {
  item_id: number;
  item_name: string;
  item_price: number;
}

export async function getUserById(userId: string): Promise<{ data: User | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('user_data')
    .select('*')
    .eq('user_id', userId)
    .single();   // returns a single object instead of an array

  return { data, error };
}


export async function getItems(): Promise<{ data: Item[] | null; error: Error | null }>  {
  const { data, error } = await supabase
    .from('item_table')
    .select('*');   // returns all items

  return { data, error };
}

// --- Grocery Plan History Types ---
export interface GroceryPlan {
  id: string;
  user_id: string;
  prompt: string;
  groceries: any[];
  budget: number;
  goals?: any[];
  created_at: string;
}

// Save a grocery plan to Supabase
export async function saveGroceryPlan({ userId, prompt, groceries, budget, goals }: {
  userId: string;
  prompt: string;
  groceries: any[];
  budget: number;
  goals?: any[];
}): Promise<{ data: GroceryPlan | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('grocery_history')
    .insert([
      {
        user_id: userId,
        prompt,
        groceries,
        budget,
        goals,
      },
    ])
    .select()
    .single();
  return { data, error };
}

// Fetch all grocery plans for a user (most recent first)
export async function getGroceryHistory(userId: string): Promise<{ data: GroceryPlan[] | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('grocery_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
}

// Fetch a single grocery plan by id
export async function getGroceryPlanById(id: string): Promise<{ data: GroceryPlan | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('grocery_history')
    .select('*')
    .eq('id', id)
    .single();
  return { data, error };
}