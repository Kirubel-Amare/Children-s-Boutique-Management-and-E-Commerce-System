// components/auth/SignUpDecorativeSide.tsx
export const SignUpDecorativeSide: React.FC = () => {
  const benefits = [
    { icon: '⚡', text: 'Easy to use interface' },
    { icon: '📈', text: 'Real-time business insights' },
    { icon: '🛡️', text: 'Secure and reliable' },
    { icon: '🎯', text: 'Built for boutiques' }
  ];

  return (
    <div className="hidden lg:block relative flex-1 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white bg-opacity-20 rounded-full mix-blend-overlay filter blur-xl animate-float"></div>
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-white bg-opacity-30 rounded-full mix-blend-overlay filter blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-1/3 left-1/3 w-28 h-28 bg-white bg-opacity-25 rounded-full mix-blend-overlay filter blur-xl animate-float" style={{ animationDelay: '4s' }}></div>

      {/* Content */}
      <div className="relative flex flex-col justify-center items-center h-full px-12 text-white">
        <div className="max-w-md text-center">
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-8 border border-white border-opacity-30">
            <div className="text-6xl mb-6">🚀</div>
            <h3 className="text-2xl font-bold mb-4">Start Your Journey</h3>
            <p className="text-white text-opacity-90 leading-relaxed">
              Join our boutique management platform and take your business to the next level. 
              Streamline operations, understand your customers, and grow your brand.
            </p>
            
            {/* Benefits List */}
            <div className="mt-8 space-y-4 text-left">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center text-white text-opacity-90">
                  <span className="text-xl mr-3">{benefit.icon}</span>
                  <span>{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom decorative curve */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full">
          <path 
            fill="#FFFFFF" 
            fillOpacity="1" 
            d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,74.7C1120,75,1280,53,1360,42.7L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};