import { useRef, useState } from 'react'
import { ChevronDown, ChevronUp, X } from 'lucide-react'
import styles from './styles.module.css'
import { useModels } from '@/hooks/useModels'

export default function Index({ selectedBrandId }) {
    const [searchInput, setSearchInput] = useState('')
    const [selectedModel, setSelectedModel] = useState({ id: '', name: '' })
    const [newBrandName, setNewBrandName] = useState('')

    const [dropDown, setDropDown] = useState(false)
    const [selected, setSelected] = useState(false)
    const [addNew, setAddNew] = useState(false)
    
    const addNewInputRef = useRef()

    const { data } = useModels(selectedBrandId)

    function handleBrandSelection(selectedModel) {
        setSelectedModel(selectedModel)
        setSelected(true)
        setDropDown(false)
        setNewBrandName('')
        setSearchInput('')
    }

    console.log('models', data)

  return (
    <div className={styles.Wrapper}>
        <input type="text" name="modelId" value={selectedModel.id} style={{ display: 'none' }} readOnly/>
        <input type='text' name="modelName" style={{ display: 'none' }} autoFocus value={newBrandName.trim() || selectedModel.name} readOnly/>
        {dropDown ?
            <input type="text" key="search" autoFocus value={searchInput} onChange={e => setSearchInput(e.target.value)}/>
            :
         addNew ?
            <input type='text' key="new model" autoFocus value={newBrandName} onChange={e => setNewBrandName(e.target.value)}/>
            :
            <span>{selected ? selectedModel.name : 'Select Model'}</span>
        }
        
        <div className={styles.Icon}>
            {dropDown ?
                <ChevronUp  onClick={() => setDropDown(false)}/>
                :
            addNew || selected ? 
                <X onClick={() => {
                    setSelected(false)
                     setAddNew(false)
                    setSelectedModel({ id: '', name: '' })
                    setNewBrandName('')                   
                }}/>
                :
                <ChevronDown onClick={() => setDropDown(true)}/>
            }
            
        </div>
        {dropDown && (
            <div className={styles.DropDown}>
                {data?.length > 0 ? (
                    <ul>
                        {data.map(({ id, name }) => (
                            <li key={id} onClick={() => handleBrandSelection({ id, name })}>{name}</li>
                        ))}
                    </ul>
                ) : (
                    <span>No Brand has been selected</span>
                )}
                <button
                    onClick={() => {       
                        setAddNew(true)
                        setDropDown(false)
                        setSelected(false)
                        setSelectedModel({ id: '', name: '' })
                    }}
                >
                    Add New Model
                </button>
            </div>
        )}
    </div>
  )
}
