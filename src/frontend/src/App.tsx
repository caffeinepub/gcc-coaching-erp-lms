import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useCurrentUser } from './hooks/useCurrentUser';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { I18nProvider } from './i18n/I18nProvider';
import LoginButton from './components/auth/LoginButton';
import ProfileSetupDialog from './components/auth/ProfileSetupDialog';
import AppLayout from './components/layout/AppLayout';
import { LoadingState } from './components/common/States';

// Admin Pages
import AdminDashboardPage from './pages/admin/DashboardPage';
import StudentsPage from './pages/admin/StudentsPage';
import ClassesCoursesPage from './pages/admin/ClassesCoursesPage';
import RecordedLessonsPage from './pages/admin/RecordedLessonsPage';
import FeesPage from './pages/admin/FeesPage';
import TestSeriesPage from './pages/admin/TestSeriesPage';
import ResultsPage from './pages/admin/ResultsPage';
import DemoDataPage from './pages/admin/DemoDataPage';
import AdminProgressPage from './pages/admin/ProgressPage';
import AttendanceAdminPage from './pages/admin/AttendancePage';
import MaterialsAdminPage from './pages/admin/MaterialsPage';
import HomeworkAdminPage from './pages/admin/HomeworkPage';
import TimetableAdminPage from './pages/admin/TimetablePage';
import LiveClassesAdminPage from './pages/admin/LiveClassesPage';
import NotificationsAdminPage from './pages/admin/NotificationsAdminPage';
import AdmissionsPage from './pages/admin/AdmissionsPage';
import ExpensesPage from './pages/admin/ExpensesPage';
import StaffManagementPage from './pages/admin/StaffManagementPage';
import SalaryLogsPage from './pages/admin/SalaryLogsPage';
import LeaveRequestsAdminPage from './pages/admin/LeaveRequestsAdminPage';
import StudentIdCardsPage from './pages/admin/StudentIdCardsPage';
import CertificatesAdminPage from './pages/admin/CertificatesAdminPage';
import AuditLogPage from './pages/admin/AuditLogPage';

// Student Pages
import StudentPortalHomePage from './pages/student/PortalHomePage';
import MyLessonsPage from './pages/student/MyLessonsPage';
import MyFeesPage from './pages/student/MyFeesPage';
import MyTestsPage from './pages/student/MyTestsPage';
import MyResultsPage from './pages/student/MyResultsPage';
import MyProgressPage from './pages/student/MyProgressPage';
import MyAttendancePage from './pages/student/MyAttendancePage';
import MyMaterialsPage from './pages/student/MyMaterialsPage';
import MyHomeworkPage from './pages/student/MyHomeworkPage';
import MyTimetablePage from './pages/student/MyTimetablePage';
import MyLiveClassesPage from './pages/student/MyLiveClassesPage';
import MyNotificationsPage from './pages/student/MyNotificationsPage';
import MyIdCardPage from './pages/student/MyIdCardPage';
import MyCertificatesPage from './pages/student/MyCertificatesPage';

// Teacher Pages
import TeacherDashboardPage from './pages/teacher/DashboardPage';
import AttendanceTeacherPage from './pages/teacher/AttendancePage';
import MaterialsTeacherPage from './pages/teacher/MaterialsPage';
import HomeworkTeacherPage from './pages/teacher/HomeworkPage';
import TestsTeacherPage from './pages/teacher/TestsPage';
import TimetableTeacherPage from './pages/teacher/TimetablePage';
import LiveClassesTeacherPage from './pages/teacher/LiveClassesPage';
import NotificationsTeacherPage from './pages/teacher/NotificationsPage';
import MySalaryPage from './pages/teacher/MySalaryPage';
import MyLeaveRequestsPage from './pages/teacher/MyLeaveRequestsPage';

function RootLayout() {
  const { identity, isInitializing } = useInternetIdentity();
  const { userProfile, isLoading: profileLoading, isFetched, isAdmin, isStudent, isTeacher } = useCurrentUser();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  // Show loading during initialization
  if (isInitializing || (isAuthenticated && profileLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingState message="Loading..." />
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: 'url(/assets/generated/splash-bg.dim_1080x1920.png)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background/80 to-accent/20 backdrop-blur-sm" />
        <div className="relative text-center space-y-8 px-4 z-10">
          <div className="space-y-4">
            <img 
              src="/assets/generated/app-logo.dim_512x512.png" 
              alt="GCC Logo" 
              className="w-32 h-32 mx-auto drop-shadow-2xl"
            />
            <h1 className="text-5xl font-bold text-foreground">GCC</h1>
            <p className="text-xl text-muted-foreground max-w-md font-medium">
              Excellence in Education from Class 6th to 12th
            </p>
            <p className="text-sm text-muted-foreground">
              Complete ERP & Learning Management System
            </p>
          </div>
          <LoginButton />
        </div>
      </div>
    );
  }

  // Show profile setup if needed
  if (showProfileSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <ProfileSetupDialog open={true} />
      </div>
    );
  }

  // Redirect to appropriate portal based on role
  if (isFetched && userProfile) {
    if (isAdmin && window.location.hash === '#/') {
      navigate({ to: '/admin' });
    } else if (isTeacher && window.location.hash === '#/') {
      navigate({ to: '/teacher' });
    } else if (isStudent && window.location.hash === '#/') {
      navigate({ to: '/student' });
    }
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

// Define routes
const rootRoute = createRootRoute({
  component: RootLayout,
});

// Admin routes
const adminRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin', component: AdminDashboardPage });
const studentsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/students', component: StudentsPage });
const classesRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/classes', component: ClassesCoursesPage });
const lessonsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/lessons', component: RecordedLessonsPage });
const adminProgressRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/progress', component: AdminProgressPage });
const feesRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/fees', component: FeesPage });
const testsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/tests', component: TestSeriesPage });
const resultsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/results', component: ResultsPage });
const demoDataRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/demo', component: DemoDataPage });
const attendanceAdminRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/attendance', component: AttendanceAdminPage });
const materialsAdminRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/materials', component: MaterialsAdminPage });
const homeworkAdminRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/homework', component: HomeworkAdminPage });
const timetableAdminRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/timetable', component: TimetableAdminPage });
const liveClassesAdminRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/live-classes', component: LiveClassesAdminPage });
const notificationsAdminRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/notifications', component: NotificationsAdminPage });
const admissionsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/admissions', component: AdmissionsPage });
const expensesRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/expenses', component: ExpensesPage });
const staffManagementRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/staff', component: StaffManagementPage });
const salaryLogsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/salary-logs', component: SalaryLogsPage });
const leaveRequestsAdminRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/leave-requests', component: LeaveRequestsAdminPage });
const studentIdCardsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/id-cards', component: StudentIdCardsPage });
const certificatesAdminRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/certificates', component: CertificatesAdminPage });
const auditLogRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/audit-log', component: AuditLogPage });

// Student routes
const studentRoute = createRoute({ getParentRoute: () => rootRoute, path: '/student', component: StudentPortalHomePage });
const myLessonsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/student/lessons', component: MyLessonsPage });
const myProgressRoute = createRoute({ getParentRoute: () => rootRoute, path: '/student/progress', component: MyProgressPage });
const myFeesRoute = createRoute({ getParentRoute: () => rootRoute, path: '/student/fees', component: MyFeesPage });
const myTestsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/student/tests', component: MyTestsPage });
const myResultsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/student/results', component: MyResultsPage });
const myAttendanceRoute = createRoute({ getParentRoute: () => rootRoute, path: '/student/attendance', component: MyAttendancePage });
const myMaterialsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/student/materials', component: MyMaterialsPage });
const myHomeworkRoute = createRoute({ getParentRoute: () => rootRoute, path: '/student/homework', component: MyHomeworkPage });
const myTimetableRoute = createRoute({ getParentRoute: () => rootRoute, path: '/student/timetable', component: MyTimetablePage });
const myLiveClassesRoute = createRoute({ getParentRoute: () => rootRoute, path: '/student/live-classes', component: MyLiveClassesPage });
const myNotificationsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/student/notifications', component: MyNotificationsPage });
const myIdCardRoute = createRoute({ getParentRoute: () => rootRoute, path: '/student/id-card', component: MyIdCardPage });
const myCertificatesRoute = createRoute({ getParentRoute: () => rootRoute, path: '/student/certificates', component: MyCertificatesPage });

// Teacher routes
const teacherRoute = createRoute({ getParentRoute: () => rootRoute, path: '/teacher', component: TeacherDashboardPage });
const attendanceTeacherRoute = createRoute({ getParentRoute: () => rootRoute, path: '/teacher/attendance', component: AttendanceTeacherPage });
const materialsTeacherRoute = createRoute({ getParentRoute: () => rootRoute, path: '/teacher/materials', component: MaterialsTeacherPage });
const homeworkTeacherRoute = createRoute({ getParentRoute: () => rootRoute, path: '/teacher/homework', component: HomeworkTeacherPage });
const testsTeacherRoute = createRoute({ getParentRoute: () => rootRoute, path: '/teacher/tests', component: TestsTeacherPage });
const timetableTeacherRoute = createRoute({ getParentRoute: () => rootRoute, path: '/teacher/timetable', component: TimetableTeacherPage });
const liveClassesTeacherRoute = createRoute({ getParentRoute: () => rootRoute, path: '/teacher/live-classes', component: LiveClassesTeacherPage });
const notificationsTeacherRoute = createRoute({ getParentRoute: () => rootRoute, path: '/teacher/notifications', component: NotificationsTeacherPage });
const mySalaryRoute = createRoute({ getParentRoute: () => rootRoute, path: '/teacher/salary', component: MySalaryPage });
const myLeaveRequestsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/teacher/leave-requests', component: MyLeaveRequestsPage });

const routeTree = rootRoute.addChildren([
  adminRoute, studentsRoute, classesRoute, lessonsRoute, adminProgressRoute, feesRoute, testsRoute, resultsRoute, demoDataRoute,
  attendanceAdminRoute, materialsAdminRoute, homeworkAdminRoute, timetableAdminRoute, liveClassesAdminRoute, notificationsAdminRoute,
  admissionsRoute, expensesRoute, staffManagementRoute, salaryLogsRoute, leaveRequestsAdminRoute, studentIdCardsRoute, certificatesAdminRoute, auditLogRoute,
  studentRoute, myLessonsRoute, myProgressRoute, myFeesRoute, myTestsRoute, myResultsRoute, myAttendanceRoute, myMaterialsRoute, myHomeworkRoute,
  myTimetableRoute, myLiveClassesRoute, myNotificationsRoute, myIdCardRoute, myCertificatesRoute,
  teacherRoute, attendanceTeacherRoute, materialsTeacherRoute, homeworkTeacherRoute, testsTeacherRoute, timetableTeacherRoute,
  liveClassesTeacherRoute, notificationsTeacherRoute, mySalaryRoute, myLeaveRequestsRoute,
]);

const router = createRouter({ routeTree });

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <I18nProvider>
        <RouterProvider router={router} />
        <Toaster />
      </I18nProvider>
    </ThemeProvider>
  );
}
