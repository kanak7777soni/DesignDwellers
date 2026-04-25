/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import type { ProjectMedia } from '@/lib/portfolio';

type MediaGroupName = 'heroMedia' | 'galleryMedia';

type MediaRow = {
  key: string;
  media?: ProjectMedia;
  isExisting: boolean;
};

type AdminMediaRowsProps = {
  name: MediaGroupName;
  label: string;
  media: ProjectMedia[];
  uploadName: string;
  blankRows: number;
};

const inputStyle = {
  height: '36px',
  borderRadius: '6px',
  border: '1px solid rgba(215,166,72,0.35)',
  background: '#141300',
  color: '#FFFFFF',
  padding: '0 10px',
  outline: 'none',
};

const fileInputStyle = {
  height: '46px',
  borderRadius: '6px',
  border: '1px solid rgba(215,166,72,0.35)',
  background: '#141300',
  color: '#FFFFFF',
  padding: '10px 12px 0',
  outline: 'none',
};

function createInitialRows(media: ProjectMedia[], blankRows: number): MediaRow[] {
  return [
    ...media.map((item, index) => ({
      key: `existing-${index}`,
      media: item,
      isExisting: true,
    })),
    ...Array.from({ length: blankRows }, (_, index) => ({
      key: `new-${index}`,
      isExisting: false,
    })),
  ];
}

function MediaPreview({ media }: { media?: ProjectMedia }) {
  if (!media?.src) {
    return (
      <div className="font-body flex items-center justify-center" style={{ width: '88px', height: '64px', borderRadius: '6px', background: '#141300', color: 'rgba(255,255,255,0.45)', fontSize: '12px' }}>
        Empty
      </div>
    );
  }

  if (media.type === 'video') {
    return (
      <video
        src={media.src}
        poster={media.poster}
        muted
        playsInline
        style={{ width: '88px', height: '64px', objectFit: 'cover', borderRadius: '6px', background: '#141300' }}
      />
    );
  }

  return (
    <img
      src={media.src}
      alt={media.alt}
      style={{ width: '88px', height: '64px', objectFit: 'cover', borderRadius: '6px', background: '#141300' }}
    />
  );
}

function move<T>(items: T[], fromIndex: number, toIndex: number) {
  const nextItems = [...items];
  const [item] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, item);
  return nextItems;
}

export default function AdminMediaRows({
  name,
  label,
  media,
  uploadName,
  blankRows,
}: AdminMediaRowsProps) {
  const [rows, setRows] = useState<MediaRow[]>(() => createInitialRows(media, blankRows));
  const [draggedKey, setDraggedKey] = useState<string | null>(null);

  function moveRow(fromIndex: number, toIndex: number) {
    if (toIndex < 0 || toIndex >= rows.length) {
      return;
    }

    setRows((currentRows) => move(currentRows, fromIndex, toIndex));
  }

  function addRow() {
    setRows((currentRows) => [
      ...currentRows,
      { key: `new-${Date.now()}-${currentRows.length}`, isExisting: false },
    ]);
  }

  return (
    <div className="flex flex-col" style={{ gap: '14px' }}>
      <div className="flex flex-col" style={{ gap: '10px' }}>
        {rows.map((row, index) => (
          <div
            key={row.key}
            draggable
            onDragStart={() => setDraggedKey(row.key)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => {
              const fromIndex = rows.findIndex((item) => item.key === draggedKey);
              if (fromIndex >= 0 && fromIndex !== index) {
                moveRow(fromIndex, index);
              }
              setDraggedKey(null);
            }}
            onDragEnd={() => setDraggedKey(null)}
            className="grid items-center"
            style={{
              gridTemplateColumns: '38px 88px 92px 1.4fr 1.2fr 1fr 88px',
              gap: '10px',
              borderTop: index === 0 ? 'none' : '1px solid rgba(255,255,255,0.08)',
              paddingTop: index === 0 ? 0 : '12px',
              opacity: draggedKey === row.key ? 0.55 : 1,
            }}
          >
            <input type="hidden" name={`${name}Indexes`} value={row.key} />
            <input type="hidden" name={`${name}Id-${row.key}`} value={row.media?.id || ''} />
            <input type="hidden" name={`${name}Order-${row.key}`} value={index + 1} />
            <div className="flex flex-col" style={{ gap: '4px' }}>
              <button
                type="button"
                className="font-body"
                style={{ height: '28px', borderRadius: '6px', border: '1px solid rgba(215,166,72,0.35)', background: '#141300', color: '#D7A648', cursor: 'pointer' }}
                onClick={() => moveRow(index, index - 1)}
                disabled={index === 0}
                aria-label={`Move ${label} row up`}
              >
                Up
              </button>
              <button
                type="button"
                className="font-body"
                style={{ height: '28px', borderRadius: '6px', border: '1px solid rgba(215,166,72,0.35)', background: '#141300', color: '#D7A648', cursor: 'pointer' }}
                onClick={() => moveRow(index, index + 1)}
                disabled={index === rows.length - 1}
                aria-label={`Move ${label} row down`}
              >
                Down
              </button>
            </div>
            <MediaPreview media={row.media} />
            <select name={`${name}Type-${row.key}`} defaultValue={row.media?.type || 'image'} className="font-body" style={inputStyle}>
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
            <input name={`${name}Src-${row.key}`} defaultValue={row.media?.src || ''} placeholder={`${label} URL`} className="font-body" style={inputStyle} />
            <input name={`${name}Alt-${row.key}`} defaultValue={row.media?.alt || ''} placeholder="Alt text" className="font-body" style={inputStyle} />
            <input name={`${name}Poster-${row.key}`} defaultValue={row.media?.poster || ''} placeholder="Video poster URL" className="font-body" style={inputStyle} />
            {row.isExisting ? (
              <label className="font-body flex items-center" style={{ gap: '7px', color: '#FFFFFF', fontSize: '13px' }}>
                <input type="checkbox" name={`${name}Keep-${row.key}`} defaultChecked />
                Keep
              </label>
            ) : (
              <span className="font-body" style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px' }}>New URL</span>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-end" style={{ gap: '12px' }}>
        <label className="font-body flex flex-col" style={{ gap: '8px', color: '#D7A648', fontSize: '13px', flex: 1 }}>
          Upload {label.toLowerCase()} files
          <input name={uploadName} type="file" accept="image/*,video/*" multiple className="font-body" style={fileInputStyle} />
        </label>
        <button
          type="button"
          className="font-body"
          style={{ height: '46px', borderRadius: '55px', border: '1px solid rgba(215,166,72,0.6)', background: 'transparent', color: '#D7A648', padding: '0 16px', cursor: 'pointer' }}
          onClick={addRow}
        >
          Add URL Row
        </button>
      </div>
    </div>
  );
}
