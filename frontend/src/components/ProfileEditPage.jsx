import React, { useState, useRef } from 'react';
import { UserIcon } from './Icons';

const ProfileEditPage = ({ userProfile, onUpdateProfile, onNavigate }) => {
    const [profile, setProfile] = useState(userProfile);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile(prev => ({ ...prev, avatar: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        onUpdateProfile(profile);
        onNavigate('settings');
    };

    return (
        <div className="flex-grow flex flex-col bg-[#f8f6f2] dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-6 md:p-8 overflow-y-auto">
            <div className="max-w-2xl mx-auto w-full">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Edit Profile</h1>
                    <button onClick={() => onNavigate('settings')} className="text-sm font-semibold text-[#2e6342] hover:underline">
                        &larr; Back to Settings
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <div className="flex items-center gap-6 mb-6">
                        <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0 overflow-hidden flex items-center justify-center">
                            {profile.avatar ? <img src={profile.avatar} alt="Profile Preview" className="w-full h-full object-cover" /> : <UserIcon className="w-12 h-12 text-gray-400 dark:text-gray-500" />}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Profile Picture</label>
                            <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" ref={fileInputRef} />
                            <button onClick={() => fileInputRef.current.click()} className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-sm font-semibold py-2 px-4 rounded-lg transition-colors">
                                Upload Image
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Name</label>
                            <input type="text" name="name" value={profile.name} onChange={handleChange} className="w-full p-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Age</label>
                            <input type="number" name="age" value={profile.age} onChange={handleChange} className="w-full p-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Gender</label>
                            <select name="gender" value={profile.gender} onChange={handleChange} className="w-full p-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                                <option value="">Select...</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="rather_not_say">Rather not say</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Date of Birth</label>
                            <input type="date" name="dob" value={profile.dob} onChange={handleChange} className="w-full p-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"/>
                        </div>
                    </div>
                    <button onClick={handleSave} className="mt-6 bg-[#2e6342] hover:bg-[#1c5739] text-white font-bold py-2 px-6 rounded-lg transition-colors">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileEditPage;
