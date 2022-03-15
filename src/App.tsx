import './App.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { rrfProps, store } from './redux/store';
import { Provider } from 'react-redux';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { ConfigProvider } from 'antd';
import LanguageProvider from './components/LanguageProvider';
import enUs from 'antd/lib/locale/en_US';
import { BoardPage } from './pages/BoardPage';
import { TopicPage } from './pages/TopicPage';
import { ProjectPage } from './pages/ProjectPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';

import {
  URL_BOARD,
  URL_BOARDS,
  URL_CREATE_BOARD,
  URL_LANDING,
  URL_LOGIN,
  URL_SIGNUP,
} from './urls';
import BoardSelectPage from './pages/BoardSelectPage';
import CreateBoardPage from './pages/CreateBoardPage';
import LandingPage from './pages/LandingPage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <ConfigProvider locale={enUs}>
      <Provider store={store}>
        <LanguageProvider>
          <ReactReduxFirebaseProvider {...rrfProps}>
            <BrowserRouter>
              <Routes>
                <Route path={URL_LANDING} element={<LandingPage />} />
                <Route path={URL_LOGIN} element={<LoginPage />} />
                <Route path={URL_SIGNUP} element={<SignupPage />} />
                <Route
                  path={URL_BOARDS}
                  element={
                    <PrivateRoute>
                      <BoardSelectPage />
                    </PrivateRoute>
                  }
                />

                <Route
                  path={URL_CREATE_BOARD}
                  element={
                    <PrivateRoute>
                      <CreateBoardPage />
                    </PrivateRoute>
                  }
                />

                <Route
                  path={URL_BOARD}
                  element={
                    <PrivateRoute>
                      <BoardPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path={'/boards/:boardId/topics/:topicId'}
                  element={
                    <PrivateRoute>
                      <TopicPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path={'/boards/:boardId/topics/:topicId/versions/:versionId'}
                  element={
                    <PrivateRoute>
                      <TopicPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path={'/boards/:boardId/topics/:topicId/versions/:versionId/projects/:projectId'}
                  element={
                    <PrivateRoute>
                      <ProjectPage />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </BrowserRouter>
          </ReactReduxFirebaseProvider>
        </LanguageProvider>
      </Provider>
    </ConfigProvider>
  );
}

export default App;
