"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trophy } from "lucide-react"
import type { PersonalRecord } from "@/hooks/useWorkoutStats"

interface PersonalRecordsTableProps {
  personalRecords: PersonalRecord[]
  isLoading: boolean
}

export function PersonalRecordsTable({ personalRecords, isLoading }: PersonalRecordsTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Personal Records</CardTitle>
          <CardDescription>Your best lifts for each exercise</CardDescription>
        </CardHeader>
        <CardContent className="flex h-80 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
        </CardContent>
      </Card>
    )
  }

  if (personalRecords.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Personal Records</CardTitle>
          <CardDescription>Your best lifts for each exercise</CardDescription>
        </CardHeader>
        <CardContent className="flex h-80 items-center justify-center">
          <p className="text-center text-muted-foreground">No workout data available to display personal records.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Personal Records
        </CardTitle>
        <CardDescription>Your best lifts for each exercise</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-h-80 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exercise</TableHead>
                <TableHead className="text-right">Weight</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {personalRecords.map((record) => (
                <TableRow key={record.exercise}>
                  <TableCell className="font-medium">{record.exercise}</TableCell>
                  <TableCell className="text-right">{record.weight} lbs</TableCell>
                  <TableCell className="text-right">{record.formattedDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
