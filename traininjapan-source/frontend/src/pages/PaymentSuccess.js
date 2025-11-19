import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { API } from '@/config';

const PaymentSuccess = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState('loading');
  const [bookingId, setBookingId] = useState(null);

  useEffect(() => {
    if (sessionId) {
      checkPaymentStatus();
    }
  }, [sessionId]);

  const checkPaymentStatus = async () => {
    try {
      const response = await axios.get(`${API}/payments/status/${sessionId}`, { withCredentials: true });
      if (response.data.status === 'paid') {
        setStatus('success');
        setBookingId(response.data.booking_id);
      } else {
        setStatus('pending');
      }
    } catch (error) {
      console.error('Failed to check payment status:', error);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center px-6">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <CardTitle className="text-center text-2xl" style={{ fontFamily: 'Playfair Display, serif' }}>
            {status === 'loading' && t('payment.processingPayment')}
            {status === 'success' && `✅ ${t('payment.paymentSuccessful')}`}
            {status === 'pending' && t('payment.paymentPending')}
            {status === 'error' && t('payment.paymentError')}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          {status === 'loading' && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-700"></div>
            </div>
          )}
          
          {status === 'success' && (
            <div>
              <p className="text-slate-600 mb-6">{t('payment.bookingConfirmed')}</p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate('/dashboard')} className="bg-emerald-700 hover:bg-emerald-800">{t('payment.viewMyBookings')}</Button>
                <Button onClick={() => navigate('/programs')} variant="outline">{t('payment.browseMorePrograms')}</Button>
              </div>
            </div>
          )}
          
          {status === 'pending' && (
            <div>
              <p className="text-slate-600 mb-6">{t('payment.paymentProcessing')}</p>
              <Button onClick={() => navigate('/dashboard')}>{t('payment.goToDashboard')}</Button>
            </div>
          )}
          
          {status === 'error' && (
            <div>
              <p className="text-red-600 mb-6">{t('payment.paymentErrorMsg')}</p>
              <Button onClick={() => navigate('/programs')}>{t('payment.backToPrograms')}</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
