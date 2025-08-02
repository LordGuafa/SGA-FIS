'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search, Edit, Trash2, Users, Calendar } from 'lucide-react';
import { Course } from '@/types';

// Mock data
const mockCourses: Course[] = [
  {
    id: 'course1',
    name: 'Introduction to Programming',
    code: 'CS101',
    description: 'Basic programming concepts using Python',
    tutorId: '1',
    tutorName: 'Dr. Elena Martinez',
    participantIds: ['1', '2'],
    schedule: [
      { day: 'Monday', startTime: '09:00', endTime: '11:00' },
      { day: 'Wednesday', startTime: '09:00', endTime: '11:00' },
    ],
    startDate: '2024-02-01',
    endDate: '2024-05-30',
    maxParticipants: 25,
    isActive: true,
  },
  {
    id: 'course2',
    name: 'Data Structures and Algorithms',
    code: 'CS201',
    description: 'Advanced programming concepts and algorithms',
    tutorId: '1',
    tutorName: 'Dr. Elena Martinez',
    participantIds: ['1', '3'],
    schedule: [
      { day: 'Tuesday', startTime: '14:00', endTime: '16:00' },
      { day: 'Thursday', startTime: '14:00', endTime: '16:00' },
    ],
    startDate: '2024-02-01',
    endDate: '2024-05-30',
    maxParticipants: 20,
    isActive: true,
  },
  {
    id: 'course3',
    name: 'Calculus I',
    code: 'MATH101',
    description: 'Introduction to differential calculus',
    tutorId: '2',
    tutorName: 'Dr. James Chen',
    participantIds: ['3'],
    schedule: [
      { day: 'Monday', startTime: '11:00', endTime: '12:30' },
      { day: 'Wednesday', startTime: '11:00', endTime: '12:30' },
      { day: 'Friday', startTime: '11:00', endTime: '12:30' },
    ],
    startDate: '2024-02-01',
    endDate: '2024-05-30',
    maxParticipants: 30,
    isActive: true,
  },
];

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && course.isActive) ||
                         (statusFilter === 'inactive' && !course.isActive);
    
    return matchesSearch && matchesStatus;
  });

  const toggleCourseStatus = (id: string) => {
    setCourses(prev => 
      prev.map(course =>
        course.id === id 
          ? { ...course, isActive: !course.isActive }
          : course
      )
    );
  };

  const deleteCourse = (id: string) => {
    setCourses(prev => prev.filter(course => course.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Courses</h1>
          <p className="text-gray-600 mt-1">
            Create and manage your courses, schedules, and enrollments.
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Course</DialogTitle>
              <DialogDescription>
                Create a new course in the system.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Course Name</label>
                <Input placeholder="Enter course name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Course Code</label>
                <Input placeholder="Enter course code" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input placeholder="Enter course description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <Input type="date" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Max Participants</label>
                <Input type="number" placeholder="Enter max participants" />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Create Course
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Filter courses by name, code, description, or status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="inactive">Inactive Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Courses Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Courses ({filteredCourses.length})</CardTitle>
              <CardDescription>
                List of all courses you manage.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Enrolled</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">
                      {course.code}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{course.name}</div>
                        <div className="text-sm text-gray-500">{course.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>{course.participantIds.length}/{course.maxParticipants}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {course.schedule.map((schedule, index) => (
                          <div key={index} className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span>{schedule.day} {schedule.startTime}-{schedule.endTime}</span>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{new Date(course.startDate).toLocaleDateString()}</div>
                        <div className="text-gray-500">to {new Date(course.endDate).toLocaleDateString()}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={course.isActive ? "default" : "secondary"}
                        className={course.isActive ? "bg-green-100 text-green-800" : ""}
                      >
                        {course.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteCourse(course.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
