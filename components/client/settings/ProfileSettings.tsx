import React from 'react';
import { useClientSettings } from '../../../hooks/useClientSettings';

const timezones = {
    'Africa': [ 'Africa/Abidjan', 'Africa/Accra', 'Africa/Algiers', 'Africa/Cairo', 'Africa/Casablanca', 'Africa/Johannesburg', 'Africa/Lagos', 'Africa/Nairobi' ],
    'America': [ 'America/Adak', 'America/Anchorage', 'America/Argentina/Buenos_Aires', 'America/Asuncion', 'America/Bogota', 'America/Boise', 'America/Caracas', 'America/Chicago', 'America/Denver', 'America/Edmonton', 'America/Halifax', 'America/Havana', 'America/Indianapolis', 'America/Jamaica', 'America/La_Paz', 'America/Lima', 'America/Los_Angeles', 'America/Mexico_City', 'America/Montevideo', 'America/New_York', 'America/Phoenix', 'America/Puerto_Rico', 'America/Santiago', 'America/Sao_Paulo', 'America/St_Johns', 'America/Tijuana', 'America/Toronto', 'America/Vancouver', 'America/Winnipeg' ],
    'Asia': [ 'Asia/Almaty', 'Asia/Baghdad', 'Asia/Bangkok', 'Asia/Colombo', 'Asia/Dhaka', 'Asia/Dubai', 'Asia/Hong_Kong', 'Asia/Istanbul', 'Asia/Jakarta', 'Asia/Jerusalem', 'Asia/Kabul', 'Asia/Karachi', 'Asia/Kolkata', 'Asia/Kuala_Lumpur', 'Asia/Manila', 'Asia/Qatar', 'Asia/Riyadh', 'Asia/Seoul', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Taipei', 'Asia/Tashkent', 'Asia/Tehran', 'Asia/Tokyo' ],
    'Atlantic': [ 'Atlantic/Azores', 'Atlantic/Bermuda', 'Atlantic/Canary', 'Atlantic/Cape_Verde', 'Atlantic/Reykjavik' ],
    'Australia': [ 'Australia/Adelaide', 'Australia/Brisbane', 'Australia/Darwin', 'Australia/Hobart', 'Australia/Melbourne', 'Australia/Perth', 'Australia/Sydney' ],
    'Europe': [ 'Europe/Amsterdam', 'Europe/Athens', 'Europe/Belgrade', 'Europe/Berlin', 'Europe/Brussels', 'Europe/Bucharest', 'Europe/Budapest', 'Europe/Copenhagen', 'Europe/Dublin', 'Europe/Helsinki', 'Europe/Istanbul', 'Europe/Kiev', 'Europe/Lisbon', 'Europe/London', 'Europe/Madrid', 'Europe/Minsk', 'Europe/Moscow', 'Europe/Oslo', 'Europe/Paris', 'Europe/Prague', 'Europe/Rome', 'Europe/Sofia', 'Europe/Stockholm', 'Europe/Vienna', 'Europe/Warsaw', 'Europe/Zurich' ],
    'Indian': [ 'Indian/Maldives', 'Indian/Mauritius', 'Indian/Reunion' ],
    'Pacific': [ 'Pacific/Auckland', 'Pacific/Fiji', 'Pacific/Galapagos', 'Pacific/Guam', 'Pacific/Honolulu', 'Pacific/Port_Moresby', 'Pacific/Tahiti' ],
    'UTC': [ 'UTC' ]
};

const ProfileSettings: React.FC = () => {
    const { profile, updateProfile } = useClientSettings();

    // Mock handler, in a real app this would be a state update
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
       console.log({ [e.target.name]: e.target.value });
    };

    return (
        <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Company Profile</h3>
            <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Name</label>
                        <input type="text" id="companyName" name="companyName" defaultValue={profile.companyName} onChange={handleChange} className="mt-1 block w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Email</label>
                        <input type="email" id="email" name="email" defaultValue={profile.email} onChange={handleChange} className="mt-1 block w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
                    </div>
                     <div>
                        <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Number</label>
                        <input type="tel" id="contactNumber" name="contactNumber" defaultValue={profile.contactNumber} onChange={handleChange} className="mt-1 block w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
                    </div>
                    <div>
                        <label htmlFor="whatsappLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300">WhatsApp Link</label>
                        <input type="url" id="whatsappLink" name="whatsappLink" defaultValue={profile.whatsappLink} onChange={handleChange} className="mt-1 block w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                        <input type="text" id="address" name="address" defaultValue={profile.address} onChange={handleChange} className="mt-1 block w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
                    </div>
                    <div>
                        <label htmlFor="timeZone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Time Zone</label>
                        <select id="timeZone" name="timeZone" defaultValue={profile.timeZone} onChange={handleChange} className="mt-1 block w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600">
                           {Object.entries(timezones).map(([group, zones]) => (
                                <optgroup key={group} label={group}>
                                    {zones.map(zone => (
                                        <option key={zone} value={zone}>{zone.replace(/_/g, ' ')}</option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Language</label>
                        <select id="language" name="language" defaultValue={profile.language} onChange={handleChange} className="mt-1 block w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600">
                            <option>English</option>
                            <option>Spanish</option>
                            <option>French</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Logo</label>
                        <div className="mt-2 flex items-center">
                            <span className="inline-block h-16 w-16 rounded-full overflow-hidden bg-gray-100">
                                {profile.logoUrl ? <img src={profile.logoUrl} alt="Company Logo" /> : <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.997A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                            </span>
                            <input type="file" className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600" />
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileSettings;
