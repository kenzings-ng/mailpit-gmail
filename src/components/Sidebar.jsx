import React from 'react'
import { LuPencil } from "react-icons/lu";
import { MdInbox, MdStarBorder, MdOutlineWatchLater, MdOutlineInsertDriveFile, MdOutlineKeyboardArrowDown, MdLabel, MdAdd } from "react-icons/md";
import { TbSend2 } from "react-icons/tb";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setOpen, setSearchText } from '../redux/appSlice';
import { colorFor } from '../api';

const iconSize = "20px";

// Only Inbox and Labels (Mailpit tags) are real; the rest are visual.
const sidebarItems = [
    { icon: <MdStarBorder size={iconSize} />, text: "Starred" },
    { icon: <MdOutlineWatchLater size={iconSize} />, text: "Snoozed" },
    { icon: <TbSend2 size={iconSize} />, text: "Sent" },
    { icon: <MdOutlineInsertDriveFile size={iconSize} />, text: "Drafts" },
    { icon: <MdOutlineKeyboardArrowDown size={iconSize} />, text: "More" },
]

const tagQuery = (t) => `tag:"${t}"`;
const row = 'flex pl-6 pr-4 h-8 rounded-full items-center gap-4 cursor-pointer';
const active = 'bg-[#D3E3FD] dark:bg-white/20 font-bold';
const idle = 'hover:bg-gray-200 dark:hover:bg-white/10';

const Sidebar = () => {
    const { unread, tags, searchText, sidebar } = useSelector(store => store.app);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const show = (q) => { dispatch(setSearchText(q)); navigate('/'); };
    const current = tags.find(t => searchText === tagQuery(t));

    // Collapsed (hamburger): icon-only column like Gmail.
    if (!sidebar) {
        const mini = 'w-14 h-8 flex items-center justify-center rounded-full cursor-pointer';
        return (
            <div className='w-[72px] flex-none flex flex-col items-center gap-1 select-none'>
                <button onClick={() => dispatch(setOpen(true))} title='Compose' className='w-14 h-14 mb-4 mt-1 flex items-center justify-center bg-[#C2E7FF] dark:bg-white dark:text-[#1f1f1f] rounded-2xl hover:shadow-md'>
                    <LuPencil size={"20px"} />
                </button>
                <div onClick={() => show('')} title='Inbox' className={`${mini} relative ${!searchText ? 'bg-[#D3E3FD] dark:bg-white/20' : idle}`}>
                    <MdInbox size={iconSize} />
                    {unread > 0 && <span className='absolute top-1 right-3 w-2 h-2 rounded-full bg-[#d93025]' />}
                </div>
                {sidebarItems.map((item) => <div key={item.text} title={item.text} className={`${mini} ${idle}`}>{item.icon}</div>)}
                <div className={`${mini} ${idle} mt-4`} title='Create new label'><MdAdd size={iconSize} /></div>
                {tags.map((t) => (
                    <div key={t} onClick={() => show(tagQuery(t))} title={t} className={`${mini} ${current === t ? 'bg-[#D3E3FD] dark:bg-white/20' : idle}`}>
                        <MdLabel size={iconSize} style={{ color: colorFor(t) }} />
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className='w-64 flex-none overflow-y-auto pr-3 text-sm select-none'>
            <div className='pb-4 pt-1'>
                <button onClick={() => dispatch(setOpen(true))} className='flex items-center gap-3 bg-[#C2E7FF] dark:bg-white dark:text-[#1f1f1f] pl-5 pr-7 h-14 rounded-2xl font-medium hover:shadow-md'>
                    <LuPencil size={"20px"} />
                    Compose
                </button>
            </div>
            <div onClick={() => show('')} className={`${row} ${!searchText ? active : idle}`}>
                <MdInbox size={iconSize} />
                <p className='flex-1'>Inbox</p>
                {unread > 0 && <span className='text-xs font-bold'>{unread.toLocaleString()}</span>}
            </div>
            {
                sidebarItems.map((item) => (
                    <div key={item.text} className={`${row} ${idle}`}>
                        {item.icon}
                        <p className='flex-1'>{item.text}</p>
                    </div>
                ))
            }
            <div className='flex items-center justify-between pl-6 pr-4 mt-5 mb-2'>
                <h2 className='text-base font-medium'>Labels</h2>
                <MdAdd size={iconSize} className='cursor-pointer' />
            </div>
            {tags.length === 0 && <p className='pl-6 text-xs text-gray-500 dark:text-gray-400'>No labels (Mailpit tags)</p>}
            {
                tags.map((t) => (
                    <div key={t} onClick={() => show(tagQuery(t))} className={`${row} ${current === t ? active : idle}`}>
                        <MdLabel size={iconSize} style={{ color: colorFor(t) }} />
                        <p className='flex-1 truncate'>{t}</p>
                    </div>
                ))
            }
        </div>
    )
}

export default Sidebar
