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
import { Plus, Search, Edit, Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Attendance } from '@/types';

// Mock data
const mockAttendance: Attendance[] = [
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
    participantId: '2',
    courseId: 'course1',
    date: '2024-02-15',
    status: 'late',
    notes: 'Arrived 10 minutes late',
  },
  {
    id: 'att3',
    participantId: '1',
    courseId: 'course2',
    date: '2024-02-16',
    status: 'absent',
    notes: 'Sick leave',
  },
  {
    id: 'att4',
    participantId: '3',
    courseId: 'course3',
    date: '2024-02-17',
    status: 'present',
    notes: '',
  },
  {
    id: 'att5',
    participantId: '2',
    courseId: 'course1',
    date: '2024-02-17',
    status: 'excused',
    notes: 'Medical appointment',
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

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<Attendance[]>(mockAttendance);
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredAttendance = attendance.filter(record => {
    const participantName = mockParticipants[record.participantId as keyof typeof mockParticipants] || '';
    const courseName = mockCourses[record.courseId as keyof typeof mockCourses] || '';
    
    const matchesSearch = participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         courseName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCourse = courseFilter === 'all' || record.courseId === courseFilter;
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    const matchesDate = !dateFilter || record.date === dateFilter;
    
    return matchesSearch && matchesCourse && matchesStatus && matchesDate;
  });

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'excused': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const updateAttendanceStatus = (id: string, newStatus: string) => {
    setAttendance(prev =>
      prev.map(record =>
        record.id === id
          ? { ...record, status: newStatus as any }
          : record
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Attendance</h1>
          <p className="text-gray-600 mt-1">
            Track and manage student attendance for your courses.
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Record Attendance
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record Attendance</DialogTitle>
              <DialogDescription>
                Record attendance for a student in your course.
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
                <label className="text-sm font-medium">Date</label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select attendance status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                    <SelectItem value="late">Late</SelectItem>
                    <SelectItem value="excused">Excused</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes (Optional)</label>
                <Input placeholder="Enter notes" />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Record Attendance
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
            Filter attendance records by student, course, status, or date.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by student or course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="late">Late</SelectItem>
                <SelectItem value="excused">Excused</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              placeholder="Filter by date"
            />
          </div>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Attendance Records ({filteredAttendance.length})</CardTitle>
              <CardDescription>
                All attendance records for your courses.
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
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendance.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      {mockParticipants[record.participantId as keyof typeof mockParticipants]}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {mockCourses[record.courseId as keyof typeof mockCourses]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {new Date(record.date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(record.status)}
                        <Badge className={getStatusColor(record.status)}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {record.notes && (
                        <span className="text-sm text-gray-600">{record.notes}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Select
                          value={record.status}
                          onValueChange={(value) => updateAttendanceStatus(record.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="present">Present</SelectItem>
                            <SelectItem value="absent">Absent</SelectItem>
                            <SelectItem value="late">Late</SelectItem>
                            <SelectItem value="excused">Excused</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
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
