import React, { useState } from 'react';
import { X, Copy, Check, MessageSquare, ExternalLink, Send } from 'lucide-react';

export default function ShareModal({ post, isOpen, onClose }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedDiscord, setCopiedDiscord] = useState(false);

  if (!isOpen || !post) return null;

  const currentUrl = window.location.href;
  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(post.title);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyDiscord = () => {
    const discordText = `🎮 **${post.title}**\n${currentUrl}`;
    navigator.clipboard.writeText(discordText);
    setCopiedDiscord(true);
    setTimeout(() => setCopiedDiscord(false), 2000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          maxWidth: '480px',
          width: '100%',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-lg)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-white)' }}>
            Share Discussion
          </h3>
          <button onClick={onClose} className="btn-icon" style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Share this guide or tactic with teammates and the gaming community:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <a
            href={`https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm"
            style={{ justifyContent: 'flex-start', gap: '0.6rem' }}
          >
            <ExternalLink size={15} color="#ff4500" />
            <span>Reddit</span>
          </a>

          <a
            href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm"
            style={{ justifyContent: 'flex-start', gap: '0.6rem' }}
          >
            <ExternalLink size={15} color="#38bdf8" />
            <span>Twitter / X</span>
          </a>

          <a
            href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm"
            style={{ justifyContent: 'flex-start', gap: '0.6rem' }}
          >
            <Send size={15} color="#229ed9" />
            <span>Telegram</span>
          </a>

          <button
            onClick={handleCopyDiscord}
            className="btn btn-outline btn-sm"
            style={{ justifyContent: 'flex-start', gap: '0.6rem' }}
          >
            {copiedDiscord ? <Check size={15} color="var(--accent)" /> : <MessageSquare size={15} color="#5865f2" />}
            <span>{copiedDiscord ? 'Copied Discord' : 'Discord Snippet'}</span>
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            readOnly
            value={currentUrl}
            style={{ flex: 1, fontSize: '0.85rem' }}
          />
          <button onClick={handleCopyLink} className="btn btn-primary btn-sm">
            {copiedLink ? <Check size={16} /> : <Copy size={16} />}
            <span>{copiedLink ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
