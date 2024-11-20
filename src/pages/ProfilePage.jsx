import React from "react";
import { useParams } from "react-router-dom";
import { User, Mail, Phone, MapPin, Building } from "lucide-react";

const ProfilePage = () => {
  const { id } = useParams();

  // Simulated user data
  const userData = {
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    department: "Engineering",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 py-5 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-200">
          {/* Profile Header */}
          <div className="relative h-48 bg-white">
            {/* The gradient background section */}
          </div>

          {/* Header Section with Logos */}
          <div className="container mx-auto px-4 py-1 flex flex-col items-center bg-white">
            <div className="flex items-center justify-center gap-40 mb-1">
              <img
                src="/logos/logo1.png"
                alt="Logo 1"
                className="h-24 w-auto"
              />
              <img
                src="/logos/logo2.png"
                alt="Logo 2"
                className="h-24 w-auto"
              />
              <img
                src="/logos/logo3.png"
                alt="Logo 3"
                className="h-24 w-auto"
              />
            </div>
            <h1 className="text-lg md:text-xl font-semibold text-center mb-6">
              Secure Encryption and Authentication Model
            </h1>
          </div>

          {/* Profile Content with Orange Gradient Background */}
          <div className="pt-16 pb-8 px-8 bg-gradient-to-r from-orange-400 to-yellow-300">
            {/* Profile image now placed below the header section */}
            <div className="flex justify-center">
              <img
                src={userData.image}
                alt={userData.name}
                className="w-40 h-40 rounded-full border-4 border-white object-cover shadow-lg"
              />
            </div>

            <h1 className="text-3xl font-bold text-center mb-2 text-white">
              {userData.name}
            </h1>
            <p className="text-white text-center mb-8">Employee ID: {id}</p>

            <div className="space-y-4 max-w-lg mx-auto">
              <div className="flex items-center space-x-4 p-4 bg-white rounded-xl border border-gray-200">
                <User className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{userData.name}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-white rounded-xl border border-gray-200">
                <Mail className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{userData.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-white rounded-xl border border-gray-200">
                <Building className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium">{userData.department}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-white rounded-xl border border-gray-200">
                <Phone className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{userData.phone}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-white rounded-xl border border-gray-200">
                <MapPin className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{userData.location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
