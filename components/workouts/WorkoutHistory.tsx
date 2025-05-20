'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWorkouts } from '@/hooks/useWorkouts';
import { useAuth } from '@/hooks/useAuth';
import type { Workout } from '@/lib/supabase/types';
import { formatDate } from '@/lib/utils/date-utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, MoreVertical, Trash } from 'lucide-react';
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
} from '@/components/ui/alert-dialog';

export function WorkoutHistory() {
  const { user } = useAuth();
  const { getWorkouts, deleteWorkout } = useWorkouts();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      if (user) {
        const data = await getWorkouts(user.id);
        setWorkouts(data);
        setIsLoading(false);
      }
    };

    fetchWorkouts();
  }, [user, getWorkouts]);

  const handleDelete = async (id: string) => {
    const success = await deleteWorkout(id);
    if (success) {
      setWorkouts((prev) => prev.filter((workout) => workout.id !== id));
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Workout History</CardTitle>
          <CardDescription>
            You haven&apos;t logged any workouts yet.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Button asChild>
            <Link href="/workouts/new">Log Your First Workout</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={'pt-6'}>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Exercise</TableHead>
              <TableHead className="text-center">Sets</TableHead>
              <TableHead className="text-center">Reps</TableHead>
              <TableHead className="text-center">Weight</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workouts.map((workout) => (
              <TableRow key={workout.id}>
                <TableCell>{formatDate(workout.date)}</TableCell>
                <TableCell className="font-medium">
                  {workout.exercise}
                </TableCell>
                <TableCell className="text-center">{workout.sets}</TableCell>
                <TableCell className="text-center">{workout.reps}</TableCell>
                <TableCell className="text-center">
                  {workout.weight} lbs
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/workouts/${workout.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete this workout entry.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(workout.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
