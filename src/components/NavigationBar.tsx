import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { FaCode, FaHome } from 'react-icons/fa';
import { NavLink, useLocation } from 'react-router-dom';

const routes = [
  { path: '/', icon: <FaHome /> },
  { path: '/projects', icon: <FaCode /> }
];

const NavigationBar = () => {
  const location = useLocation();
  const [underlineStyle, setUnderlineStyle] = useState({});
  const navRef = useRef<HTMLDivElement | null>(null);

  const updateUnderlinePosition = () => {
    const activeLink = navRef.current?.querySelector('.active');
    if (activeLink) {
      const { offsetLeft, offsetWidth } = activeLink as HTMLElement;
      setUnderlineStyle({
        left: offsetLeft,
        width: offsetWidth
      });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    updateUnderlinePosition();
  }, [location.pathname]);

  useEffect(() => {
    window.addEventListener('resize', updateUnderlinePosition);
    return () => {
      window.removeEventListener('resize', updateUnderlinePosition);
    };
  }, []);

  return (
    <nav
      ref={navRef}
      className='fixed top-2 left-1/2 z-50 w-[80%] max-w-3xl -translate-x-1/2 transform rounded-full bg-gray-800 text-white shadow-md'
    >
      <div className='relative flex justify-around py-2'>
        {routes.map(({ path, icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `relative flex items-center justify-center text-lg transition ${
                isActive ? 'active text-indigo-400' : 'text-white'
              }`
            }
          >
            {icon}
          </NavLink>
        ))}
        <motion.div
          className='absolute bottom-0 h-1 rounded-full bg-indigo-400'
          animate={underlineStyle}
          initial={false}
          transition={{ type: 'spring', stiffness: 300, damping: 40 }}
        />
      </div>
    </nav>
  );
};

export default NavigationBar;
