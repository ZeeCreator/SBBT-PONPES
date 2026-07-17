export interface Student {
  id: string
  nis: string
  name: string
  city: string
  class: string
  grade: number
  disciplineScore: number
  status: 'Active' | 'On Leave' | 'Alumni'
  photo?: string
}

export interface Violation {
  id: string
  studentId: string
  type: 'Minor' | 'Moderate' | 'Severe'
  category: string
  description: string
  pointsDeducted: number
  reportedBy: string
  timestamp: Date
}

export interface Invoice {
  id: string
  studentId: string
  studentName: string
  month: string
  year: number
  amount: number
  serviceFee: number
  uniqueCode: number
  totalAmount: number
  status: 'pending' | 'paid' | 'overdue' | 'cancelled'
  dueDate: Date
  paidAt?: Date
  paymentMethod?: string
}

export interface Attendance {
  id: string
  studentId: string
  date: Date
  status: 'present' | 'sick' | 'permit' | 'absent'
  activity: string
  notes?: string
}

export interface Grade {
  id: string
  studentId: string
  subject: string
  score: number
  grade: string
  semester: number
  academicYear: string
}

export interface User {
  uid: string
  email: string
  role: 'super_admin' | 'bendahara' | 'kesantrian' | 'wali_santri'
  displayName: string
  photoURL?: string
}

export interface ActivityLog {
  id: string
  action: string
  description: string
  user: string
  timestamp: Date
  icon: string
  color: string
}
