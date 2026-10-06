import React, { useEffect, useState } from 'react'
import { IoSettingsOutline } from "react-icons/io5";
import { FaRegQuestionCircle } from "react-icons/fa";
import { PiDotsNineBold } from "react-icons/pi";
import { IoIosSearch } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";
import { MdTune } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { setSearchText, toggleSidebar } from '../redux/appSlice';
import { getTheme, setTheme } from '../theme';

const Navbar = () => {
  const { searchText } = useSelector(store => store.app);
  const [search, setSearch] = useState(searchText);
  const [menu, setMenu] = useState(false);
  const [theme, setThemeState] = useState(getTheme);
  const dispatch = useDispatch();

  // Reflect searches started elsewhere (sidebar labels).
  useEffect(() => { setSearch(searchText); }, [searchText]);

  // Debounce: search hits the Mailpit API on every change.
  useEffect(() => {
    const t = setTimeout(() => dispatch(setSearchText(search)), 300);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <div className='flex items-center justify-between pl-2 pr-4 h-16'>
      <div className='flex items-center gap-1 w-[316px] flex-none'>
        <div onClick={() => dispatch(toggleSidebar())} title='Main menu' className='p-3 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer'>
          <RxHamburgerMenu size={'20px'} />
        </div>
        <img className='w-8 ml-2' src="/gmail.svg" alt="" />
        <h1 className='text-[22px] text-gray-600 dark:text-gray-200 pl-1'>Gmail</h1>
      </div>
      <div className='md:block hidden flex-1 max-w-3xl mr-auto'>
        <div className='flex items-center bg-[#EAF1FB] dark:bg-[#2f3133] px-3 h-12 rounded-full focus-within:bg-white dark:focus-within:bg-[#3c4043] focus-within:shadow-md'>
          <IoIosSearch size="22px" className='text-gray-700 dark:text-gray-300' />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search mail'
            title='Mailpit search: from:, to:, subject:, is:unread ...'
            className='w-full bg-transparent outline-none px-3'
          />
          <MdTune size="22px" className='text-gray-700 dark:text-gray-300 cursor-pointer' />
        </div>
      </div>
      <div className='md:block hidden'>
        <div className='flex items-center gap-1'>
          <a href="https://mailpit.axllent.org/docs/usage/search-filters/" target="_blank" rel="noreferrer" className='p-3 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer'>
            <FaRegQuestionCircle size={"20px"} />
          </a>
          <div className='relative'>
            <div onClick={() => setMenu(!menu)} title='Theme' className='p-3 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer'>
              <IoSettingsOutline size={"20px"} />
            </div>
            {menu && (
              <div className='absolute right-0 z-30 mt-1 w-40 py-2 rounded-lg shadow-lg bg-white dark:bg-[#2d2e30] text-sm'>
                <p className='px-4 pb-1 text-xs text-gray-500 dark:text-gray-400'>Theme</p>
                {['system', 'light', 'dark'].map((t) => (
                  <div key={t} onClick={() => { setTheme(t); setThemeState(t); setMenu(false) }}
                    className='flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 capitalize'>
                    {t}
                    {theme === t && <span className='text-[#0B57D0] dark:text-[#a8c7fa]'>✓</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className='p-3 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer' title='Gemini'>
            {/* Gemini sparkle. Visual only. */}
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <defs>
                <linearGradient id="gemini" x1="4" y1="20" x2="20" y2="4" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#1C7DFF" />
                  <stop offset="0.5" stopColor="#1C69FF" />
                  <stop offset="1" stopColor="#F0DCD6" />
                </linearGradient>
              </defs>
              <path fill="url(#gemini)" d="M12 2c.5 5.2 4.8 9.5 10 10-5.2.5-9.5 4.8-10 10-.5-5.2-4.8-9.5-10-10 5.2-.5 9.5-4.8 10-10z" />
            </svg>
          </div>
          <div className='p-3 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer'>
            <PiDotsNineBold size={"20px"} />
          </div>
          <div className='w-9 h-9 ml-1 rounded-full bg-[#0B57D0] text-white flex items-center justify-center font-medium'>M</div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
