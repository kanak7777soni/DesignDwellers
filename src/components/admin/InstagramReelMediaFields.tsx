/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';

type InstagramReelMediaFieldsProps = {
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
};

const inputStyle = {
  height: '38px',
  borderRadius: '6px',
  border: '1px solid rgba(215,166,72,0.35)',
  background: '#141300',
  color: '#FFFFFF',
  padding: '0 10px',
  outline: 'none',
};

function labelStyle() {
  return {
    gap: '8px',
    color: '#D7A648',
    fontSize: '13px',
  };
}

export default function InstagramReelMediaFields({
  videoUrl,
  thumbnailUrl,
  caption,
}: InstagramReelMediaFieldsProps) {
  const [videoValue, setVideoValue] = useState(videoUrl);
  const [thumbnailValue, setThumbnailValue] = useState(thumbnailUrl);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [selectedThumbnailUrl, setSelectedThumbnailUrl] = useState<string | null>(null);
  const previewVideoUrl = selectedVideoUrl || videoValue.trim();
  const previewThumbnailUrl = selectedThumbnailUrl || thumbnailValue.trim();

  useEffect(() => () => {
    if (selectedVideoUrl) {
      URL.revokeObjectURL(selectedVideoUrl);
    }
  }, [selectedVideoUrl]);

  useEffect(() => () => {
    if (selectedThumbnailUrl) {
      URL.revokeObjectURL(selectedThumbnailUrl);
    }
  }, [selectedThumbnailUrl]);

  return (
    <div className="grid" style={{ gridTemplateColumns: '132px 1fr', gap: '14px', alignItems: 'start' }}>
      <div>
        <p className="font-body" style={{ color: '#D7A648', fontSize: '13px', marginBottom: '8px' }}>
          Reel preview
        </p>
        <div className="overflow-hidden flex items-center justify-center" style={{ width: '132px', height: '235px', borderRadius: '8px', background: '#141300', border: '1px solid rgba(215,166,72,0.25)' }}>
          {previewVideoUrl ? (
            <video
              key={previewVideoUrl}
              src={previewVideoUrl}
              poster={previewThumbnailUrl || undefined}
              muted
              playsInline
              controls
              preload="metadata"
              style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#141300' }}
            />
          ) : previewThumbnailUrl ? (
            <img
              src={previewThumbnailUrl}
              alt={caption || 'Instagram reel preview'}
              style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#141300' }}
            />
          ) : (
            <span className="font-body" style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px', textAlign: 'center', padding: '0 12px' }}>
              Select a reel video or thumbnail
            </span>
          )}
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <label className="font-body flex flex-col" style={labelStyle()}>
          Saved/direct video URL
          <input
            name="videoUrl"
            defaultValue={videoUrl}
            placeholder="Auto-filled after upload, or paste MP4/WebM URL"
            className="font-body"
            style={inputStyle}
            onChange={(event) => setVideoValue(event.currentTarget.value)}
          />
        </label>
        <label className="font-body flex flex-col" style={labelStyle()}>
          Saved thumbnail URL
          <input
            name="thumbnailUrl"
            defaultValue={thumbnailUrl}
            placeholder="Auto-filled after upload, or paste image URL"
            className="font-body"
            style={inputStyle}
            onChange={(event) => setThumbnailValue(event.currentTarget.value)}
          />
        </label>
        <label className="font-body flex flex-col" style={labelStyle()}>
          Upload reel video
          <input
            name="videoFile"
            type="file"
            accept="video/*"
            className="font-body"
            style={{ ...inputStyle, paddingTop: '9px' }}
            onChange={(event) => {
              const file = event.currentTarget.files?.[0];
              setSelectedVideoUrl(file ? URL.createObjectURL(file) : null);
            }}
          />
        </label>
        <label className="font-body flex flex-col" style={labelStyle()}>
          Upload thumbnail
          <input
            name="thumbnailFile"
            type="file"
            accept="image/*"
            className="font-body"
            style={{ ...inputStyle, paddingTop: '9px' }}
            onChange={(event) => {
              const file = event.currentTarget.files?.[0];
              setSelectedThumbnailUrl(file ? URL.createObjectURL(file) : null);
            }}
          />
        </label>
      </div>
    </div>
  );
}
