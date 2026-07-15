import { useRef, useState, useEffect } from 'react'
import { ImageUp, X } from 'lucide-react'
import styles from './styles.module.css'

const MAX_FILES = 5

export default function MultipleImageUpload() {
	const [files, setFiles] = useState([]);


	const inputRef = useRef(null)

	  useEffect(() => {
    return () => {
      files.forEach(({ preview }) => URL.revokeObjectURL(preview));
    };
  }, [files])

  function syncInputFiles(fileEntries) {
    const dt = new DataTransfer()
    fileEntries.forEach(({ file }) => dt.items.add(file))
    if (inputRef.current) inputRef.current.files = dt.files
  }

  function handleFileChange(event) {
    const selectedFiles = Array.from(event.target.files);
    
    if (files.length + selectedFiles.length > MAX_FILES) {
      alert(`You can only upload up to ${MAX_FILES} images. ${selectedFiles.length + files.length - MAX_FILES} files were ignored.`);
      const remainingSlots = MAX_FILES - files.length;
      if (remainingSlots <= 0) return
      addFiles(selectedFiles.slice(0, remainingSlots));
    } else {
      addFiles(selectedFiles);
    }
  };

  const addFiles = (newFiles) => {
    const processedFiles = newFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: `${file.name}-${Date.now()}-${Math.random()}`
    }));
    setFiles(prev => {
      const updated = [...prev, ...processedFiles]
      syncInputFiles(updated)
      return updated
    });
  };

  function removeFile(id) {
    setFiles((prev) => {
      const removed = prev.find((file) => file.id === id)
      if (removed) URL.revokeObjectURL(removed.preview)
      const updated = prev.filter((file) => file.id !== id)
      syncInputFiles(updated)
      return updated
    })
  }

	return (
		<div className={styles.Wrapper}>
			<input type="file" name="images" accept="image/*" multiple ref={inputRef} onChange={handleFileChange}/>
			<div className={styles.Display}>
				{files.map(({ id, preview }) => (
					<div key={id} className={styles.AddImages}>
						<img key={id} src={preview} alt="preview"/>
            <button type="button" onClick={() => removeFile(id)}>
              <X size={14} strokeWidth={1}/>
            </button>
					</div>
				))}
				{files.length <= 4 && (
					<div className={styles.AddImages} onClick={() => inputRef?.current.click()}>
						<ImageUp size={35} strokeWidth={1}/>
					</div>
				)}
			</div>
		</div>
	)
}