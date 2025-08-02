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
import { Plus, Search, Edit, BarChart3, FileText } from 'lucide-react';
import { Grade } from '@/types';

// Mock data
const mockGrades: Grade[] = [
  {
    id: 'grade1',
    participantId: '1',
    courseId: 'course1',
    assignment: 'Assignment 1: Variables and Data Types',
    score: 85,
    maxScore: 100,
    percentage: 85,
    letterGrade: 'B',
    date: '2024-02-15',
    comments: 'Good understanding of basic concepts',
  },
  {
    id: 'grade2',
    participantId: '2',
    courseId: 'course1',
    assignment: 'Assignment 1: Variables and Data Types',
    score: 92,
    maxScore: 100,
    percentage: 92,
    letterGrade: 'A-',
    date: '2024-02-15',
    comments: 'Excellent work with clear code structure',
  },
  {
    id: 'grade3',
    participantId: '1',
    courseId: 'course2',
    assignment: 'Midterm Exam: Algorithms',
    score: 78,
    maxScore: 100,
    percentage: 78,
    letterGrade: 'C+',
    date: '2024-03-01',
    comments: 'Need to review sorting algorithms',
  },
  {
    id: 'grade4',
    participantId: '3',
    courseId: 'course3',
    assignment: 'Quiz 1: Limits and Derivatives',
    score: 95,
    maxScore: 100,
    percentage: 95,
    letterGrade: 'A',
    date: '2024-02-20',
    comments: 'Outstanding performance',
  },
];

// Mock participants for display
const mockParticipants = {
  '1': 'Alice Johnson',
  '2': 'Bob Smith',
  '3': 'Carol White',
};

// Mock courses for display
const mockCourses = {
  'course1': 'Introduction to Programming (CS101)',
  'course2': 'Data Structures and Algorithms (CS201)',
  'course3': 'Calculus I (MATH101)',
};

export default function GradesPage() {
  const [grades, setGrades] = useState<Grade[]>(mockGrades);
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredGrades = grades.filter(grade => {
    const participantName = mockParticipants[grade.participantId as keyof typeof mockParticipants] || '';
    const courseName = mockCourses[grade.courseId as keyof typeof mockCourses] || '';
    
    const matchesSearch = participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grade.assignment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         courseName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCourse = courseFilter === 'all' || grade.courseId === courseFilter;
    
    return matchesSearch && matchesCourse;
  });

  const getGradeColor = (letterGrade: string) => {
    switch (letterGrade[0]) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-blue-100 text-blue-800';
      case 'C': return 'bg-yellow-100 text-yellow-800';
      case 'D': return 'bg-orange-100 text-orange-800';
      case 'F': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Grades</h1>
          <p className="text-gray-600 mt-1">
            Record and manage student grades for assignments and exams.
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Grade
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Grade</DialogTitle>
              <DialogDescription>
                Record a new grade for a student assignment or exam.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Course</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="course1">Introduction to Programming (CS101)</SelectItem>
                    <SelectItem value="course2">Data Structures and Algorithms (CS201)</SelectItem>
                    <SelectItem value="course3">Calculus I (MATH101)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Student</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Alice Johnson</SelectItem>
                    <SelectItem value="2">Bob Smith</SelectItem>
                    <SelectItem value="3">Carol White</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Assignment/Exam</label>
                <Input placeholder="Enter assignment or exam name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Score</label>
                  <Input type="number" placeholder="Enter score" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Max Score</label>
                  <Input type="number" placeholder="Enter max score" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Comments (Optional)</label>
                <Input placeholder="Enter comments" />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Save Grade
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
            Filter grades by student name, assignment, or course.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by student or assignment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-64">
              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  <SelectItem value="course1">Introduction to Programming</SelectItem>
                  <SelectItem value="course2">Data Structures and Algorithms</SelectItem>
                  <SelectItem value="course3">Calculus I</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grades Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Grades ({filteredGrades.length})</CardTitle>
              <CardDescription>
                All recorded grades for your courses.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Assignment/Exam</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>Letter Grade</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGrades.map((grade) => (
                  <TableRow key={grade.id}>
                    <TableCell className="font-medium">
                      {mockParticipants[grade.participantId as keyof typeof mockParticipants]}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {mockCourses[grade.courseId as keyof typeof mockCourses]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{grade.assignment}</div>
                        {grade.comments && (
                          <div className="text-sm text-gray-500 mt-1">{grade.comments}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{grade.score}</span>
                      <span className="text-gray-500">/{grade.maxScore}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-gray-400" />
                        <span>{grade.percentage}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getGradeColor(grade.letterGrade)}>
                        {grade.letterGrade}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(grade.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4" />
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
