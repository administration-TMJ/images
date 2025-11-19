import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '@/App';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from 'react-i18next';
import { API } from '@/config';

const BrowsePrograms = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    fetchPrograms();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedCategory, selectedLevel, searchQuery, maxPrice, programs]);

  const applyFilters = () => {
    let filtered = programs;

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Experience level filter
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(p => p.experience_level === selectedLevel);
    }

    // Search query (title, description, martial_arts_style)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.martial_arts_style.toLowerCase().includes(query)
      );
    }

    // Max price filter
    if (maxPrice) {
      filtered = filtered.filter(p => p.price <= parseFloat(maxPrice));
    }

    setFilteredPrograms(filtered);
  };

  const fetchPrograms = async () => {
    try {
      const response = await axios.get(`${API}/programs`);
      // Randomize the program order for better discovery
      const randomizedPrograms = [...response.data].sort(() => Math.random() - 0.5);
      setPrograms(randomizedPrograms);
      setFilteredPrograms(randomizedPrograms);
    } catch (error) {
      console.error('Failed to fetch programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'Martial Arts', 'Cultural Arts', 'Sword Arts', 'Archery', 'Meditation'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 data-testid="site-logo" onClick={() => navigate('/')} className="text-2xl font-bold text-slate-900 cursor-pointer" style={{ fontFamily: 'Playfair Display, serif' }}>Train In Japan</h1>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/')} className="text-slate-700 hover:text-emerald-800 font-medium transition-colors">{t('nav.home')}</button>
            {user && (
              <Button data-testid="nav-dashboard-btn" onClick={() => navigate('/dashboard')} variant="default" className="bg-emerald-700 hover:bg-emerald-800">{t('nav.dashboard')}</Button>
            )}
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-16 px-6 bg-gradient-to-r from-emerald-700 to-emerald-800">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>{t('browse.title')}</h1>
          <p className="text-emerald-100 text-lg">{t('browse.subtitle')}</p>
        </div>
      </section>

      {/* Filters */}
      <section data-testid="programs-section" className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <Card className="p-6 mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">{t('browse.filterPrograms')}</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t('browse.search')}</label>
                <input
                  data-testid="search-input"
                  type="text"
                  placeholder={t('browse.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t('browse.category')}</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger data-testid="category-filter" className="w-full">
                    <SelectValue placeholder={t('browse.selectCategory')} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat === 'all' ? t('browse.allCategories') : cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t('browse.experienceLevel')}</label>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger data-testid="level-filter" className="w-full">
                    <SelectValue placeholder={t('browse.selectLevel')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('browse.allLevels')}</SelectItem>
                    <SelectItem value="beginner">{t('program.beginner')}</SelectItem>
                    <SelectItem value="intermediate">{t('program.intermediate')}</SelectItem>
                    <SelectItem value="advanced">{t('program.advanced')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Max Price */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t('browse.maxPrice')}</label>
                <input
                  data-testid="price-filter"
                  type="number"
                  placeholder={t('browse.anyPrice')}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Results count */}
            <div className="mt-4 text-sm text-slate-600">
              {t('browse.showing')} {filteredPrograms.length} {t('browse.of')} {programs.length} {t('browse.programsText')}
            </div>
          </Card>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-700"></div>
            </div>
          ) : filteredPrograms.length === 0 ? (
            <div data-testid="no-programs" className="text-center py-20">
              <p className="text-slate-600 text-lg">{t('browse.noPrograms')}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPrograms.map((program, idx) => (
                <Card key={program.id} data-testid={`program-card-${idx}`} className="overflow-hidden hover:shadow-xl transition-shadow">
                  <img src={program.image_url} alt={program.title} className="w-full h-48 object-cover" />
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">{program.category}</span>
                    </div>
                    
                    {/* School Branding */}
                    {program.school && (
                      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-200">
                        {program.school.logo_url ? (
                          <img 
                            src={program.school.logo_url} 
                            alt={program.school.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-slate-200"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                            <span className="text-slate-600 font-semibold text-sm">
                              {program.school.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-700 truncate">{program.school.name}</p>
                          <p className="text-xs text-slate-500">{t('browse.trainingSchool')}</p>
                        </div>
                      </div>
                    )}
                    
                    <CardTitle className="text-xl" style={{ fontFamily: 'Spectral, serif' }}>{program.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{program.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p className="text-slate-600"><strong>{t('programDetail.duration')}:</strong> {program.duration}</p>
                      <p className="text-slate-600"><strong>{t('programDetail.price')}:</strong> {program.currency} ${program.price}</p>
                      {program.start_date && <p className="text-slate-600"><strong>{t('browse.starts')}:</strong> {program.start_date}</p>}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      data-testid={`view-program-${idx}`}
                      onClick={() => navigate(`/programs/${program.id}`)} 
                      className="w-full bg-emerald-700 hover:bg-emerald-800"
                    >
                      {t('browse.viewDetails')}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BrowsePrograms;
