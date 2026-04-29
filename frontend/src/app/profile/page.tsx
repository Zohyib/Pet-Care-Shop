'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Camera, Save, X, User as UserIcon, Lock, MapPin, Building2, ShieldAlert, Award, Phone, Mail, Stethoscope, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';

export default function UnifiedProfilePage() {
  const { user, token, setUser } = useAuthStore();
  const router = useRouter();
  
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState<any>({
    name: '',
    email: '',
    phone: '',
    avatarUrl: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    doctorProfile: {},
    sellerProfile: {}
  });

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    setIsLoading(true);
    fetchProfile();
  }, [token, router]);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/profile/me');
      setProfile(res.data);
      setFormData({
        name: res.data.name || '',
        email: res.data.email || '',
        phone: res.data.phone || '',
        avatarUrl: res.data.avatarUrl || '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        doctorProfile: res.data.doctorProfile || {
          education: '',
          yearsOfExperience: 0,
          mainSpecialization: '',
          expertise: '',
          clinicName: '',
          clinicAddress: '',
          consultationFee: 0,
        },
        sellerProfile: res.data.sellerProfile || {
          businessName: '',
          contactNumber: '',
          address: '',
          category: '',
          description: '',
        }
      });
      // Sync avatar/name to navbar
      setUser({ name: res.data.name, avatarUrl: res.data.avatarUrl });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

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
          setFormData({ ...formData, avatarUrl: canvas.toDataURL('image/jpeg', 0.7) });
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDoctorChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      doctorProfile: { 
        ...formData.doctorProfile, 
        [name]: name === 'yearsOfExperience' || name === 'consultationFee' ? Number(value) : value 
      } 
    });
  };

  const handleSellerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      sellerProfile: { ...formData.sellerProfile, [name]: value } 
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      return toast.error('New passwords do not match');
    }
    if (formData.newPassword && !formData.oldPassword) {
      return toast.error('Old password is required to set a new password');
    }

    setIsSaving(true);
    try {
      const payload: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        avatarUrl: formData.avatarUrl,
      };

      if (formData.newPassword) {
        payload.oldPassword = formData.oldPassword;
        payload.newPassword = formData.newPassword;
      }

      if (profile?.role === 'DOCTOR') {
        payload.doctorProfile = formData.doctorProfile;
      }
      if (profile?.role === 'SELLER') {
        payload.sellerProfile = formData.sellerProfile;
      }

      await api.put('/users/profile/me', payload);
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      setFormData((prev: any) => ({ ...prev, oldPassword: '', newPassword: '', confirmPassword: '' }));
      fetchProfile();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center dark:bg-slate-950"><div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <Navbar />
      
      <div className="bg-indigo-600 dark:bg-slate-900 pt-16 pb-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Profile Management</h1>
          <p className="text-indigo-100">Manage your personal information, security, and preferences.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-24 relative z-20">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 p-6 md:p-10">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 dark:border-slate-800 pb-6 mb-8 gap-4">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-700 shadow-md flex items-center justify-center overflow-hidden relative group">
                {formData.avatarUrl ? (
                  <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-10 h-10 text-slate-400" />
                )}
                {isEditing && (
                  <>
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Camera className="w-6 h-6 text-white mb-1" />
                      <span className="text-[10px] text-white font-bold uppercase">Upload</span>
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  {profile?.name} 
                  <span className="text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 px-2 py-1 rounded-full uppercase font-bold tracking-wider">
                    {profile?.role}
                  </span>
                </h2>
                <p className="text-slate-500">{profile?.email}</p>
              </div>
            </div>
            <div>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 shadow-lg">
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => { setIsEditing(false); fetchProfile(); }} className="rounded-xl border-slate-200 dark:border-slate-700">
                    <X className="w-4 h-4 mr-2" /> Cancel
                  </Button>
                  <Button onClick={handleSubmit} disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-600/30">
                    {isSaving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                  </Button>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Common Fields */}
            <section>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
                <UserIcon className="w-5 h-5 text-indigo-500" /> Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} required className="rounded-xl dark:bg-slate-800 dark:border-slate-700" />
                </div>
                <div className="space-y-2">
                  <Label>Email Address *</Label>
                  <Input type="email" name="email" value={formData.email} onChange={handleChange} disabled={!isEditing} required className="rounded-xl dark:bg-slate-800 dark:border-slate-700" />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input type="tel" name="phone" value={formData.phone} onChange={handleChange} disabled={!isEditing} placeholder="e.g. +1 234 567 8900" className="rounded-xl dark:bg-slate-800 dark:border-slate-700" />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-400">Account Role</Label>
                  <Input value={profile?.role} disabled className="rounded-xl bg-slate-50 dark:bg-slate-900/50 text-slate-500 border-dashed cursor-not-allowed" />
                  <p className="text-xs text-amber-500 flex items-center mt-1"><ShieldAlert className="w-3 h-3 mr-1"/> Roles cannot be changed manually.</p>
                </div>
              </div>
            </section>

            {/* DOCTOR FIELDS */}
            {profile?.role === 'DOCTOR' && (
              <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
                  <Stethoscope className="w-5 h-5 text-indigo-500" /> Doctor / Professional Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Clinic/Hospital Name</Label>
                    <Input name="clinicName" value={formData.doctorProfile.clinicName} onChange={handleDoctorChange} disabled={!isEditing} className="rounded-xl dark:bg-slate-800 dark:border-slate-700" />
                  </div>
                  <div className="space-y-2">
                    <Label>Consultation Fee ($)</Label>
                    <Input type="number" name="consultationFee" value={formData.doctorProfile.consultationFee} onChange={handleDoctorChange} disabled={!isEditing} className="rounded-xl dark:bg-slate-800 dark:border-slate-700" />
                  </div>
                  <div className="space-y-2">
                    <Label>Main Specialization</Label>
                    <Input name="mainSpecialization" value={formData.doctorProfile.mainSpecialization} onChange={handleDoctorChange} disabled={!isEditing} className="rounded-xl dark:bg-slate-800 dark:border-slate-700" />
                  </div>
                  <div className="space-y-2">
                    <Label>Years of Experience</Label>
                    <Input type="number" name="yearsOfExperience" value={formData.doctorProfile.yearsOfExperience} onChange={handleDoctorChange} disabled={!isEditing} className="rounded-xl dark:bg-slate-800 dark:border-slate-700" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label>Clinic Address</Label>
                    <Input name="clinicAddress" value={formData.doctorProfile.clinicAddress} onChange={handleDoctorChange} disabled={!isEditing} className="rounded-xl dark:bg-slate-800 dark:border-slate-700" />
                  </div>
                </div>
              </motion.section>
            )}

            {/* SELLER FIELDS */}
            {profile?.role === 'SELLER' && (
              <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
                  <Briefcase className="w-5 h-5 text-indigo-500" /> Business Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Business Name</Label>
                    <Input name="businessName" value={formData.sellerProfile.businessName} onChange={handleSellerChange} disabled={!isEditing} className="rounded-xl dark:bg-slate-800 dark:border-slate-700" />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Number</Label>
                    <Input name="contactNumber" value={formData.sellerProfile.contactNumber} onChange={handleSellerChange} disabled={!isEditing} className="rounded-xl dark:bg-slate-800 dark:border-slate-700" />
                  </div>
                  <div className="space-y-2">
                    <Label>Business Category</Label>
                    <Input name="category" value={formData.sellerProfile.category} onChange={handleSellerChange} disabled={!isEditing} className="rounded-xl dark:bg-slate-800 dark:border-slate-700" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Business Address</Label>
                    <Input name="address" value={formData.sellerProfile.address} onChange={handleSellerChange} disabled={!isEditing} className="rounded-xl dark:bg-slate-800 dark:border-slate-700" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Description</Label>
                    <textarea name="description" value={formData.sellerProfile.description} onChange={handleSellerChange as any} disabled={!isEditing} rows={3} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none resize-none disabled:opacity-60 disabled:bg-slate-50" />
                  </div>
                </div>
              </motion.section>
            )}

            {/* Security Section */}
            {isEditing && (
              <motion.section initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
                  <Lock className="w-5 h-5 text-indigo-500" /> Security & Password
                </h3>
                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-2xl p-6">
                  <p className="text-sm text-amber-700 dark:text-amber-500 mb-6">Leave these fields blank if you do not wish to change your password.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-amber-900 dark:text-amber-100">Current Password</Label>
                      <Input type="password" name="oldPassword" value={formData.oldPassword} onChange={handleChange} placeholder="Enter your current password" className="rounded-xl bg-white dark:bg-slate-800 dark:border-slate-700" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-amber-900 dark:text-amber-100">New Password</Label>
                      <Input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} placeholder="Enter new password" className="rounded-xl bg-white dark:bg-slate-800 dark:border-slate-700" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-amber-900 dark:text-amber-100">Confirm New Password</Label>
                      <Input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm new password" className="rounded-xl bg-white dark:bg-slate-800 dark:border-slate-700" />
                    </div>
                  </div>
                </div>
              </motion.section>
            )}

          </form>
        </div>
      </div>
    </div>
  );
}
