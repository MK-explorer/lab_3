import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Toast() {
  const { toast } = useApp();
  const [visible, setVisible] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (toast) { setMsg(toast); setVisible(true); }
    else        { setVisible(false); }
  }, [toast]);

  return (
    <div className={`toast${visible ? ' visible' : ''}`} role="status" aria-live="polite">
      {msg}
    </div>
  );
}