import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { IoMdArrowBack } from "react-icons/io";
import {
  MdDeleteOutline, MdOutlineMarkEmailUnread, MdAttachFile, MdOutlineArchive, MdOutlineReport,
  MdOutlineWatchLater, MdOutlineAddTask, MdOutlineDriveFileMove, MdOutlineLabel, MdMoreVert,
  MdKeyboardArrowLeft, MdKeyboardArrowRight, MdUnfoldMore, MdPrint, MdOpenInNew, MdStarBorder,
  MdInsertEmoticon, MdReply, MdArrowDropDown, MdClose, MdForward, MdPerson,
} from "react-icons/md";
import { motion } from "framer-motion"
import { getMessage, deleteMessages, setRead, addressLine, fullDate, colorFor } from '../api';
import { setOpen } from '../redux/appSlice';

const iconBtn = 'p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer disabled:opacity-30 disabled:cursor-default';
const pill = 'flex items-center gap-2 border border-gray-500 rounded-full px-4 h-9 text-sm font-medium hover:bg-gray-100';
const sep =<div className='w-px h-5 mx-2 bg-gray-300 dark:bg-gray-600' />;

const Mail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list } = useSelector(store => store.app);
  const [mail, setMail] = useState(null);
  const [error, setError] = useState(null);
  const [details, setDetails] = useState(false);
  const frame = useRef(null);

  // Fetching a message also marks it read in Mailpit.
  useEffect(() => {
    setMail(null);
    setError(null);
    getMessage(id).then(setMail).catch((e) => setError(e.message));
  }, [id]);

  // Prev/next within the inbox page the user came from.
  const pos = list.ids.indexOf(id);
  const go = (d) => navigate(`/mail/${list.ids[pos + d]}`);

  const remove = async () => {
    await deleteMessages([id]);
    navigate("/");
  }
  const markUnread = async () => {
    await setRead([id], false);
    navigate("/");
  }
  const print = () => mail?.HTML ? frame.current?.contentWindow.print() : window.print();
  const reply = () => dispatch(setOpen({
    to: mail.ReplyTo?.[0]?.Address || mail.From?.Address || '',
    subject: /^re:/i.test(mail.Subject) ? mail.Subject : `Re: ${mail.Subject}`,
  }));
  const forward = () => dispatch(setOpen({
    to: '',
    subject: /^fwd?:/i.test(mail.Subject) ? mail.Subject : `Fwd: ${mail.Subject}`,
    message: [
      '', '', '---------- Forwarded message ---------',
      `From: ${sender} <${mail.From?.Address}>`,
      `Date: ${new Date(mail.Date).toString()}`,
      `Subject: ${mail.Subject}`,
      `To: ${(mail.To || []).map(a => a.Address).join(', ')}`,
      '', mail.Text || '',
    ].join('\n'),
  }));
  // Size the sandboxed iframe to its content so the page scrolls, not the iframe.
  // Re-fit when late content (images, fonts) changes the height.
  const fit = (e) => {
    const el = e.target, doc = el.contentDocument;
    if (!doc) return;
    // No padding added: with body{height:100%} emails that would grow forever.
    const resize = () => {
      const h = doc.documentElement.scrollHeight;
      if (Math.abs(h - el.offsetHeight) > 1) el.style.height = h + 'px';
    };
    resize();
    new el.contentWindow.ResizeObserver(resize).observe(doc.body);
  }
  const sender = mail?.From?.Name || mail?.From?.Address || '?';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className='flex-1 min-w-0 min-h-0 flex flex-col'>
      <div className='flex items-center justify-between h-12 flex-none px-3 pr-6 text-gray-700 dark:text-gray-300'>
        <div className='flex items-center'>
          <div onClick={() => navigate("/")} className={iconBtn} title="Back to Inbox"><IoMdArrowBack size={"20px"} /></div>
          {sep}
          <div className={iconBtn} title="Archive"><MdOutlineArchive size={"20px"} /></div>
          <div className={iconBtn} title="Report spam"><MdOutlineReport size={"20px"} /></div>
          <div onClick={remove} className={iconBtn} title="Delete"><MdDeleteOutline size={"20px"} /></div>
          {sep}
          <div onClick={markUnread} className={iconBtn} title="Mark as unread"><MdOutlineMarkEmailUnread size={"20px"} /></div>
          <div className={iconBtn} title="Snooze"><MdOutlineWatchLater size={"20px"} /></div>
          <div className={iconBtn} title="Add to Tasks"><MdOutlineAddTask size={"20px"} /></div>
          {sep}
          <div className={iconBtn} title="Move to"><MdOutlineDriveFileMove size={"20px"} /></div>
          <div className={iconBtn} title="Labels"><MdOutlineLabel size={"20px"} /></div>
          <div className={iconBtn} title="More"><MdMoreVert size={"20px"} /></div>
        </div>
        <div className='flex items-center gap-1'>
          {pos >= 0 && <p className='text-xs text-gray-600 dark:text-gray-400 mr-2'>{list.start + pos + 1} of {list.total.toLocaleString()}</p>}
          <button disabled={pos <= 0} onClick={() => go(-1)} className={iconBtn} title="Newer"><MdKeyboardArrowLeft size={"20px"} /></button>
          <button disabled={pos < 0 || pos >= list.ids.length - 1} onClick={() => go(1)} className={iconBtn} title="Older"><MdKeyboardArrowRight size={"20px"} /></button>
        </div>
      </div>
      {/* Gmail keeps the conversation light even in dark theme. */}
      <div className='light flex-1 min-h-0 overflow-y-auto px-4 pb-6 bg-white text-[#1f1f1f]'>
        {error && <p className='text-red-600 text-sm p-4'>Cannot load message: {error}</p>}
        {mail && (
          <>
            <div className='flex justify-between items-start gap-4 pl-14 pt-4 pb-2'>
              <div className='flex flex-wrap items-center gap-2'>
                <h1 className='text-[22px] leading-7'>{mail.Subject || '(no subject)'}</h1>
                <span className='flex items-center gap-1 text-xs bg-gray-200 dark:bg-gray-700 rounded px-1.5 py-0.5'>Inbox <MdClose size="12px" /></span>
                {mail.Tags?.map(t => <span key={t} className='text-xs rounded px-1.5 py-0.5 text-white' style={{ background: colorFor(t) }}>{t}</span>)}
              </div>
              <div className='flex items-center text-gray-700 dark:text-gray-300'>
                <div className={iconBtn} title="Expand all"><MdUnfoldMore size={"20px"} /></div>
                <div onClick={print} className={iconBtn} title="Print all"><MdPrint size={"20px"} /></div>
                <a href={`/view/${id}.html`} target="_blank" rel="noreferrer" className={iconBtn} title="In new window"><MdOpenInNew size={"20px"} /></a>
              </div>
            </div>
            <div className='flex items-start gap-4 mt-3'>
              {/* Gmail's default avatar for senders without a profile photo. */}
              <div className='w-10 h-10 flex-none rounded-full bg-[#A8C7FA] overflow-hidden flex items-end justify-center'>
                <MdPerson size="38px" className='text-[#5383EC] -mb-1.5' />
              </div>
              <div className='flex-1 min-w-0 text-sm relative'>
                <div className='flex justify-between items-center gap-4'>
                  <p className='truncate'>
                    <span className='font-bold'>{sender}</span>
                    {mail.From?.Name && <span className='text-xs text-gray-600 dark:text-gray-400'> &lt;{mail.From.Address}&gt;</span>}
                  </p>
                  <div className='flex items-center flex-none text-gray-700 dark:text-gray-300'>
                    <p className='text-xs text-gray-600 dark:text-gray-400 mr-2'>{fullDate(mail.Date)}</p>
                    <div className={iconBtn} title="Star"><MdStarBorder size={"20px"} /></div>
                    <div className={iconBtn} title="Add reaction"><MdInsertEmoticon size={"20px"} /></div>
                    <div onClick={reply} className={iconBtn} title="Reply"><MdReply size={"20px"} /></div>
                    <div className={iconBtn} title="More"><MdMoreVert size={"20px"} /></div>
                  </div>
                </div>
                <p onClick={() => setDetails(!details)} className='inline-flex items-center text-xs text-gray-600 dark:text-gray-400 cursor-pointer'>
                  to {addressLine(mail.To) || 'undisclosed recipients'} <MdArrowDropDown size="18px" />
                </p>
                {details && (
                  <div className='absolute z-20 mt-1 p-3 rounded-lg shadow-lg bg-white dark:bg-[#2d2e30] text-xs grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 max-w-xl'>
                    <span className='text-gray-500 text-right'>from:</span><span>{sender} &lt;{mail.From?.Address}&gt;</span>
                    <span className='text-gray-500 text-right'>to:</span><span>{(mail.To || []).map(a => a.Address).join(', ')}</span>
                    {mail.Cc?.length > 0 && <><span className='text-gray-500 text-right'>cc:</span><span>{mail.Cc.map(a => a.Address).join(', ')}</span></>}
                    <span className='text-gray-500 text-right'>date:</span><span>{new Date(mail.Date).toLocaleString()}</span>
                    <span className='text-gray-500 text-right'>subject:</span><span>{mail.Subject}</span>
                  </div>
                )}
              </div>
            </div>
            <div className='mt-4 pl-14'>
              {mail.HTML
                ? <iframe ref={frame} sandbox="allow-same-origin allow-popups allow-modals" src={`/view/${id}.html`} onLoad={fit} className='w-full border-0 bg-white rounded-lg' title="message" />
                : <pre className='whitespace-pre-wrap font-sans text-sm'>{mail.Text}</pre>}
            </div>
            {mail.Attachments?.length > 0 && (
              <div className='mt-6 pl-14 flex flex-wrap gap-3'>
                {mail.Attachments.map((a) => (
                  <a key={a.PartID} href={`/api/v1/message/${id}/part/${a.PartID}`} target="_blank" rel="noreferrer"
                    className='flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/10'>
                    <MdAttachFile /> {a.FileName}
                  </a>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      {mail && (
        <div className='light flex-none flex items-center gap-3 pl-[72px] py-4 bg-white border-t border-gray-200 text-[#1f1f1f]'>
          <button onClick={reply} className={pill}><MdReply size="18px" /> Reply</button>
          <button onClick={forward} className={pill}><MdForward size="18px" /> Forward</button>
          <button className='w-9 h-9 flex items-center justify-center border border-gray-500 rounded-full hover:bg-gray-100'><MdInsertEmoticon size="20px" /></button>
        </div>
      )}
    </motion.div>
  )
}

export default Mail
