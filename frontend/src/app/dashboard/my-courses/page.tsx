'use client';

import { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  BarChart3, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  GraduationCap,
  User,
  Eye
} from 'lucide-react';
import { Course, Grade, Attendance } from '@/types';

// Mock data for enrolled courses
const mockEnrolledCourses: Course[] = [
  {
    id: 'course1',
    name: 'Introduction to Programming',
    code: 'CS101',
    description: 'Basic programming concepts using Python',
    tutorId: '1',
    tutorName: 'Dr. Elena Martinez',
    participantIds: ['1'],
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
    participantIds: ['1'],
    schedule: [
      { day: 'Tuesday', startTime: '14:00', endTime: '16:00' },
      { day: 'Thursday', startTime: '14:00', endTime: '16:00' },
    ],
    startDate: '2024-02-01',
    endDate: '2024-05-30',
    maxParticipants: 20,
    isActive: true,
  },
];

// Mock grades for the current participant
const mockMyGrades: Grade[] = [
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
    participantId: '1',
    courseId: 'course1',
    assignment: 'Quiz 1: Control Structures',
    score: 78,
    maxScore: 100,
    percentage: 78,
    letterGrade: 'C+',
    date: '2024-02-22',
    comments: 'Need to review loop concepts',
  },
  {
    id: 'grade3',
    participantId: '1',
    courseId: 'course2',
    assignment: 'Midterm Exam: Algorithms',
    score: 92,
    maxScore: 100,
    percentage: 92,
    letterGrade: 'A-',
    date: '2024-03-01',
    comments: 'Excellent understanding of algorithmic concepts',
  },
];

// Mock attendance for the current participant
const mockMyAttendance: Attendance[] = [
  {
    id: 'att1',
    participantId: '1',
    courseId: 'course1',
    date: '2024-02-15',
    status: 'present',
    notes: '',
  },
  {
    id: 'att2',
    participantId: '1',
    courseId: 'course1',
    date: '2024-02-17',
    status: 'late',
    notes: 'Arrived 5 minutes late',
  },
  {
    id: 'att3',
    participantId: '1',
    courseId: 'course2',
    date: '2024-02-16',
    status: 'present',
    notes: '',
  },
  {
    id: 'att4',
    participantId: '1',
    courseId: 'course2',
    date: '2024-02-18',
    status: 'absent',
    notes: 'Sick leave',
  },
];

export default function MyCoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [dialogType, setDialogType] = useState<'grades' | 'attendance' | null>(null);

  const getCourseGrades = (courseId: string) => {
    return mockMyGrades.filter(grade => grade.courseId === courseId);
  };

  const getCourseAttendance = (courseId: string) => {
    return mockMyAttendance.filter(att => att.courseId === courseId);
  };

  const calculateCourseAverage = (courseId: string) => {
    const grades = getCourseGrades(courseId);
    if (grades.length === 0) return 0;
    const total = grades.reduce((sum, grade) => sum + grade.percentage, 0);
    return Math.round(total / grades.length);
  };

  const getAttendanceRate = (courseId: string) => {
    const attendance = getCourseAttendance(courseId);
    if (attendance.length === 0) return 0;
    const presentCount = attendance.filter(att => att.status === 'present' || att.status === 'late').length;
    return Math.round((presentCount / attendance.length) * 100);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'absent':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'late':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'excused':
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

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

  const openDialog = (course: Course, type: 'grades' | 'attendance') => {
    setSelectedCourse(course);
    setDialogType(type);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
        <p className="text-gray-600 mt-1">
          View your enrolled courses, grades, and attendance records.
        </p>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockEnrolledCourses.map((course) => {
          const courseGrades = getCourseGrades(course.id);
          const courseAverage = calculateCourseAverage(course.id);
          const attendanceRate = getAttendanceRate(course.id);

          return (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{course.name}</CardTitle>
                      <CardDescription>{course.code}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{course.description}</p>

                {/* Tutor Info */}
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Instructor: {course.tutorName}</span>
                </div>

                {/* Schedule */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Schedule:</span>
                  </div>
                  {course.schedule.map((schedule, index) => (
                    <div key={index} className="ml-6 text-sm text-gray-600">
                      {schedule.day}: {schedule.startTime} - {schedule.endTime}
                    </div>
                  ))}
                </div>

                {/* Course Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <BarChart3 className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Grade Average</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{courseAverage}%</div>
                    <div className="text-xs text-gray-500">{courseGrades.length} assignments</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Attendance</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">{attendanceRate}%</div>
                    <div className="text-xs text-gray-500">{getCourseAttendance(course.id).length} sessions</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDialog(course, 'grades')}
                    className="flex-1"
                  >
                    <GraduationCap className="mr-2 h-4 w-4" />
                    View Grades
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDialog(course, 'attendance')}
                    className="flex-1"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Attendance
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Grades Dialog */}
      <Dialog open={dialogType === 'grades'} onOpenChange={() => setDialogType(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Grades - {selectedCourse?.name}</DialogTitle>
            <DialogDescription>
              Your grades and feedback for {selectedCourse?.code}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assignment/Exam</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>Letter Grade</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedCourse && getCourseGrades(selectedCourse.id).map((grade) => (
                  <TableRow key={grade.id}>
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
                    <TableCell>{grade.percentage}%</TableCell>
                    <TableCell>
                      <Badge className={getGradeColor(grade.letterGrade)}>
                        {grade.letterGrade}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(grade.date).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Attendance Dialog */}
      <Dialog open={dialogType === 'attendance'} onOpenChange={() => setDialogType(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Attendance - {selectedCourse?.name}</DialogTitle>
            <DialogDescription>
              Your attendance records for {selectedCourse?.code}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedCourse && getCourseAttendance(selectedCourse.id).map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {new Date(record.date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(record.status)}
                        <span className="capitalize">{record.status}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {record.notes && (
                        <span className="text-sm text-gray-600">{record.notes}</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
