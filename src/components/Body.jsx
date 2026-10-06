import React from 'react'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { MdOutlineMail, MdOutlineChat, MdOutlineVideocam, MdCalendarMonth, MdLightbulb, MdTaskAlt, MdPerson, MdAdd, MdKeyboardArrowRight } from "react-icons/md";

// Left app rail (Mail / Chat / Meet). Only Mail is real.
const Rail = () => {
  const { unread } = useSelector(store => store.app);
  const items = [
    { icon: MdOutlineMail, text: 'Mail', badge: unread > 99 ? '99+' : unread || null, active: true },
    { icon: MdOutlineChat, text: 'Chat' },
    { icon: MdOutlineVideocam, text: 'Meet' },
  ];
  return (
    <div className='w-[68px] flex-none flex flex-col items-center gap-3 pt-1 text-xs font-medium'>
      {items.map(({ icon: Icon, text, badge, active }) => (
        <div key={text} className='flex flex-col items-center gap-1 cursor-pointer'>
          <div className={`relative w-14 h-8 rounded-full flex items-center justify-center ${active ? 'bg-[#D3E3FD] dark:bg-white/20' : 'hover:bg-gray-200 dark:hover:bg-white/10'}`}>
            <Icon size='20px' />
            {badge && <span className='absolute -top-1.5 left-7 min-w-[18px] px-1 rounded-full bg-[#b3261e] text-white text-[10px] leading-[18px] text-center'>{badge}</span>}
          </div>
          {text}
        </div>
      ))}
    </div>
  )
}

// Right add-on rail. Visual only.
const AddOns = () => (
  <div className='w-14 flex-none flex flex-col items-center gap-6 pt-4'>
    <MdCalendarMonth size='20px' className='text-[#1a73e8] cursor-pointer' />
    <MdLightbulb size='20px' className='text-[#fbbc04] cursor-pointer' />
    <MdTaskAlt size='20px' className='text-[#1a73e8] cursor-pointer' />
    <MdPerson size='20px' className='text-[#1a73e8] cursor-pointer' />
    <div className='w-5 border-t border-gray-300 dark:border-gray-600' />
    <MdAdd size='20px' className='text-gray-600 dark:text-gray-400 cursor-pointer' />
    <MdKeyboardArrowRight size='20px' className='mt-auto mb-6 text-gray-600 dark:text-gray-400 cursor-pointer' />
  </div>
)

const Body = () => {
  const { sidebar } = useSelector(store => store.app);
  return (
    <div className='flex h-[calc(100vh-4rem)]'>
      {sidebar && <Rail />}
      <Sidebar />
      <main className='flex-1 min-w-0 min-h-0 flex flex-col bg-white dark:bg-[#131314] rounded-2xl mb-4 overflow-hidden'>
        <Outlet />
      </main>
      <AddOns />
    </div>
  )
}

export default Body
