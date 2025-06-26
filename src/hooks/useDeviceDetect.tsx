import { useState, useEffect } from 'react';

const useDeviceDetect = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      // You can adjust the breakpoint (768px is a common mobile threshold)
      setIsMobile(window.innerWidth <= 768);
    };

    // Check on initial render
    checkDevice();

    // Add event listener for window resize
    window.addEventListener('resize', checkDevice);

    // Cleanup listener on unmount
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return { isMobile, isDesktop: !isMobile };
};

export default useDeviceDetect;