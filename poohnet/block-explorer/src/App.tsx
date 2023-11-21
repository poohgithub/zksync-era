import React from 'react';
import { useAppApolloClient } from './graphql/ApolloClient';
import { ApolloProvider } from '@apollo/client';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import TodoPage from './pages/TodoPage';
import SignIn from './pages/account/SignIn';
import SignUp from './pages/account/SignUp';

function App() {
  const client = useAppApolloClient();
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="signin" element={<SignIn />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="/" element={<Layout />}>
            <Route path="" element={<Home />} />
            <Route path="todo" element={<TodoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
