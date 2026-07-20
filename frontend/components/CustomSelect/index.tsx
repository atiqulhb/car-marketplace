import { useState } from 'react'
import { ChevronDown, ChevronUp, X } from 'lucide-react'
import styles from './styles.module.css'

export default function Index() {
    const [dropDown, setDropDown] = useState(false)
    const [searchInput, setSearchInput] = useState('')
    const [selectedBrandId, setSelectedBrandId] = useState(null)
    const [addNew, setAddNew] = useState(false)
    const [newBrandName, setNewBrandName] = useState(null)

    function handleBrandSelection(e) {
        setSelectedBrandId(e.target.innerText)
        setSearchInput('')
        setDropDown(false)
    }

  return (
    <div className={styles.Wrapper}>
        <input type="text" name="brandId" value={selectedBrandId ?? ''} style={{ display: 'none' }} readOnly/>
        {dropDown ?
            <input type="text" autoFocus value={searchInput} onChange={e => setSearchInput(e.target.value)}/>
            :
         addNew ?
            <input type='text' name="brandName" autoFocus value={newBrandName ?? ''} onChange={e => setNewBrandName(e.target.value)}/>
            :
            <span>{selectedBrandId ? selectedBrandId : 'Select Brand'}</span>
        }
        
        <div className={styles.Icon}>
            {dropDown ?
                <ChevronUp  onClick={() => setDropDown(false)}/>
                :
            addNew || selectedBrandId ? 
                <X onClick={() => {
                    setSelectedBrandId(null)
                    setNewBrandName(null)
                    setAddNew(false)
                }}/>
                :
                <ChevronDown onClick={() => setDropDown(true)}/>
            }
            
        </div>
        {dropDown && (
            <div className={styles.DropDown}>
                <ul>
                    <li onClick={handleBrandSelection}>Toyota</li>
                    <li onClick={handleBrandSelection}>BMW</li>
                    <li onClick={handleBrandSelection}>Marcedes</li>
                    <li>4</li>
                    <li>5</li>
                    <li>6</li>
                    <li>7</li>
                    <li>8</li>
                    <li>9</li>
                    <li>10</li>
                </ul>
                <button
                    onClick={() => {
                        setAddNew(true)
                        setDropDown(false)
                    }}
                >
                    Add New Brand
                </button>
            </div>
        )}
    </div>
  )
}
