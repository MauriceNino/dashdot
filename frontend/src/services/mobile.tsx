import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

const isMobileFunc = (): boolean => {
  if (typeof window !== 'undefined') {
    return window.innerWidth < 750;
  }
  return true;
};

export const MobileContext = createContext<boolean>(isMobileFunc());

export const MobileContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isMobile, setIsMobile] = useState(isMobileFunc());

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(isMobileFunc());
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <MobileContext.Provider value={isMobile}>{children}</MobileContext.Provider>
  );
};

export const useIsMobile = () => {
  const isMob = useContext(MobileContext);
  return isMob;
};
