import { useEffect, useState } from 'react';
import { supabase } from '../../supabase/client';
import { FaRegImages } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import userdefault from '../../assets/images/userdefault.png';

export default function Avatar({ url, size, onUpload }) {
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url])  


  async function downloadImage(path) {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data)

      setAvatarUrl(url)
    } catch (error) {
      console.error('Error al descargar la imagen:', error.message);
    } finally {
      setLoading(false);
    }
  }
  async function uploadAvatar(event) {
    try {
      setLoading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      onUpload(event, filePath)
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }
  const removeAvatar = () => {
    setAvatarUrl(null);
    
  };

  return (
    <div className='imgUploadBox d-flex align-items-center'>
        <div className='uploadBox'> 
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="uploadBox"
          style={{ height: size, width: size }}
        />
        
        
      ) : (
        <img
          src={userdefault}
          alt="Avatar"
          className="uploadBox"
          style={{ height: size, width: size }}
        />
        
      )}
      
      
      </div>
      <div style={{ width: size }}>
        <label className='uploadBox' htmlFor="single">
            <div className='info'>                      
                <FaRegImages />
                <h5>{loading ? 'Cargando ...' : 'Subir imagen'}</h5>
            </div>
        </label>
        <input
          style={{
            visibility: 'hidden',
            position: 'absolute',
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={loading}
        />
        
      </div>
    </div>
  )
}