import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '@/App';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { API } from '@/config';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [schools, setSchools] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [statsRes, schoolsRes, programsRes] = await Promise.all([
        axios.get(`${API}/admin/stats`, { withCredentials: true }),
        axios.get(`${API}/admin/schools`, { withCredentials: true }),
        axios.get(`${API}/admin/programs`, { withCredentials: true })
      ]);
      
      setStats(statsRes.data);
      setSchools(schoolsRes.data);
      setPrograms(programsRes.data);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveSchool = async (schoolId) => {
    try {
      await axios.patch(`${API}/schools/${schoolId}/approve`, {}, { withCredentials: true });
      toast.success('School approved successfully');
      fetchAdminData();
    } catch (error) {
      console.error('Failed to approve school:', error);
      toast.error('Failed to approve school');
    }
  };

  const handleApproveFirstCourse = async (courseId) => {
    try {
      await axios.patch(`${API}/courses/${courseId}/approve-first`, {}, { withCredentials: true });
      toast.success('First course approved! School can now create courses without approval.');
      fetchAdminData();
    } catch (error) {
      console.error('Failed to approve course:', error);
      toast.error(error.response?.data?.detail || 'Failed to approve course');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 data-testid="site-logo" onClick={() => navigate('/')} className="text-2xl font-bold text-slate-900 cursor-pointer" style={{ fontFamily: 'Playfair Display, serif' }}>Train In Japan</h1>
          <div className="flex items-center gap-6">
            <span className="text-slate-700 font-medium">{t('admin.adminPanel')}</span>
            <Button data-testid="logout-btn" onClick={handleLogout} variant="outline">{t('nav.logout')}</Button>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div data-testid="admin-dashboard" className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>{t('admin.adminDashboard')}</h1>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-600">{t('admin.totalSchools')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p data-testid="total-schools" className="text-3xl font-bold text-slate-900">{stats?.total_schools || 0}</p>
              <p className="text-xs text-slate-500 mt-1">{stats?.approved_schools || 0} {t('common.approved').toLowerCase()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-600">{t('admin.pendingSchools')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p data-testid="pending-schools" className="text-3xl font-bold text-emerald-700">{stats?.pending_schools || 0}</p>
              <p className="text-xs text-slate-500 mt-1">{t('admin.awaitingApproval')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-600">{t('admin.totalPrograms')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p data-testid="total-programs" className="text-3xl font-bold text-slate-900">{stats?.total_courses || 0}</p>
              <p className="text-xs text-slate-500 mt-1">{stats?.active_courses || 0} {t('admin.active')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-600">{t('admin.totalBookings')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p data-testid="total-bookings" className="text-3xl font-bold text-slate-900">{stats?.total_bookings || 0}</p>
              <p className="text-xs text-slate-500 mt-1">{stats?.paid_bookings || 0} {t('student.paid').toLowerCase()}</p>
            </CardContent>
          </Card>
        </div>

        {/* Revenue & Analytics */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-600">{t('admin.totalRevenue')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                ${stats?.total_revenue ? stats.total_revenue.toFixed(2) : '0.00'}
              </p>
              <p className="text-xs text-slate-500 mt-1">{t('admin.fromPaidBookings')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-600">{t('admin.totalLocations')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">{stats?.total_locations || 0}</p>
              <p className="text-xs text-slate-500 mt-1">{t('admin.trainingFacilities')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-600">{t('admin.totalInstructors')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">{stats?.total_instructors || 0}</p>
              <p className="text-xs text-slate-500 mt-1">{t('admin.registeredInstructors')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending-courses" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl">
            <TabsTrigger data-testid="pending-courses-tab" value="pending-courses">{t('admin.pendingFirstCourses')}</TabsTrigger>
            <TabsTrigger data-testid="schools-tab" value="schools">{t('admin.schools')}</TabsTrigger>
            <TabsTrigger data-testid="programs-tab" value="programs">{t('admin.allPrograms')}</TabsTrigger>
          </TabsList>

          {/* Pending First Courses Tab */}
          <TabsContent value="pending-courses" className="mt-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6" style={{ fontFamily: 'Spectral, serif' }}>{t('admin.approveFirstCourses')}</h2>
            <p className="text-slate-600 mb-6">{t('admin.firstCourseApprovalNote')}</p>

            {programs.filter(p => p.status === 'pending_first_approval').length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-slate-600">{t('admin.noCoursesApproval')}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {programs.filter(p => p.status === 'pending_first_approval').map((program, idx) => (
                  <Card key={program.id} className="overflow-hidden">
                    <div className="flex">
                      <img src={program.image_url} alt={program.title} className="w-48 h-48 object-cover" />
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-1" style={{ fontFamily: 'Spectral, serif' }}>{program.title}</h3>
                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">{program.category}</span>
                          </div>
                          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
                            {t('admin.firstCourseNeedsApproval')}
                          </span>
                        </div>
                        <p className="text-slate-600 mb-4">{program.description}</p>
                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                          <p className="text-slate-600"><strong>{t('programDetail.price')}:</strong> {program.currency} ${program.price}</p>
                          <p className="text-slate-600"><strong>{t('programDetail.duration')}:</strong> {program.duration}</p>
                          <p className="text-slate-600"><strong>{t('program.capacity')}:</strong> {program.capacity} {t('program.students')}</p>
                          <p className="text-slate-600"><strong>{t('program.level')}:</strong> {program.experience_level}</p>
                        </div>
                        <Button
                          onClick={() => handleApproveFirstCourse(program.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          ✅ {t('admin.approveFirstCourse')}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Schools Tab */}
          <TabsContent value="schools" className="mt-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6" style={{ fontFamily: 'Spectral, serif' }}>{t('admin.manageSchools')}</h2>

            {schools.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p data-testid="no-schools-msg" className="text-slate-600">{t('admin.noSchoolsRegistered')}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {schools.map((school, idx) => (
                  <Card key={school.id} data-testid={`school-card-${idx}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl" style={{ fontFamily: 'Spectral, serif' }}>{school.name}</CardTitle>
                          <p className="text-slate-600 mt-1">{school.location}</p>
                        </div>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          school.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>{school.approved ? t('common.approved') : t('common.pending')}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 mb-4">{school.description}</p>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-slate-600"><strong>{t('contact.email')}:</strong> {school.contact_email}</p>
                          {school.contact_phone && <p className="text-slate-600"><strong>{t('contact.phone')}:</strong> {school.contact_phone}</p>}
                        </div>
                        <div>
                          {school.website && <p className="text-slate-600"><strong>{t('programDetail.website')}:</strong> <a href={school.website} target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:underline">{school.website}</a></p>}
                        </div>
                      </div>
                      {!school.approved && (
                        <div className="mt-4">
                          <Button 
                            data-testid={`approve-school-${idx}`}
                            onClick={() => handleApproveSchool(school.id)} 
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {t('admin.approveSchool')}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Programs Tab */}
          <TabsContent value="programs" className="mt-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6" style={{ fontFamily: 'Spectral, serif' }}>{t('admin.allPrograms')}</h2>

            {programs.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p data-testid="no-programs-msg" className="text-slate-600">{t('admin.noProgramsCreated')}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {programs.map((program, idx) => (
                  <Card key={program.id} data-testid={`program-card-${idx}`} className="overflow-hidden">
                    <img src={program.image_url} alt={program.title} className="w-full h-40 object-cover" />
                    <CardHeader>
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full w-fit mb-2">{program.category}</span>
                      <CardTitle className="text-lg" style={{ fontFamily: 'Spectral, serif' }}>{program.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 mb-2"><strong>{t('programDetail.price')}:</strong> {program.currency} ${program.price}</p>
                      <p className="text-sm text-slate-600"><strong>{t('programDetail.duration')}:</strong> {program.duration}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
