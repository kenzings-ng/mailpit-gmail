import React, { useCallback, useEffect, useState } from 'react'
import { MdCropSquare, MdCheckBox, MdArrowDropDown, MdMoreVert, MdDeleteOutline, MdOutlineMarkEmailRead, MdOutlineMarkEmailUnread } from "react-icons/md";
import { FaUserFriends } from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdInbox } from "react-icons/md";
import { GoTag } from "react-icons/go";
import Messages from './Messages';
import { useDispatch, useSelector } from 'react-redux';
import { setInbox } from '../redux/appSlice';
import { listMessages, deleteMessages, setRead, subscribe, PAGE_SIZE } from '../api';

// Visual only; Mailpit has no categories.
const mailType = [
    {
        icon: <MdInbox size={"20px"} />,
        text: "Primary",
    },
    {
        icon: <GoTag size={"20px"} />,
        text: "Promotions",
    },
    {
        icon: <FaUserFriends size={"20px"} />,
        text: "Social",
    },
];

const iconBtn = 'p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer';

const Inbox = () => {
    const [mailTypeSelected, setMailTypeSelected] = useState(0);
    const { searchText } = useSelector(store => store.app);
    const [start, setStart] = useState(0);
    const [data, setData] = useState({ messages: [], messages_count: 0 });
    const [selected, setSelected] = useState(new Set());
    const [error, setError] = useState(null);
    const dispatch = useDispatch();

    const load = useCallback(() => {
        listMessages(start, searchText)
            .then((d) => {
                setData(d);
                setError(null);
                dispatch(setInbox({ unread: d.unread, tags: d.tags, list: { ids: d.messages.map(m => m.ID), start, total: d.messages_count } }));
                document.title = d.unread ? `Inbox (${d.unread.toLocaleString()}) - Gmail` : 'Inbox - Gmail';
            })
            .catch((e) => setError(e.message));
    }, [start, searchText]);

    useEffect(() => { setStart(0); }, [searchText]);
    useEffect(() => { load(); }, [load]);
    // Any server event (new mail, delete, read state) -> reload the current page.
    useEffect(() => subscribe(load), [load]);

    const total = data.messages_count;
    const ids = data.messages.map(m => m.ID);
    const allChecked = ids.length > 0 && ids.every(id => selected.has(id));
    const toggle = (id) => setSelected((s) => {
        const n = new Set(s);
        n.has(id) ? n.delete(id) : n.add(id);
        return n;
    });
    const act = async (fn) => {
        await fn([...selected]);
        setSelected(new Set());
        load();
    };

    return (
        <div className='flex-1 min-w-0 min-h-0 flex flex-col'>
            <div className='flex items-center justify-between px-3 pr-6 h-12 flex-none'>
                <div className='flex items-center gap-1 text-gray-700 dark:text-gray-300'>
                    <div className='flex items-center pl-1 cursor-pointer' onClick={() => setSelected(allChecked ? new Set() : new Set(ids))}>
                        {allChecked ? <MdCheckBox size={"20px"} /> : <MdCropSquare size={"20px"} />}
                        <MdArrowDropDown size={"18px"} />
                    </div>
                    {selected.size === 0 ? (
                        <div className={iconBtn} title="Refresh" onClick={load}>
                            <IoMdRefresh size={"20px"} />
                        </div>
                    ) : (
                        <>
                            <div className={iconBtn} title="Delete" onClick={() => act(deleteMessages)}>
                                <MdDeleteOutline size={"20px"} />
                            </div>
                            <div className={iconBtn} title="Mark as read" onClick={() => act((s) => setRead(s, true))}>
                                <MdOutlineMarkEmailRead size={"20px"} />
                            </div>
                            <div className={iconBtn} title="Mark as unread" onClick={() => act((s) => setRead(s, false))}>
                                <MdOutlineMarkEmailUnread size={"20px"} />
                            </div>
                        </>
                    )}
                    <div className={iconBtn}>
                        <MdMoreVert size={"20px"} />
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <p className='text-xs text-gray-600 dark:text-gray-400'>{total ? `${start + 1}-${Math.min(start + PAGE_SIZE, total)} of ${total.toLocaleString()}` : '0'}</p>
                    <button disabled={start === 0} onClick={() => setStart(start - PAGE_SIZE)} className='p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-30'><MdKeyboardArrowLeft size={"20px"} /></button>
                    <button disabled={start + PAGE_SIZE >= total} onClick={() => setStart(start + PAGE_SIZE)} className='p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-30'><MdKeyboardArrowRight size={"20px"} /></button>
                </div>
            </div>
            <div className='flex-1 min-h-0 overflow-y-auto'>
                <div className='flex items-center border-b border-gray-200 dark:border-gray-700'>
                    {
                        mailType.map((item, index) =>
                            <button
                                key={index}
                                className={`flex items-center gap-4 px-4 h-14 text-sm font-medium ${mailTypeSelected === index ? 'border-b-[3px] border-b-blue-600 text-blue-600 dark:border-b-[#a8c7fa] dark:text-[#a8c7fa]' : 'border-b-[3px] border-b-transparent text-gray-600 dark:text-gray-400'} w-60 hover:bg-gray-100 dark:hover:bg-white/10`}
                                onClick={() => {
                                    setMailTypeSelected(index)
                                }}
                            >
                                {item.icon}
                                <span>{item.text}</span>
                            </button>
                        )
                    }
                </div>
                {error && <p className='p-4 text-red-600 text-sm'>Cannot reach Mailpit: {error}</p>}
                {!error && total === 0 && <p className='p-10 text-center text-gray-500 dark:text-gray-400'>No messages</p>}
                <Messages messages={data.messages} selected={selected} onToggle={toggle} />
            </div>
        </div>
    )
}

export default Inbox
