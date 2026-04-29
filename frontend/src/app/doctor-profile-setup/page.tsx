'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import { User, MapPin, Award, Stethoscope, Building2, Languages, Star, CheckCircle, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function DoctorProfileSetup() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [avatarImage, setAvatarImage] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 300;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          setAvatarImage(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const { register, handleSubmit, setValue, control, formState: { errors } } = useForm({
    defaultValues: {
      locationCity: '',
      locationCountry: '',
      education: '',
      certifications: '',
      yearsOfExperience: 0,
      mainSpecialization: '',
      expertise: '',
      bio: '',
      clinicName: '',
      clinicAddress: '',
      consultationFee: 0,
      languages: '',
    }
  });

  useEffect(() => {
    if (!token || user?.role !== 'DOCTOR') {
      router.push('/dashboard');
      return;
    }

    // Fetch existing profile
    const fetchProfile = async () => {
      try {
        const res = await api.get('/doctors/profile/me');
        if (res.data) {
          Object.keys(res.data).forEach(key => {
            setValue(key as any, res.data[key]);
          });
        }
        
        // Also fetch user to get avatar
        if (user?.id) {
          const userRes = await api.get(`/users/${user.id}`);
          if (userRes.data?.avatarUrl) {
            setAvatarImage(userRes.data.avatarUrl);
          }
        }
        
        // If profile is already complete, redirect to unified profile page
        if (res.data?.isProfileComplete) {
          toast.success('Your profile is already set up! Redirecting to Profile Settings.');
          router.push('/profile');
        }
      } catch (err) {
        console.error('No existing profile found');
      } finally {
        setIsInitializing(false);
      }
    };
    fetchProfile();
  }, [token, user, router, setValue]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // transform number types
      data.yearsOfExperience = Number(data.yearsOfExperience);
      data.consultationFee = Number(data.consultationFee);
      
      if (avatarImage) {
        data.avatarUrl = avatarImage;
      }
      
      await api.put('/doctors/profile', data);
      toast.success('Profile created/updated successfully!');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitializing) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin w-10 h-10 text-indigo-600" /></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Doctor Profile Setup</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">Complete your professional profile so patients can find you.</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200/50 dark:border-slate-800">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            <section className="flex flex-col items-center justify-center pt-4 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div className="w-32 h-32 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-4 border-indigo-50 dark:border-indigo-900/30 relative group shadow-inner">
                {avatarImage ? (
                  <img src={avatarImage} alt="Profile Preview" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-slate-400" />
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs font-medium">Upload Photo</span>
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              <p className="text-sm text-slate-500 mt-4">Professional headshot recommended</p>
            </section>

            <section>
              <h3 className="text-xl flex items-center gap-2 font-semibold border-b pb-2 mb-4 dark:border-slate-800">
                <MapPin className="text-indigo-500 w-5 h-5"/> Location Info
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>City *</Label>
                  <Input {...register('locationCity', { required: true })} placeholder="e.g. New York"/>
                </div>
                <div className="space-y-1">
                  <Label>Country *</Label>
                  <Input {...register('locationCountry', { required: true })} placeholder="e.g. USA"/>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl flex items-center gap-2 font-semibold border-b pb-2 mb-4 dark:border-slate-800">
                <Award className="text-indigo-500 w-5 h-5"/> Professional Info
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Education</Label>
                  <Input {...register('education')} placeholder="e.g. DVM from Cornell University"/>
                </div>
                <div className="space-y-1">
                  <Label>Certifications</Label>
                  <Input {...register('certifications')} placeholder="e.g. Board Certified in Surgery"/>
                </div>
                <div className="space-y-1">
                  <Label>Years of Experience *</Label>
                  <Input type="number" {...register('yearsOfExperience', { required: true })} placeholder="e.g. 5"/>
                </div>
                <div className="space-y-1">
                  <Label>Languages Spoken</Label>
                  <Input {...register('languages')} placeholder="e.g. English, Spanish"/>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl flex items-center gap-2 font-semibold border-b pb-2 mb-4 dark:border-slate-800">
                <Stethoscope className="text-indigo-500 w-5 h-5"/> Specialization
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <Label>Main Specialization *</Label>
                  <Input {...register('mainSpecialization', { required: true })} placeholder="e.g. General Vet, Surgery, Dermatology"/>
                </div>
                <div className="space-y-1">
                  <Label>Expertise Areas (comma separated)</Label>
                  <Input {...register('expertise')} placeholder="e.g. Skin diseases, Dental care, Nutrition"/>
                </div>
                <div className="space-y-1">
                  <Label>Professional Bio</Label>
                  <textarea 
                    {...register('bio')} 
                    className="w-full h-32 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                    placeholder="Tell patients about yourself..."
                  />
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl flex items-center gap-2 font-semibold border-b pb-2 mb-4 dark:border-slate-800">
                <Building2 className="text-indigo-500 w-5 h-5"/> Practice Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Clinic/Hospital Name *</Label>
                  <Input {...register('clinicName', { required: true })} placeholder="e.g. Happy Paws Clinic"/>
                </div>
                <div className="space-y-1">
                  <Label>Consultation Fee ($) *</Label>
                  <Input type="number" {...register('consultationFee', { required: true })} placeholder="e.g. 80"/>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <Label>Clinic Address *</Label>
                  <Input {...register('clinicAddress', { required: true })} placeholder="Full address"/>
                </div>
              </div>
            </section>

            <div className="pt-6">
              <Button type="submit" disabled={isLoading} className="w-full h-14 text-lg bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : <CheckCircle className="w-6 h-6 mr-2" />}
                Save & Complete Profile
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
