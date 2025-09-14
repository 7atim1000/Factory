import { useState, useEffect } from 'react';

const AnalogClock = ({ className = '' }) => {
  const [time, setTime] = useState(new Date());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate clock hands angles
  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;
  
  const secondStyle = {
    transform: `rotate(${seconds * 6}deg)`
  };
  const minuteStyle = {
    transform: `rotate(${minutes * 6}deg)`
  };
  const hourStyle = {
    transform: `rotate(${hours * 30 + minutes * 0.5}deg)`
  };

  return (
    <div className={`relative rounded-full border-2 border-[#0ea5e9] ${className}`}>
      {/* Clock center dot */}
      <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-[#0ea5e9] rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10" />
      
      {/* Hour marks */}
      {[...Array(12)].map((_, i) => (
        <div 
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            top: '15%',
            left: '50%',
            transform: `rotate(${i * 30}deg) translateX(-50%) translateY(-50%) rotate(-${i * 30}deg)`,
            transformOrigin: '0 0'
          }}
        />
      ))}
      
      {/* Clock hands */}
      <div 
        className="absolute top-1/2 left-1/2 w-1 h-1/4 bg-[#1a1a1a] origin-bottom transform -translate-x-1/2 -translate-y-full z-2"
        style={hourStyle}
      />
      <div 
        className="absolute top-1/2 left-1/2 w-0.5 h-1/3 bg-[#1a1a1a] origin-bottom transform -translate-x-1/2 -translate-y-full z-3"
        style={minuteStyle}
      />
      <div 
        className="absolute top-1/2 left-1/2 w-px h-2/5 bg-[#0ea5e9] origin-bottom transform -translate-x-1/2 -translate-y-full z-4"
        style={secondStyle}
      />
    </div>
  );
};

export default AnalogClock;