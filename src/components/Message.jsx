import React from 'react'
import { MdCropSquare, MdCheckBox, MdAttachFile } from "react-icons/md";
import { RiStarLine } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatDate } from '../api';

const Message = ({ email, checked, onToggle }) => {
    const navigate = useNavigate();
    const unread = !email.Read;
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => navigate(`/mail/${email.ID}`)}
            className={`flex items-center h-10 border-b border-gray-100 dark:border-gray-800 px-3 text-sm cursor-pointer hover:shadow-[inset_1px_0_0_#dadce0,inset_-1px_0_0_#dadce0,0_1px_2px_0_rgba(60,64,67,.3)] dark:hover:shadow-[0_1px_3px_0_rgba(0,0,0,.6)] hover:z-10 relative ${unread ? 'bg-white dark:bg-[#131314]' : 'bg-[#F2F6FC] dark:bg-[#1e1f20]'}`}>
            <div onClick={(e) => { e.stopPropagation(); onToggle(email.ID) }} className={`flex-none p-1 ${checked ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}>
                {checked ? <MdCheckBox className="w-5 h-5" /> : <MdCropSquare className="w-5 h-5" />}
            </div>
            <div className="flex-none p-1 text-gray-400 dark:text-gray-500">
                <RiStarLine className="w-5 h-5" />
            </div>
            <h1 className={`flex-none w-48 truncate pl-2 ${unread ? 'font-bold' : ''}`}>{email.From?.Name || email.From?.Address}</h1>
            <div className="flex-1 min-w-0 truncate pl-4">
                <span className={unread ? 'font-bold' : ''}>{email.Subject || '(no subject)'}</span>
                <span className="text-gray-500 dark:text-gray-400"> - {email.Snippet}</span>
            </div>
            {email.Attachments > 0 && <MdAttachFile className="flex-none w-4 h-4 ml-3 text-gray-500 dark:text-gray-400" />}
            <p className={`flex-none w-20 text-right text-xs ${unread ? 'font-bold' : 'text-gray-600 dark:text-gray-400'}`}>{formatDate(email.Created)}</p>
        </motion.div>
    )
}

export default Message
