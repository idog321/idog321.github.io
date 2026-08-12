/* Local-only inline commenting for the manual.
   Select any text on a chapter page, hit the button, type a note.
   It POSTs to scripts/comment-server.mjs, which appends to notes/MANUAL-COMMENTS.md
   with the chapter, the heading you were under, and the exact text you selected.
   No-ops anywhere that isn't localhost, so it can never do anything in production. */
(() => {
  if (!['localhost', '127.0.0.1'].includes(location.hostname)) return;

  const ENDPOINT = 'http://localhost:4399/note';
  const css = `
    #tk-cbtn{position:absolute;z-index:99;font:600 12px/1 system-ui;padding:6px 10px;
      border:0;border-radius:6px;background:#ff9f0a;color:#111;cursor:pointer;
      box-shadow:0 2px 8px rgba(0,0,0,.4)}
    #tk-cbox{position:fixed;inset:auto 1.5rem 1.5rem auto;z-index:100;width:min(26rem,90vw);
      background:#1c1c1e;color:#eee;border:1px solid #ff9f0a;border-radius:10px;padding:1rem;
      font:14px/1.5 system-ui;box-shadow:0 8px 32px rgba(0,0,0,.5)}
    #tk-cbox blockquote{margin:0 0 .6rem;padding-left:.6rem;border-left:3px solid #ff9f0a;
      color:#aaa;font-size:12px;max-height:5rem;overflow:auto}
    #tk-cbox textarea{width:100%;height:6rem;background:#111;color:#eee;border:1px solid #444;
      border-radius:6px;padding:.5rem;font:inherit;resize:vertical}
    #tk-cbox .err{font:600 12px/1.4 system-ui;color:#111;background:#ff9f0a;
      border-radius:6px;padding:.5rem .6rem;margin-bottom:.5rem}
    #tk-cbox .fence{font:600 11px system-ui;color:#7fd18c;margin-bottom:.5rem}
    #tk-cbox .tags{display:flex;flex-wrap:wrap;gap:.3rem;margin-bottom:.5rem}
    #tk-cbox .tk-tag{font:500 11px system-ui;padding:.25rem .5rem;border:1px solid #444;
      border-radius:999px;background:#262629;color:#bbb;cursor:pointer}
    #tk-cbox .tk-tag:hover{border-color:#ff9f0a;color:#ff9f0a}
    #tk-cbox .tk-tag.is-on{background:#ff9f0a;border-color:#ff9f0a;color:#111}
    #tk-cbox .row{display:flex;gap:.5rem;justify-content:flex-end;margin-top:.6rem}
    #tk-cbox button{font:600 13px system-ui;padding:.4rem .9rem;border:0;border-radius:6px;cursor:pointer}
    #tk-save{background:#ff9f0a;color:#111} #tk-cancel{background:#333;color:#ccc}
    #tk-toast{position:fixed;bottom:1.5rem;right:1.5rem;z-index:101;background:#1c1c1e;
      color:#ff9f0a;border:1px solid #ff9f0a;border-radius:8px;padding:.6rem 1rem;
      font:600 13px system-ui}`;
  document.head.appendChild(document.createElement('style')).textContent = css;

  let btn;
  const kill = () => { btn?.remove(); btn = null; };

  // Which platform fence, if any, the selection sits inside. In "All" mode a
  // fenced block is styled exactly like ordinary prose — deliberately — so
  // there is otherwise no way to tell from the page that it is already tagged.
  const fenceFor = (node) => {
    const el = node.nodeType === 3 ? node.parentElement : node;
    const block = el?.closest('[data-platform]');
    const v = block?.getAttribute('data-platform');
    return v === 'ios' ? 'iPhone' : v === 'mac' ? 'Mac' : '';
  };

  const headingFor = (node) => {
    let el = node.nodeType === 3 ? node.parentElement : node;
    while (el && el !== document.body) {
      for (let s = el.previousElementSibling; s; s = s.previousElementSibling) {
        if (/^H[1-4]$/.test(s.tagName)) return s.textContent.trim();
      }
      el = el.parentElement;
    }
    return '';
  };

  const toast = (msg) => {
    const t = document.body.appendChild(document.createElement('div'));
    t.id = 'tk-toast'; t.textContent = msg;
    setTimeout(() => t.remove(), 2200);
  };

  document.addEventListener('mouseup', () => {
    setTimeout(() => {
      const sel = window.getSelection();
      const quote = sel?.toString().trim();
      kill();
      if (!quote || quote.length < 3) return;
      if (!sel.anchorNode?.parentElement?.closest('.sl-markdown-content')) return;

      const r = sel.getRangeAt(0).getBoundingClientRect();
      btn = document.body.appendChild(document.createElement('button'));
      btn.id = 'tk-cbtn'; btn.textContent = '✎ Comment';
      btn.style.top = `${r.bottom + scrollY + 6}px`;
      btn.style.left = `${r.left + scrollX}px`;
      btn.onmousedown = (e) => { e.preventDefault(); e.stopPropagation(); open(quote, headingFor(sel.anchorNode), fenceFor(sel.anchorNode)); };
    }, 10);
  });

  function open(quote, heading, fence) {
    kill();
    document.getElementById('tk-cbox')?.remove();
    const box = document.body.appendChild(document.createElement('div'));
    box.id = 'tk-cbox';
    // One-click versions of the notes Nikolay has written most often. Clicking
    // one fills the box; several can be stacked, and free text still works.
    const TAGS = [
      ['Too flowery', 'Too flowery — say it plainly.'],
      ['Verify', 'Verify this against the source. I do not think it is true.'],
      ['Too long', 'Too long. Cut it down.'],
      ['Inconsistent', 'Inconsistent with how this is said elsewhere.'],
      ['Mac only', 'Mac only — put this inside a :::mac fence so it hides when the toggle is set to iPhone. Sweep the manual for others like it.'],
      ['iPhone only', 'iPhone only — put this inside a :::ios fence so it hides when the toggle is set to Mac. Sweep the manual for others like it.'],
      ['Wrong name', 'That is not what the control is called in the app.'],
      ['Screenshot', 'A screenshot belongs here.'],
      ['Delete', 'Delete this.'],
    ];
    box.innerHTML = `${fence ? `<div class="fence">already ${fence}-only</div>` : ''}<blockquote></blockquote>
      <div class="tags">${TAGS.map(([label], i) =>
        `<button type="button" class="tk-tag" data-i="${i}">${label}</button>`).join('')}</div>
      <textarea placeholder="What's wrong with this? (⌘↵ to save)"></textarea>
      <div class="row"><button id="tk-cancel">Cancel</button><button id="tk-save">Save note</button></div>`;
    box.querySelector('blockquote').textContent = quote;
    const ta = box.querySelector('textarea');
    box.querySelectorAll('.tk-tag').forEach((btn) => {
      btn.onclick = () => {
        const text = TAGS[+btn.dataset.i][1];
        ta.value = ta.value.trim() ? `${ta.value.trim()} ${text}` : text;
        btn.classList.add('is-on');
        ta.focus();
      };
    });
    ta.focus();

    // Never destroy the note before it is safely stored. An earlier version
    // removed the box first, so a POST to a dead comment server silently ate
    // whatever had been typed and showed a toast that was gone in two seconds.
    const save = async () => {
      const note = ta.value.trim();
      if (!note) return;
      const fail = (msg) => {
        navigator.clipboard?.writeText(note).catch(() => {});
        let e = box.querySelector('.err');
        if (!e) {
          e = document.createElement('div');
          e.className = 'err';
          box.insertBefore(e, box.querySelector('textarea'));
        }
        e.textContent = `${msg} Your note is still here, and copied to the clipboard. Run ./manual.sh and press Save again.`;
      };
      let res;
      try {
        res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chapter: location.pathname, heading, quote, note }),
        });
      } catch {
        return fail('Comment server is not running.');
      }
      if (!res.ok) return fail(`Comment server returned ${res.status}.`);
      box.remove();
      toast('Saved to notes/MANUAL-COMMENTS.md');
      getSelection().removeAllRanges();
    };
    box.querySelector('#tk-save').onclick = save;
    box.querySelector('#tk-cancel').onclick = () => box.remove();
    ta.onkeydown = (e) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) save();
      if (e.key === 'Escape') box.remove();
    };
  }
})();
