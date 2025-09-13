import React, { useState } from 'react';

const SkillTeam = () => {
  const developers = [
    {
      name: "Vedant Bhatt",
      id: "24CE013",
      linkedin: "https://www.linkedin.com/in/vedantbhattce"
    },
    {
      name: "Jash Baldha",
      id: "24CE004",
      linkedin: "https://www.linkedin.com/in/jashkumar-baldha-600b8131a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
    },
    {
      name: "Ansh Darji",
      id: "24CE022", 
      linkedin: "https://www.linkedin.com/in/ansh-darji-453b6331a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
    },
    {
      name: "Kalp Ka.Patel",
      id: "24CE045",
      linkedin: "https://linkedin.com/in/kshitij-oza"
    },
    {
      name: "Krrish Bahrdwaj",
      id: "24CE010",
      linkedin: "https://www.linkedin.com/in/krrish-bhardwaj-621945328?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
    }
  ];

  const faculty = [
    {
      name: "Prof. Ronak R Patel",
      initial: "R", 
      linkedin: "https://linkedin.com/in/ronak-patel"
    }
  ];

  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Header Section with Gradient Background */}
     <div className="relative bg-gradient-to-br from-blue-600 to-purple-700 px-6 py-8 lg:py-10 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-4 -right-4 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute -bottom-8 -left-8 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            Skill Team
          </h1>
          <p className="text-base md:text-lg lg:text-xl max-w-4xl mx-auto opacity-95 leading-relaxed">
            Meet the brilliant minds behind this project — visionaries, developers, and mentors who brought this vision to life
          </p>
        </div>
      </div>

      {/* Main Content - Single page layout */}
      <div className="bg-gray-50 px-6 py-8">
        <div className="max-w-7xl mx-auto">

          {/* Developer Team Section */}
          <div className="mb-12">
            <div className="text-center mb-10">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                Developer Team
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 mx-auto rounded-full"></div>
            </div>

            {/* All developers in one responsive row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
              {developers.map((developer, index) => (
                <div 
                  key={index} 
                  className="group relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden"
                  onMouseEnter={() => setHoveredCard(`dev-${index}`)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => window.open(developer.linkedin, '_blank')}
                >
                  {/* Original Content */}
                  <div className={`text-center transition-all duration-300 ${
                    hoveredCard === `dev-${index}` ? 'opacity-0 transform translate-y-2' : 'opacity-100'
                  }`}>
                    <h3 className="text-base font-bold text-gray-800 mb-3 leading-tight">
                      {developer.name}
                    </h3>
                    <div className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm font-mono rounded-lg">
                      {developer.id}
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex flex-col justify-center items-center text-white transition-all duration-300 ${
                    hoveredCard === `dev-${index}` ? 'opacity-100 transform scale-100' : 'opacity-0 transform scale-95'
                  }`}>
                    <h3 className="text-base font-bold mb-2">
                      {developer.name}
                    </h3>
                    <p className="text-sm mb-3 opacity-90">
                      {developer.id}
                    </p>
                    <div className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg">
                      <p className="text-sm font-medium">Click to view LinkedIn profile</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Faculty Core Team Section */}
          <div>
            <div className="text-center mb-10">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                Faculty Mentor
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-600 mx-auto rounded-full"></div>
            </div>

            <div className="flex justify-center">
              {faculty.map((member, index) => (
                <div 
                  key={index} 
                  className="group relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden max-w-sm"
                  onMouseEnter={() => setHoveredCard(`faculty-${index}`)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => window.open(member.linkedin, '_blank')}
                >
                  {/* Original Content */}
                  <div className={`transition-all duration-300 ${
                    hoveredCard === `faculty-${index}` ? 'opacity-0 transform translate-y-2' : 'opacity-100'
                  }`}>
                    <div className="w-18 h-18 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6 shadow-lg">
                      {member.initial}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 leading-tight">
                      {member.name}
                    </h3>
                  </div>

                  {/* Hover Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex flex-col justify-center items-center text-white transition-all duration-300 ${
                    hoveredCard === `faculty-${index}` ? 'opacity-100 transform scale-100' : 'opacity-0 transform scale-95'
                  }`}>
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center font-bold text-xl mb-4">
                      {member.initial}
                    </div>
                    <h3 className="text-xl font-bold mb-6">
                      {member.name}
                    </h3>
                    <div className="bg-white/20 backdrop-blur-sm px-6 py-2 rounded-lg">
                      <p className="text-sm font-medium">LinkedIn</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles for smooth animations */}
      <style jsx>{`
        .group:hover {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .group:hover .hover-content {
          animation: slideInUp 0.3s ease-out;
        }

        .w-18 {
          width: 4.5rem;
        }
        
        .h-18 {
          height: 4.5rem;
        }

        @media (max-width: 768px) {
          .text-4xl {
            font-size: 2.25rem;
          }
          .text-3xl {
            font-size: 1.875rem;
          }
        }
        
        @media (max-width: 640px) {
          .grid-cols-1 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>
    </div>
  );
};

export default SkillTeam;
