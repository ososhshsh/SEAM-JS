import React from "react";
import { useParams, useLocation } from "react-router-dom"; // Import useLocation to access the state
import { User, Mail, Phone, MapPin, Building } from "lucide-react";

const ProfilePage = () => {
  const { id } = useParams();
  const location = useLocation(); // Access location to get the state passed during navigation

  // Simulated user data (dynamic data could come from API in production)
  const userProfiles = {
    1: {
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      department: "Engineering",
      image: `/dataset/1.jpg`, // Matched face image from dataset
    },
    2: {
      name: "Michael Lee",
      email: "michael.lee@example.com",
      phone: "+1 (555) 987-6543",
      location: "New York, NY",
      department: "Design",
      image: `/dataset/2.jpg`,
    },
    // Add more profiles as needed
  };

  // Get the user data from the predefined profiles or fallback if not found
  const userData = userProfiles[id] || {
    name: "Unknown User",
    email: "N/A",
    phone: "N/A",
    location: "N/A",
    department: "N/A",
    image: "/default-profile.jpg", // Default fallback image
  };

  // Check if the matched image was passed via state
  const matchedImage = location.state?.image || userData.image; // Use passed image or fallback to default profile image

  return (
    <div className="min-h-screen bg-white text-gray-900 py-5 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-200">
          {/* Header Section with Logos */}
          <div className="relative h-48 bg-gradient-to-r from-orange-400 to-yellow-300 flex justify-center items-center">
            <div className="absolute top-4 left-4 flex items-center gap-4">
              <img
                src="/logos/logo1.png"
                alt="Logo 1"
                className="h-12 w-auto"
              />
              <img
                src="/logos/logo2.png"
                alt="Logo 2"
                className="h-12 w-auto"
              />
              <img
                src="/logos/logo3.png"
                alt="Logo 3"
                className="h-12 w-auto"
              />
            </div>
            <h1 className="text-lg md:text-xl font-semibold text-white">
              Secure Encryption and Authentication Model
            </h1>
          </div>

          {/* Profile Content */}
          <div className="pt-16 pb-8 px-8 bg-gradient-to-r from-orange-400 to-yellow-300">
            {/* Profile Image */}
            <div className="flex justify-center">
              <img
                src={matchedImage} // Use the matched image passed from the authentication page
                alt={userData.name}
                className="w-40 h-40 rounded-full border-4 border-white object-cover shadow-lg"
                onError={(e) => (e.target.src = "/default-profile.jpg")} // Fallback if image fails to load
              />
            </div>

            {/* User Info */}
            <h1 className="text-3xl font-bold text-center mt-4 text-white">
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

          {/* Footer */}
          <div className="bg-white text-center py-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              © SEAM Authentication System 2024. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
