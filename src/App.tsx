import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { AssistantPage } from './pages/AssistantPage';
import { PlatformsPage } from './pages/PlatformsPage';
import { PlatformDetailsPage } from './pages/PlatformDetailsPage';
import { InterviewsPage } from './pages/InterviewsPage';
import { ConfigureInterviewPage } from './pages/ConfigureInterviewPage';
import { InterviewSessionPage } from './pages/InterviewSessionPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<AssistantPage />} />
          <Route path="/platforms" element={<PlatformsPage />} />
          <Route path="/platforms/:platformId" element={<PlatformDetailsPage />} />
          <Route path="/interviews" element={<InterviewsPage />} />
          <Route path="/interviews/:interviewId/configure" element={<ConfigureInterviewPage />} />
          <Route path="/session/active" element={<InterviewSessionPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
