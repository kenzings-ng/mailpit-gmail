import React, { useEffect, useState } from 'react'
import { RxCross2 } from "react-icons/rx";
import { MdMinimize, MdOpenInFull, MdArrowDropDown, MdFormatColorText, MdAttachFile, MdLink, MdInsertEmoticon, MdOutlineAddToDrive, MdOutlineImage, MdOutlineLock, MdOutlineCreate, MdMoreVert, MdDeleteOutline } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { setOpen } from '../redux/appSlice';
import { sendMessage } from '../api';

const empty = { recipients: "", subject: "", message: "" };

const SendEmail = () => {
    const [formData, setFormData] = useState(empty);
    const [error, setError] = useState(null);
    const [sending, setSending] = useState(false);
    const { open, draft } = useSelector(store => store.app);
    const dispatch = useDispatch();

    // Reply / Forward prefill.
    useEffect(() => {
        if (draft) setFormData({ recipients: draft.to || "", subject: draft.subject || "", message: draft.message || "" });
    }, [draft]);

    const changeEventHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const close = () => {
        dispatch(setOpen(false));
        setError(null);
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            await sendMessage({ to: formData.recipients, subject: formData.subject, text: formData.message });
            setFormData(empty);
            close();
        } catch (err) {
            setError(err.message);
        } finally {
            setSending(false);
        }
    }

    return (
        <div className={`${open ? 'block' : 'hidden'} bg-white dark:bg-[#2d2e30] shadow-2xl rounded-t-lg text-sm`}>
            <div className='flex px-4 py-2 bg-[#F2F6FC] dark:bg-[#3c4043] items-center justify-between rounded-t-lg'>
                <h1 className='font-medium'>New Message</h1>
                <div className='flex items-center gap-1 text-gray-600 dark:text-gray-400'>
                    <div className='p-1 rounded hover:bg-gray-200 dark:hover:bg-white/10 cursor-pointer'><MdMinimize /></div>
                    <div className='p-1 rounded hover:bg-gray-200 dark:hover:bg-white/10 cursor-pointer'><MdOpenInFull /></div>
                    <div onClick={close} className='p-1 rounded hover:bg-gray-200 dark:hover:bg-white/10 cursor-pointer'><RxCross2 /></div>
                </div>
            </div>
            <form onSubmit={submitHandler} className='flex flex-col px-4'>
                <input onChange={changeEventHandler} name="recipients" value={formData.recipients} type="text" placeholder='To' required className='bg-transparent outline-none py-2 border-b border-gray-200 dark:border-gray-700' />
                <input onChange={changeEventHandler} name="subject" value={formData.subject} type="text" placeholder='Subject' className='bg-transparent outline-none py-2 border-b border-gray-200 dark:border-gray-700' />
                <textarea onChange={changeEventHandler} name="message" value={formData.message} rows="14" className='bg-transparent outline-none py-2 resize-none'></textarea>
                {error && <p className='text-red-600 text-xs pb-2'>{error}</p>}
                <div className='flex items-center justify-between py-3'>
                    <div className='flex items-center gap-3 text-gray-600 dark:text-gray-400'>
                        <div className='flex items-center bg-[#0B57D0] rounded-full text-white font-medium'>
                            <button type='submit' disabled={sending} className='pl-5 pr-3 py-2 disabled:opacity-60'>{sending ? 'Sending…' : 'Send'}</button>
                            <span className='border-l border-blue-300 px-1 py-2'><MdArrowDropDown size="18px" /></span>
                        </div>
                        {[MdFormatColorText, MdAttachFile, MdLink, MdInsertEmoticon, MdOutlineAddToDrive, MdOutlineImage, MdOutlineLock, MdOutlineCreate, MdMoreVert].map((Icon, i) => <Icon key={i} size="18px" className='cursor-pointer' />)}
                    </div>
                    <MdDeleteOutline size="18px" onClick={close} className='text-gray-600 dark:text-gray-400 cursor-pointer' />
                </div>
            </form>
        </div>
    )
}

export default SendEmail
