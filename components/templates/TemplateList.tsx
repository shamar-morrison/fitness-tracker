"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTemplates } from "@/hooks/useTemplates"
import { useAuth } from "@/hooks/useAuth"
import type { WorkoutTemplate, TemplateExercise } from "@/lib/supabase/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit, MoreVertical, Trash, Play } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function TemplateList() {
  const { user } = useAuth()
  const { getTemplates, deleteTemplate } = useTemplates()
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTemplates = async () => {
      if (user) {
        const data = await getTemplates(user.id)
        setTemplates(data)
        setIsLoading(false)
      }
    }

    fetchTemplates()
  }, [user, getTemplates])

  const handleDelete = async (id: string) => {
    const success = await deleteTemplate(id)
    if (success) {
      setTemplates((prev) => prev.filter((template) => template.id !== id))
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    )
  }

  if (templates.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Workout Templates</CardTitle>
          <CardDescription>You haven&apos;t created any workout templates yet.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Button asChild>
            <Link href="/templates/new">Create Your First Template</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Workout Templates</CardTitle>
          <CardDescription>Create and manage your workout templates</CardDescription>
        </div>
        <Button asChild>
          <Link href="/templates/new">Create Template</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => {
            const exercises = template.exercises as TemplateExercise[]
            return (
              <Card key={template.id} className="overflow-hidden">
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <Badge variant="outline">{exercises.length} exercises</Badge>
                  </div>
                  {template.description && (
                    <CardDescription className="line-clamp-2">{template.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-1">
                    {exercises.slice(0, 3).map((exercise, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">{exercise.exercise}</span>
                        <span className="text-muted-foreground">
                          {" "}
                          - {exercise.sets} x {exercise.reps} @ {exercise.weight} lbs
                        </span>
                      </div>
                    ))}
                    {exercises.length > 3 && (
                      <div className="text-sm text-muted-foreground">+{exercises.length - 3} more exercises...</div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t p-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/workouts/new?template=${template.id}`}>
                      <Play className="mr-1 h-4 w-4" />
                      Use Template
                    </Link>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/templates/${template.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete this template.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(template.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
