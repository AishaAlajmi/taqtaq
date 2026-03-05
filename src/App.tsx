import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { SettingsPage } from './pages/SettingsPage';
import { TeamSetupPage } from './pages/TeamSetupPage';
import { GamePage } from './pages/GamePage';
import { QuestionBankPage } from './pages/QuestionBankPage';
import { OnlineSetupPage } from './pages/OnlineSetupPage';
import { JoinPage } from './pages/JoinPage';
import { ControllerPage } from './pages/ControllerPage';
import { BackgroundPattern } from './components/BackgroundPattern';

export default function App() {
  return (
    <BrowserRouter>
      <BackgroundPattern />
      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/setup" element={<TeamSetupPage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/bank" element={<QuestionBankPage />} />
          <Route path="/online-setup" element={<OnlineSetupPage />} />
          <Route path="/join" element={<JoinPage />} />
          <Route path="/play/:roomId" element={<ControllerPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
