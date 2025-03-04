import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, Stethoscope, FileText, Upload, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import {getSpeciality,getCountry,addNewDoctor,getDoctors,addDoctorApplication,login} from '../../pages/api/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';




const requiredDocuments = [
  'Medical License',
  'Board Certification',
  'Professional Photo',
  'Government ID'
];

export default function DoctorApplicationForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [images, setDocuments] = useState([]);

  const [formData, setFormData] = useState({
    specialty: '',
    experience: '',
    license: '',
    bio: '',
    documents: {} as Record<string, File>
  });


      const {data:specialties} = useQuery({queryKey:['speciality'],queryFn:async ()=> getSpeciality()})
  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, documentType: string) => {
    const file = e.target.files?.[0];

    if (file) {
      cloudinaryUpload(file,documentType)
      // setFormData(prev => ({
      //   ...prev,
      //   documents: {
      //     ...prev.documents,
      //     [documentType]: file
      //   }
      // }));
    }
  };


  useEffect(()=>{
    // setFormData(prev => ({
    //     ...prev,
    //     documents: {
    //       ...prev.documents,
    //       [documents]: images
    //     }
    //   }));
  },[images])




  const cloudinaryUpload = async (photo:any,doc:String) => {
    console.log(photo)
    try {
      
      setIsLoading(true);
      // let newFile = (
      //   ["content"],
      //   photo?.name,
      //   {name:photo.name,type: photo.type,'lastModified':photo?.lastModified}
      // );
      // console.log("--new--file--",newFile)
      const data = new FormData();
      data.append("file", photo);
      data.append("upload_preset", "afrobuy");
      data.append("cloud_name", "dace5fmfe");
      let response = await fetch("https://api.cloudinary.com/v1_1/dace5fmfe/upload", {
        method: "POST",
        body: data,
      });
      let result = await response.json();
      setIsLoading(false)
      if (result.secure_url) {
        setDocuments((prevUrls) => [...prevUrls, {document:doc,url:result.secure_url}]);
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      console.log(error)
      alert("Upload Error", error);
    } finally {
      setIsLoading(false);
    }
  };


  const queryClient = useQueryClient()
  const mutation = useMutation({
        mutationFn:addDoctorApplication,onSuccess:(data)=>{
          // alert(JSON.stringify(data))
          queryClient.invalidateQueries("application");

      navigate('/doctor/application-status');

  
        }
      })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      
      // const { data: { user } } = await supabase.auth.getUser();
      const user_id = localStorage.getItem("user_id")
      if (!user_id) alert("not authorized");

      // alert(JSON.stringify({...formData,documents:images,doctor:user_id}))
      // return;

      mutation.mutate({...formData,years_of_experience:formData.experience,specialist:formData.specialty,license_number:formData.license,documents:images,user_id:user_id})

      // Upload documents
      // const uploadedDocuments: Record<string, string> = {};
      // for (const [type, file] of Object.entries(formData.documents)) {
      //   const fileName = `${user.id}/${type.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
      //   const { data, error: uploadError } = await supabase.storage
      //     .from('doctor-documents')
      //     .upload(fileName, file);

      //   if (uploadError) throw uploadError;
      //   uploadedDocuments[type] = fileName;
      // }

      // // Create doctor profile
      // const { error: doctorError } = await supabase
      //   .from('doctors')
      //   .insert([{
      //     id: user.id,
      //     specialty: formData.specialty,
      //     experience_years: parseInt(formData.experience),
      //     license_number: formData.license,
      //     bio: formData.bio,
      //     is_verified: false
      //   }]);

      // if (doctorError) throw doctorError;

      // Create application
      // const { error: applicationError } = await supabase
      //   .from('doctor_applications')
      //   .insert([{
      //     doctor_id: user.id,
      //     status: 'pending',
      //     documents: uploadedDocuments
      //   }]);

      // if (applicationError) throw applicationError;

      // Redirect to application status page
    } catch (err) {
      console.error('Error submitting application:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit application');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = (documentType) => {
    setDocuments((prevImages) => prevImages.filter((img) => img.document !== documentType));
  };
  

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
            <h1 className="text-2xl font-bold mb-2">Doctor Application</h1>
            <p className="text-emerald-50">
              Complete this form to join our network of healthcare professionals
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialty
              </label>
              <select
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              >
                <option value="">Select your specialty</option>
                {specialties?.map(specialty => (
                  <option key={specialty.id} value={specialty.id}>{specialty.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License Number
              </label>
              <input
                type="text"
                value={formData.license}
                onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Professional Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                       resize-none"
                rows={4}
                required
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Documents (upload as image)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requiredDocuments.map((documentType) => (
                  <div
                    key={documentType}
                    className="p-4 border border-gray-200 rounded-lg hover:border-emerald-500
                           transition-colors"
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {documentType}
                    </label>
                    <div className="relative">
                    {images.filter(p => p.document === documentType).length > 0 ? (
  <>
    <div className="relative inline-block">
      <img width={200} src={images.filter(p => p.document === documentType)[0].url} alt="Uploaded" />
      <button
        onClick={() => handleRemoveImage(documentType)}
        className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-xs"
      >
        X
      </button>
    </div>
  </>
) : (
  <>
    <input
      type="file"
      onChange={(e) => handleFileChange(e, documentType)}
      className="hidden"
      id={`file-${documentType}`}
      accept=".pdf,.jpg,.jpeg,.png"
      required
    />
    <label
      htmlFor={`file-${documentType}`}
      className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600
                rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
    >
      <Upload className="w-5 h-5" />
      <span>
        {formData.documents[documentType]?.name || 'Upload Document'}
      </span>
    </label>
  </>
)}

                      
                      
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700
                       hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 
                       text-white rounded-lg shadow-lg shadow-emerald-500/20
                       hover:shadow-xl hover:shadow-emerald-500/30 transition-all
                       transform hover:scale-[1.02] active:scale-98 flex items-center
                       gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    Submit Application
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}