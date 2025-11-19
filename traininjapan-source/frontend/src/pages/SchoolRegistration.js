import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '@/App';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { API } from '@/config';

const SchoolRegistration = () => {
  const { t } = useTranslation();
  const { user, checkAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    contact_email: '',
    contact_phone: '',
    website: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please sign in to register your school');
      const authUrl = process.env.REACT_APP_AUTH_URL || 'https://auth.emergentagent.com';
      const redirectUrl = `${window.location.origin}/register-school`;
      window.location.href = `${authUrl}/?redirect=${encodeURIComponent(redirectUrl)}`;
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${API}/schools`, formData, { withCredentials: true });
      toast.success('School registered successfully! You can now add locations, instructors, and courses.');
      
      // Refresh user data to get updated role
      await checkAuth();
      
      // Navigate to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('School registration failed:', error);
      const errorMsg = error.response?.data?.detail || 'Failed to register school';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = () => {
    const authUrl = process.env.REACT_APP_AUTH_URL || 'https://auth.emergentagent.com';
    const redirectUrl = `${window.location.origin}/register-school`;
    window.location.href = `${authUrl}/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 data-testid="site-logo" onClick={() => navigate('/')} className="text-2xl font-bold text-slate-900 cursor-pointer" style={{ fontFamily: 'Playfair Display, serif' }}>Train In Japan</h1>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/')} className="text-slate-700 hover:text-emerald-800 font-medium transition-colors">{t('nav.home')}</button>
            <button onClick={() => navigate('/programs')} className="text-slate-700 hover:text-emerald-800 font-medium transition-colors">{t('nav.programs')}</button>
            {user ? (
              <Button onClick={() => navigate('/dashboard')} variant="default" className="bg-emerald-700 hover:bg-emerald-800">{t('nav.dashboard')}</Button>
            ) : (
              <Button data-testid="login-btn" onClick={handleLogin} variant="default" className="bg-emerald-700 hover:bg-emerald-800">{t('nav.signIn')}</Button>
            )}
          </div>
        </div>
      </nav>

      {/* Registration Form */}
      <section data-testid="school-registration-section" className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>{t('schoolReg.registerYourSchool')}</h1>
            <p className="text-lg text-slate-600">{t('schoolReg.registerSubtitle')}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle style={{ fontFamily: 'Spectral, serif' }}>{t('schoolReg.schoolInfo')}</CardTitle>
              <CardDescription>
                {t('schoolReg.schoolInfoDesc')}
                <strong className="text-emerald-700"> {t('schoolReg.firstCourseApprovalNote')}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t('schoolReg.schoolName')} *</label>
                  <input 
                    data-testid="school-name-input"
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder={t('schoolReg.schoolNamePlaceholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t('program.description')} *</label>
                  <textarea 
                    data-testid="school-description-input"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder={t('schoolReg.descriptionPlaceholder')}
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t('programDetail.location')} *</label>
                  <input 
                    data-testid="school-location-input"
                    type="text" 
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder={t('schoolReg.locationPlaceholder')}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">{t('schoolReg.contactEmail')} *</label>
                    <input 
                      data-testid="school-email-input"
                      type="email" 
                      required
                      value={formData.contact_email}
                      onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">{t('schoolReg.contactPhone')}</label>
                    <input 
                      data-testid="school-phone-input"
                      type="tel" 
                      value={formData.contact_phone}
                      onChange={(e) => setFormData({...formData, contact_phone: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t('programDetail.website')}</label>
                  <input 
                    data-testid="school-website-input"
                    type="url" 
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder={t('schoolReg.websitePlaceholder')}
                  />
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <p className="text-sm text-emerald-950">
                    {t('schoolReg.reviewNote')}
                  </p>
                </div>

                <Button 
                  data-testid="school-submit-btn"
                  type="submit" 
                  disabled={submitting}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 py-6 text-lg"
                >
                  {submitting ? t('schoolReg.submitting') : t('schoolReg.submitRegistration')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default SchoolRegistration;
