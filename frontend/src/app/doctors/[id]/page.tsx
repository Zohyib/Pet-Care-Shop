'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Building2, Stethoscope, ChevronLeft, Calendar as CalendarIcon, MessageSquare, Award, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

export default function DoctorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, token } = useAuthStore();
  const docId = params.id as string;

  const { data: doctor, isLoading, refetch } = useQuery({
    queryKey: ['doctor', docId],
    queryFn: async () => {
      const res = await api.get(`/doctors/${docId}`);
      return res.data;
    }
  });

  const [isReviewing, setIsReviewing] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [selectedPet, setSelectedPet] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  const { data: bookedSlots } = useQuery({
    queryKey: ['bookedSlots', docId, bookingDate],
    queryFn: async () => {
      if (!bookingDate) return [];
      const res = await api.get(`/appointments/doctor/${docId}/slots?date=${bookingDate}`);
      return res.data;
    },
    enabled: !!bookingDate && isBookingModalOpen
  });

  const availableTimeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const getAvailableSlots = () => {
    if (!bookingDate || !bookedSlots) return availableTimeSlots;
    
    return availableTimeSlots.filter(time => {
      // Create a date object for this specific time
      const slotDateTime = new Date(`${bookingDate}T${time}:00.000Z`); // Assuming local time for simplicity or we can just compare times
      // For simplicity in this mockup, we check if the bookedSlots contains a date string that ends with this time
      // A better approach is to format the ISO string to local time.
      const isBooked = bookedSlots.some((isoStr: string) => {
        const bookedTime = new Date(isoStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        return bookedTime === time;
      });
      return !isBooked;
    });
  };

  const { data: myPets } = useQuery({
    queryKey: ['my-pets'],
    queryFn: async () => {
      const res = await api.get('/pets/my-pets');
      return res.data;
    },
    enabled: !!token && isBookingModalOpen
  });

  const handleSubmitReview = async () => {
    if (!token) return toast.error('Please login to review');
    setIsSubmittingReview(true);
    try {
      await api.post(`/doctors/${docId}/reviews`, { rating, comment });
      toast.success('Review submitted successfully!');
      setIsReviewing(false);
      setComment('');
      setRating(5);
      refetch();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleBook = () => {
    if (!token) {
      toast.error('Please login to book an appointment');
      router.push('/login');
      return;
    }
    setIsBookingModalOpen(true);
  };

  const submitBooking = async () => {
    if (!selectedPet || !bookingDate || !selectedSlot) {
      return toast.error('Please select a pet, date, and time slot.');
    }
    if (!agreeTerms) {
      return toast.error('You must agree to the terms and conditions.');
    }
    
    setIsSubmittingBooking(true);
    try {
      const fullDateTime = new Date(`${bookingDate}T${selectedSlot}:00`);
      
      await api.post('/appointments', {
        doctorId: docId,
        petId: selectedPet,
        date: fullDateTime.toISOString(),
        notes: bookingNotes
      });
      toast.success('Appointment booked successfully!');
      setIsBookingModalOpen(false);
      setBookingDate('');
      setSelectedSlot('');
      setBookingNotes('');
      setSelectedPet('');
      setAgreeTerms(false);
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to book appointment');
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const handleChat = async () => {
    if (!token) {
      toast.error('Please login to chat');
      router.push('/login');
      return;
    }
    router.push(`/chat?userId=${docId}`);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center dark:bg-slate-950"><div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!doctor) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-xl text-slate-500">Doctor not found</p></div>;
  }

  const profile = doctor.doctorProfile || {};

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      
      {/* Hero Section */}
      <div className="bg-indigo-600 dark:bg-slate-900 pt-20 pb-40 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <Button variant="ghost" onClick={() => router.back()} className="text-white hover:bg-white/20 mb-8 rounded-full">
            <ChevronLeft className="w-5 h-5 mr-1" /> Back to Search
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-32 relative z-20">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 p-6 md:p-10 flex flex-col md:flex-row gap-8 items-start">
          
          {/* Avatar Area */}
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-3xl bg-indigo-100 dark:bg-indigo-950 shadow-inner flex items-center justify-center shrink-0 border-4 border-white dark:border-slate-800 overflow-hidden -mt-16 md:-mt-20">
             {doctor.avatarUrl ? (
                <img src={doctor.avatarUrl} alt={doctor.name} className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-20 h-20 text-indigo-500" />
              )}
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
                  Dr. {doctor.name}
                </h1>
                <div className="flex gap-3">
                  <Button onClick={handleChat} variant="outline" className="rounded-xl border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/50">
                    <MessageSquare className="w-4 h-4 mr-2" /> Message
                  </Button>
                  <Button onClick={handleBook} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30">
                    <CalendarIcon className="w-4 h-4 mr-2" /> Book Visit
                  </Button>
                </div>
              </div>
              <p className="text-lg font-medium text-indigo-500 mt-2">{profile.mainSpecialization}</p>
            </div>

            <div className="flex flex-wrap items-center gap-6 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                <div>
                  <div className="font-bold text-lg text-slate-800 dark:text-white">{profile.calculatedRating?.toFixed(1) || '0.0'}</div>
                  <div className="text-xs text-slate-500">{profile.totalReviews} Reviews</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-lg text-slate-800 dark:text-white">{profile.yearsOfExperience}+</div>
                  <div className="text-xs text-slate-500">Years Exp.</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-500">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-lg text-slate-800 dark:text-white">${profile.consultationFee}</div>
                  <div className="text-xs text-slate-500">Consultation</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">About Me</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {profile.bio || "No professional biography provided."}
              </p>
            </motion.section>

            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Expertise & Services</h3>
              <div className="flex flex-wrap gap-2">
                {profile.expertise?.split(',').map((skill: string, i: number) => (
                  <span key={i} className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium">
                    {skill.trim()}
                  </span>
                ))}
                {!profile.expertise && <span className="text-slate-500">General Practice</span>}
              </div>
            </motion.section>
            
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Patient Reviews</h3>
                {user?.role === 'USER' && !isReviewing && (
                  <Button onClick={() => setIsReviewing(true)} variant="outline" size="sm" className="rounded-xl border-slate-200 dark:border-slate-700">Write Review</Button>
                )}
              </div>
              
              {isReviewing && (
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl mb-6 space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Rating</label>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(star => (
                        <Star 
                          key={star} 
                          onClick={() => setRating(star)}
                          className={`w-6 h-6 cursor-pointer ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Comment</label>
                    <textarea 
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg outline-none" 
                      rows={3}
                      placeholder="Share your experience..."
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="sm" onClick={() => setIsReviewing(false)}>Cancel</Button>
                    <Button size="sm" onClick={handleSubmitReview} disabled={isSubmittingReview}>
                      {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                {doctor.reviewsReceived?.length === 0 ? (
                  <p className="text-slate-500">No reviews yet.</p>
                ) : (
                  doctor.reviewsReceived?.map((review: any) => (
                    <div key={review.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                      <div className="flex justify-between">
                        <div className="font-medium text-slate-800 dark:text-white">{review.user?.name || 'Anonymous'}</div>
                        <div className="flex">
                          {[...Array(5)].map((_, idx) => (
                            <Star key={idx} className={`w-4 h-4 ${idx < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </motion.section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <motion.section initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Clinic Info</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{profile.clinicName}</div>
                    <div className="text-sm text-slate-500 mt-1">{profile.clinicAddress}</div>
                  </div>
                </div>
                <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">Availability</div>
                    <div className="text-sm text-slate-500 mt-1">Mon - Fri: 9:00 AM - 5:00 PM <br/>(Appointment required)</div>
                  </div>
                </div>
              </div>
            </motion.section>
            
            <motion.section initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Qualifications</h3>
              <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                {profile.education && (
                  <li><strong className="text-slate-800 dark:text-slate-200 block">Education</strong>{profile.education}</li>
                )}
                {profile.certifications && (
                  <li><strong className="text-slate-800 dark:text-slate-200 block">Certifications</strong>{profile.certifications}</li>
                )}
                {profile.languages && (
                  <li><strong className="text-slate-800 dark:text-slate-200 block">Languages spoken</strong>{profile.languages}</li>
                )}
              </ul>
            </motion.section>
          </div>
        </div>

      </div>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 border border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Book Appointment</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Pet</label>
                {myPets?.length === 0 ? (
                  <div className="p-3 text-amber-600 bg-amber-50 rounded-lg text-sm">
                    You don't have any pets registered. <a href="/dashboard" className="underline font-bold">Go add a pet first!</a>
                  </div>
                ) : (
                  <select value={selectedPet} onChange={e => setSelectedPet(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none">
                    <option value="">-- Choose a Pet --</option>
                    {myPets?.map((p: any) => (
                      <option key={p.id} value={p.id}>{p.name} {p.breed ? `(${p.breed})` : ''}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Date</label>
                  <input 
                    type="date" 
                    value={bookingDate} 
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => {
                      setBookingDate(e.target.value);
                      setSelectedSlot('');
                    }} 
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  />
                </div>
              </div>

              {bookingDate && (
                <div>
                  <label className="block text-sm font-medium mb-2">Select Time Slot</label>
                  <div className="grid grid-cols-4 gap-2">
                    {getAvailableSlots().map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedSlot(time)}
                        className={`py-2 px-1 rounded-lg text-sm font-medium transition-all ${
                          selectedSlot === time 
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30' 
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  {getAvailableSlots().length === 0 && (
                     <p className="text-red-500 text-sm mt-2">No available slots for this date.</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Notes & Symptoms</label>
                <textarea 
                  value={bookingNotes}
                  onChange={e => setBookingNotes(e.target.value)}
                  placeholder="Describe your pet's symptoms or reason for visit..."
                  className="w-full h-24 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none resize-none"
                />
              </div>

              <div className="flex items-start gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <input 
                  type="checkbox" 
                  id="terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                />
                <label htmlFor="terms" className="text-sm text-slate-600 dark:text-slate-400">
                  I agree to the <span className="font-bold text-indigo-600 dark:text-indigo-400">Terms & Conditions</span>. I understand that appointment times are approximate and subject to doctor confirmation.
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button variant="ghost" className="flex-1" onClick={() => setIsBookingModalOpen(false)}>Cancel</Button>
              <Button 
                className="flex-1 bg-gradient-premium hover:opacity-90 text-white shadow-lg shadow-indigo-500/25 disabled:opacity-50" 
                disabled={isSubmittingBooking || !myPets?.length || !bookingDate || !selectedSlot || !agreeTerms} 
                onClick={submitBooking}
              >
                {isSubmittingBooking ? 'Booking...' : 'Confirm Appointment'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function UserIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
