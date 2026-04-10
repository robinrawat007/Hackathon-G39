"use client"

import * as React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

import type { AnalyticsData } from "@/types/analytics"

const PIE_COLORS = ["#A855F7", "#F59E0B", "#EC4899", "#22C55E", "#60A5FA", "#F97316", "#8B5CF6", "#34D399"]

export default function Charts({ data }: { data: AnalyticsData | null }) {
  if (!data) {
    return <div className="rounded-md border border-border bg-surface p-6 shadow-card">Loading charts…</div>
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-md border border-border bg-surface p-6 shadow-card lg:col-span-2">
        <div className="font-heading text-h3 text-heading">Reading Activity</div>
        <div className="mt-4 h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.monthlyActivity}>
              <XAxis dataKey="month" stroke="#7C6FA0" />
              <YAxis stroke="#7C6FA0" allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#A855F7" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-md border border-border bg-surface p-6 shadow-card">
        <div className="font-heading text-h3 text-heading">Genre Breakdown</div>
        <div className="mt-4 h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data.genreBreakdown} dataKey="count" nameKey="genre" innerRadius={70} outerRadius={110}>
                {data.genreBreakdown.map((_, idx) => (
                  <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-md border border-border bg-surface p-6 shadow-card">
        <div className="font-heading text-h3 text-heading">Rating Distribution</div>
        <div className="mt-4 h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[...data.ratingDistribution].reverse()} layout="vertical">
              <XAxis type="number" stroke="#7C6FA0" allowDecimals={false} />
              <YAxis type="category" dataKey="stars" stroke="#7C6FA0" tickFormatter={(v) => `${v}★`} />
              <Tooltip />
              <Bar dataKey="count" fill="#F59E0B" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

