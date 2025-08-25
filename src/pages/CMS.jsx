import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import CMSDashboard from './CMSDashboard';
import CMSArticles from './CMSArticles';
import CMSArticleForm from './CMSArticleForm';
import CMSCategories from './CMSCategories';
import CMSTags from './CMSTags';
import CMSSettings from './CMSSettings';

const CMS = () => {
  return (
    <ProtectedRoute>
      <Routes>
        <Route path="/" element={<CMSDashboard />} />
        <Route path="/articles" element={<CMSArticles />} />
        <Route path="/articles/new" element={<CMSArticleForm />} />
        <Route path="/articles/edit/:id" element={<CMSArticleForm />} />
        <Route path="/categories" element={<CMSCategories />} />
        <Route path="/tags" element={<CMSTags />} />
        <Route path="/settings" element={<CMSSettings />} />
      </Routes>
    </ProtectedRoute>
  );
};

export default CMS;
