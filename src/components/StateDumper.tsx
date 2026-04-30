import { useEffect, useState } from 'react';

export function StateDumper() {
  const [json, setJson] = useState<string>('loading...');
  useEffect(() => {
    const req = indexedDB.open('cardnews-designer', 1);
    req.onsuccess = () => {
      try {
        const tx = req.result.transaction('saves', 'readonly');
        const g = tx.objectStore('saves').get('current');
        g.onsuccess = () => {
          setJson(JSON.stringify(g.result));
        };
        g.onerror = () => setJson('ERROR_GET');
      } catch (e) {
        setJson('ERROR_TX:' + String(e));
      }
    };
    req.onerror = () => setJson('ERROR_OPEN');
  }, []);
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999999, background: '#000', color: '#0f0', padding: 8, fontSize: 10, maxHeight: '50vh', overflow: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontFamily: 'monospace' }}>
      <div data-state-dump-start>===STATE_DUMP_START===</div>
      <div id="state-dump-content">{json}</div>
      <div data-state-dump-end>===STATE_DUMP_END===</div>
    </div>
  );
}
