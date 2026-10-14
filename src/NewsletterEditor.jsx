import React, { useState } from 'react';

const initialBlocks = [
  {
    id: 1,
    type: 'description',
    text: 'Welcome to this issue of [newsletter name]. Here is a quick introduction to the news, ideas, and updates we are sharing this month.',
  },
  { id: 2, type: 'header', text: 'What you need to know' },
  {
    id: 3,
    type: 'description',
    text: 'Use this space for the most important announcement or update. Add the key details readers need, and explain what they should do next.',
  },
  { id: 4, type: 'link', label: 'READ THE FULL UPDATE', url: 'https://example.com' },
  { id: 5, type: 'header', text: 'A closer look' },
  {
    id: 6,
    type: 'description',
    text: 'Expand on the announcement with useful context, practical advice, or a short story from your community. Keep it focused on what matters to your readers.',
  },
  { id: 7, type: 'quote', text: '“Add a memorable quote, reader comment, or takeaway from this issue.”' },
  {
    id: 8,
    type: 'description',
    text: 'Close with a helpful reminder or a simple next step. Thank your readers for being here, and let them know where they can find more information.',
  },
];

const blockLabels = {
  description: 'Description',
  header: 'Section header',
  paragraph: 'Paragraph',
  link: 'Link',
  quote: 'Quote',
};

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

function renderInlineBlock(block) {
  const text = escapeHtml(block.text || '').replace(/\r\n|\r|\n/g, '<br>');

  if (block.type === 'header') return `<h4 style="color: #ff8000;">${text}</h4>`;
  if (block.type === 'link') {
    const label = escapeHtml(block.label || 'Link text');
    const url = /^https?:\/\//i.test(block.url) ? ` href="${escapeHtml(block.url)}"` : '';
    return `<br><a${url} style="color: #22d3ee; text-decoration: none; text-shadow: 0 0 8px rgba(34, 211, 238, 0.8);">${label}</a>`;
  }
  if (block.type === 'quote') return `<br><blockquote>${text}</blockquote>`;
  return `<br>${text}`;
}

function buildInlineNewsletterHtml(title, subtitle, blocks) {
  const date = new Date();
  const displayDate = date.toLocaleDateString('en-US');
  const contentBlocks = blocks.map(renderInlineBlock).join('\n        ');

  return `<div class="newsletter" style="background-color: #000000; padding: 25px; border-radius: 10px; border: 3px solid #ff8000; color: #ffffff; width: clamp(200px, 90%, 550px); margin: 0 auto; line-height: 150%;">
    <div class="header">
        <span style="font-style: italic;"><span style="color:#ff8000">$$$</span> Offshore Newsletter <span style="float: right;">${displayDate}</span></span>
    </div>
    <div class="content">
        <h2 style="color: #ff8000;">${escapeHtml(title || 'Untitled newsletter')}</h2>
        ${escapeHtml(subtitle || '')}
        ${contentBlocks}
    </div>
    <div class="footer" style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 20px; padding-top: 12px; border-top: 2px solid #ff8000; color: #ff8000; font-weight: bold;">
        <a href="https://www.torn.com/forums.php#!p=forums&f=999&b=1&a=57866" style="text-shadow: 0 0 8px rgba(34, 211, 238, 0.8); color: #ff8000; text-decoration: none;">Forum</a>
        <span class="star" style="color: #ff8000; font-size: 18px; line-height: 1;">*</span>
        <a href="https://discord.gg/jEFjVqZxRG" style="text-shadow: 0 0 8px rgba(34, 211, 238, 0.8); color: #ff8000; text-decoration: none;">Discord</a>
    </div>
</div>`;
}

function NewsletterEditor() {
  const [title, setTitle] = useState('Your newsletter title');
  const [subtitle, setSubtitle] = useState('A short subtitle that sets the tone for this issue.');
  const [blocks, setBlocks] = useState(initialBlocks);
  const [nextId, setNextId] = useState(initialBlocks.length + 1);
  const [copyStatus, setCopyStatus] = useState('');

  async function copyNewsletterHtml() {
    try {
      await navigator.clipboard.writeText(buildInlineNewsletterHtml(title, subtitle, blocks));
      setCopyStatus('Copied');
    } catch {
      setCopyStatus('Copy failed');
    }
  }

  function addBlock(type) {
    const newBlock = type === 'link'
      ? { id: nextId, type, label: 'New link', url: 'https://' }
      : { id: nextId, type, text: '' };
    setBlocks((current) => [...current, newBlock]);
    setNextId((current) => current + 1);
  }

  function updateBlock(id, field, value) {
    setBlocks((current) => current.map((block) => (
      block.id === id ? { ...block, [field]: value } : block
    )));
  }

  function moveBlock(index, direction) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;

    setBlocks((current) => {
      const updated = [...current];
      [updated[index], updated[targetIndex]] = [updated[targetIndex], updated[index]];
      return updated;
    });
  }

  function removeBlock(id) {
    setBlocks((current) => current.filter((block) => block.id !== id));
  }

  return (
    <div className="newsletter-editor">
      <div className="editor-controls">
        <div className="editor-topline">
          <p className="eyebrow">COMPOSE <span>/ LIVE PREVIEW</span></p>
          <span className="editor-save-state"><span /> Changes update instantly</span>
        </div>

        <label className="editor-field">
          <span>Newsletter title</span>
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Give this issue a title" />
        </label>
        <label className="editor-field">
          <span>Subtitle</span>
          <input value={subtitle} onChange={(event) => setSubtitle(event.target.value)} placeholder="Add a short description" />
        </label>

        <div className="block-list-heading">
          <h3>Content blocks</h3>
          <span>{blocks.length} {blocks.length === 1 ? 'block' : 'blocks'}</span>
        </div>

        <div className="editor-block-list">
          {blocks.map((block, index) => (
            <section className="editor-block" key={block.id}>
              <div className="editor-block-head">
                <span className="block-type"><span>{String(index + 1).padStart(2, '0')}</span>{blockLabels[block.type]}</span>
                <div className="block-actions">
                  <button type="button" aria-label={`Move ${blockLabels[block.type]} up`} disabled={index === 0} onClick={() => moveBlock(index, -1)}>↑</button>
                  <button type="button" aria-label={`Move ${blockLabels[block.type]} down`} disabled={index === blocks.length - 1} onClick={() => moveBlock(index, 1)}>↓</button>
                  <button type="button" className="remove-block" aria-label={`Remove ${blockLabels[block.type]}`} onClick={() => removeBlock(block.id)}>×</button>
                </div>
              </div>
              {block.type === 'link' ? (
                <div className="link-block-fields">
                  <input aria-label="Link text" value={block.label} onChange={(event) => updateBlock(block.id, 'label', event.target.value)} placeholder="Link text" />
                  <input aria-label="Link URL" value={block.url} onChange={(event) => updateBlock(block.id, 'url', event.target.value)} placeholder="https://" />
                </div>
              ) : block.type === 'header' ? (
                <input value={block.text} onChange={(event) => updateBlock(block.id, 'text', event.target.value)} placeholder="Section heading" aria-label="Section heading" />
              ) : (
                <textarea value={block.text} onChange={(event) => updateBlock(block.id, 'text', event.target.value)} placeholder={block.type === 'quote' ? 'Add a quote' : 'Write your content'} aria-label={`${blockLabels[block.type]} text`} rows={block.type === 'description' ? 3 : 2} />
              )}
            </section>
          ))}
        </div>

        <div className="add-block-toolbar" aria-label="Add content block">
          <span>Add block</span>
          {Object.entries(blockLabels).map(([type, label]) => (
            <button type="button" key={type} onClick={() => addBlock(type)}>+ {label}</button>
          ))}
        </div>
      </div>

      <aside className="newsletter-preview-wrap" aria-label="Newsletter preview">
        <div className="preview-caption">
          <span>PREVIEW / 01 FIELD NOTES</span>
          <button type="button" className="preview-copy-button" onClick={copyNewsletterHtml}>
            {copyStatus || 'Copy HTML'}
          </button>
        </div>
        <article className="newsletter-preview">
          <header className="preview-masthead">
            <span><b>$$$</b> Offshore Newsletter</span>
            <time dateTime={new Date().toISOString().slice(0, 10)}>{new Date().toLocaleDateString('en-US')}</time>
          </header>
          <div className="preview-content">
            <h2>{title || 'Untitled newsletter'}</h2>
            {subtitle && <p className="preview-subtitle">{subtitle}</p>}
            {blocks.map((block) => {
              if (block.type === 'header') return <h3 key={block.id}>{block.text || 'Section heading'}</h3>;
              if (block.type === 'link') return <a className="preview-link" key={block.id} href={block.url.startsWith('https://') || block.url.startsWith('http://') ? block.url : undefined}>{block.label || 'Link text'}</a>;
              if (block.type === 'quote') return <blockquote key={block.id}>{block.text || 'Your quote'}</blockquote>;
              return <p className={block.type === 'description' ? 'preview-description' : ''} key={block.id}>{block.text || 'Your content will appear here.'}</p>;
            })}
          </div>
          <footer className="preview-footer">
            <a href="https://www.torn.com/forums.php#!p=forums&f=999&b=1&a=57866">Forum</a>
            <span aria-hidden="true">*</span>
            <a href="https://discord.gg/jEFjVqZxRG">Discord</a>
          </footer>
        </article>
      </aside>
    </div>
  );
}

export default NewsletterEditor;