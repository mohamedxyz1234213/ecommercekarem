import { useState, useRef } from 'react';
import { MdCloudUpload, MdClose } from 'react-icons/md';

const ImageUpload = ({ images = [], onChange, maxImages = 5 }) => {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleFiles = (files) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'));
    const newImages = [...images];
    fileArray.forEach((file) => {
      if (newImages.length < maxImages) {
        newImages.push(file);
      }
    });
    onChange(newImages);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const getPreview = (img) => {
    if (typeof img === 'string') return img;
    if (img instanceof File) return URL.createObjectURL(img);
    return '';
  };

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? '#2D5016' : '#e0d8cc'}`,
          borderRadius: 12,
          padding: 32,
          textAlign: 'center',
          cursor: 'pointer',
          background: dragOver ? 'rgba(45,80,22,0.05)' : '#FAF8F5',
          transition: 'all 0.2s',
        }}
      >
        <MdCloudUpload size={36} style={{ color: '#8B7355', marginBottom: 8 }} />
        <p style={{ color: '#888', fontSize: '0.9rem' }}>
          Drag & drop images or click to browse
        </p>
        <p style={{ color: '#aaa', fontSize: '0.8rem', marginTop: 4 }}>
          Max {maxImages} images. JPG, PNG, WebP
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFiles(e.target.files)}
          style={{ display: 'none' }}
        />
      </div>

      {images.length > 0 && (
        <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
          {images.map((img, idx) => (
            <div
              key={idx}
              style={{
                position: 'relative',
                width: 80,
                height: 80,
                borderRadius: 8,
                overflow: 'hidden',
                border: '1px solid #e0d8cc',
              }}
            >
              <img
                src={getPreview(img)}
                alt={`Upload ${idx + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(idx);
                }}
                style={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  background: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: 20,
                  height: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                }}
              >
                <MdClose size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
