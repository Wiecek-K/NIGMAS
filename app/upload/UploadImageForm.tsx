'use client';
import React, { useState, FormEvent, ChangeEvent } from 'react';
import NextImage from 'next/image';

export function UploadImageForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [file, setFile] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get('file') as File | null;

    if (!file) {
      console.error('Nie wybrano pliku'); //TODO: by react-hot
      setIsLoading(false);
      return;
    }

    setIsLoading(true); //TODO:
    const dimensions = await getImageDimensions(file);

    formData.append('width', dimensions.width.toString());
    formData.append('height', dimensions.height.toString());

    try {
      const response = await fetch('/upload/api', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Przesyłanie nie powiodło się');

      const result = await response.json();
      console.log('Plik przesłany pomyślnie:', result.url);
    } catch (error) {
      console.error('Błąd podczas przesyłania:', error);
    }
    setIsLoading(false);
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  interface ImageDimensions {
    width: number;
    height: number;
  }

  const getImageDimensions = (file: File): Promise<ImageDimensions> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  return (
    <>
      <form onSubmit={onSubmit} className="bg-orange-400">
        <input type="file" name="file" accept="image/*" onChange={handleFileChange} />

        <div className="relative flex h-[400px] items-center justify-center overflow-hidden">
          <NextImage
            src={file || '/images/default.png'}
            alt="Podgląd zdjęcia"
            layout="fill"
            objectFit="contain"
          />
        </div>

        <input type="text" name="title" placeholder="Add your work title here" />
        <input type="text" name="prompt" placeholder="Add your work prompt here" />
        <input
          type="text"
          name="tags"
          placeholder={`Add your work tags separeted by commas "," `}
        />
        <input type="text" name="model" placeholder="Add your work model here" />
        <label htmlFor="isPublicCheckbox">Add your as public</label>
        <input type="checkbox" name="public" id="isPublicCheckbox" defaultChecked={true} />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Submit'}
        </button>
      </form>
      {isLoading && <h3>ŁADOWANIE</h3>}
    </>
  );
}
