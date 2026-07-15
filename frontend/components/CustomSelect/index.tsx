import { useState } from 'react'
import { ChevronDown, ChevronUp, X } from 'lucide-react'
import styles from './styles.module.css'

export default function Index() {
    const [dropDown, setDropDown] = useState(false)
    const [searchInput, setSearchInput] = useState('')
    const [selectedBrandId, setSelectedBrandId] = useState(null)
    const [addNew, setAddNew] = useState(false)
    const [newBrandName, setNewBrandName] = useState(null)

  return (
    <div className={styles.Wrapper}>
        {dropDown ?
            <input type="text" autoFocus value={searchInput} onChange={e => setSearchInput(e.target.value)}/>
            :
         addNew ?
            <input type='text' autoFocus/>
            :
            <span>Select Brand</span>
        }
        
        <div className={styles.Icon}>
            {dropDown ?
                <ChevronUp  onClick={() => setDropDown(false)}/>
                :
            addNew || selectedBrandId ? 
                <X onClick={() =>{}}/>
                :
                <ChevronDown onClick={() => setDropDown(true)}/>
            }
            
        </div>
        {dropDown && (
            <div className={styles.DropDown}>
                <ul>
                    <li>1</li>
                    <li>2</li>
                    <li>3</li>
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
