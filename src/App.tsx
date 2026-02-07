import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { App as CapApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import BottomNav from './components/BottomNav';
import ScrollToTop from './components/ScrollToTop';
import SplashScreen from './components/SplashScreen';
import CommandPalette from './components/CommandPalette';
import { ToastProvider } from './context/ToastContext';
import Calculator from './pages/tools/Calculator';
import ScientificCalculator from './pages/tools/ScientificCalculator';
import PercentageCalculator from './pages/tools/PercentageCalculator';
import UnitConverter from './pages/tools/UnitConverter';
import CustomFormulas from './pages/tools/CustomFormulas';
import GpaCalculator from './pages/tools/GpaCalculator';
import AgeCalculator from './pages/tools/AgeCalculator';
import BmiCalculator from './pages/tools/BmiCalculator';
import DateCalculator from './pages/tools/DateCalculator';
import WordCounter from './pages/tools/WordCounter';
import GradeCalculator from './pages/tools/GradeCalculator';
import TipCalculator from './pages/tools/TipCalculator';
import StopwatchTimer from './pages/tools/StopwatchTimer';
import RandomGenerator from './pages/tools/RandomGenerator';
import Dashboard from './pages/Dashboard';
// Study Pages
import ToolsSection from './pages/tools/ToolsSection';
import StudySection from './pages/study/StudySection';
import Notes from './pages/study/Notes';
import NoteEditor from './pages/study/NoteEditor';
import DailyQuestion from './pages/study/DailyQuestion';
import Streak from './pages/study/Streak';
import Pomodoro from './pages/study/Pomodoro';
import Flashcards from './pages/study/Flashcards';
import TaskManager from './pages/study/TaskManager';
// Exams Pages
import ExamsSection from './pages/exams/ExamsSection';
import Calendar from './pages/exams/Calendar';
// Jobs Pages
import JobsSection from './pages/jobs/JobsSection';
import JobDetail from './pages/jobs/JobDetail';
import FormTracker from './pages/jobs/FormTracker';
// Profile Pages
import ProfileSection from './pages/profile/ProfileSection';
import About from './pages/profile/About';
import PrivacyPolicy from './pages/profile/PrivacyPolicy';
import TermsOfService from './pages/profile/TermsOfService';
import Customize from './pages/profile/Customize';
import Backup from './pages/profile/Backup';
import Reminders from './pages/profile/Reminders';
import AboutDeveloper from './pages/profile/AboutDeveloper';
import Achievements from './pages/profile/Achievements';

function BackButtonHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    const backHandler = CapApp.addListener('backButton', ({ canGoBack }) => {
      const mainTabs = ['/', '/study', '/exams', '/jobs', '/profile'];
      if (mainTabs.includes(location.pathname)) CapApp.exitApp();
      else if (canGoBack) navigate(-1);
      else navigate('/');
    });
    return () => { backHandler.then(handler => handler.remove()); };
  }, [navigate, location.pathname]);

  return null;
}

function App() {
  const [showSplash, setShowSplash] = useState(() => {
    const hasShown = sessionStorage.getItem('splash_shown');
    return !hasShown;
  });

  const handleSplashFinish = () => {
    sessionStorage.setItem('splash_shown', 'true');
    setShowSplash(false);
  };

  if (showSplash) return <SplashScreen onFinish={handleSplashFinish} />;

  return (
    <ToastProvider>
      <div className="min-h-screen bg-background text-text-primary" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: '80px' }}>
        <ScrollToTop />
        <BackButtonHandler />
        <div className="bg-primary h-1 w-full fixed top-0 left-0 z-50" style={{ top: 'env(safe-area-inset-top)' }}></div>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          <Route path="/tools" element={<ToolsSection />} />

          {/* Tools */}
          <Route path="/tools/calculator" element={<Calculator />} />
          <Route path="/tools/scientific" element={<ScientificCalculator />} />
          <Route path="/tools/percentage" element={<PercentageCalculator />} />
          <Route path="/tools/formulas" element={<CustomFormulas />} />
          <Route path="/tools/converter/:type" element={<UnitConverter />} />
          <Route path="/tools/gpa" element={<GpaCalculator />} />
          <Route path="/tools/age" element={<AgeCalculator />} />
          <Route path="/tools/bmi" element={<BmiCalculator />} />
          <Route path="/tools/date" element={<DateCalculator />} />
          <Route path="/tools/words" element={<WordCounter />} />
          <Route path="/tools/grade" element={<GradeCalculator />} />
          <Route path="/tools/tip" element={<TipCalculator />} />
          <Route path="/tools/stopwatch" element={<StopwatchTimer />} />
          <Route path="/tools/random" element={<RandomGenerator />} />

          {/* Study Section */}
          <Route path="/study" element={<StudySection />} />
          <Route path="/study/notes" element={<Notes />} />
          <Route path="/study/notes/:id" element={<NoteEditor />} />
          <Route path="/study/daily-question" element={<DailyQuestion />} />
          <Route path="/study/streak" element={<Streak />} />
          <Route path="/study/pomodoro" element={<Pomodoro />} />
          <Route path="/study/flashcards" element={<Flashcards />} />
          <Route path="/study/tasks" element={<TaskManager />} />

          {/* Exams Section */}
          <Route path="/exams" element={<ExamsSection />} />
          <Route path="/exams/calendar" element={<Calendar />} />

          {/* Jobs Section */}
          <Route path="/jobs" element={<JobsSection />} />
          <Route path="/jobs/form-tracker" element={<FormTracker />} />
          <Route path="/jobs/:id" element={<JobDetail />} />

          {/* Profile Section */}
          <Route path="/profile" element={<ProfileSection />} />
          <Route path="/profile/about" element={<About />} />
          <Route path="/profile/customize" element={<Customize />} />
          <Route path="/profile/backup" element={<Backup />} />
          <Route path="/profile/reminders" element={<Reminders />} />
          <Route path="/profile/developer" element={<AboutDeveloper />} />
          <Route path="/profile/achievements" element={<Achievements />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <CommandPalette />
        <BottomNav />
      </div>
    </ToastProvider>
  );
}

export default App;
