import { useState, useRef, useEffect } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { ChevronDown, ChevronUp, X } from 'lucide-react'
import { queryKeys } from '@/lib/react-query/query-keys'
import styles from './styles.module.css'

export default function CustomBrandSelect({ onSelectingBrand }) {
    const [searchInput, setSearchInput] = useState('')
    const [selectedBrand, setSelectedBrand] = useState({ id: '', name: '' })
    const [newBrandName, setNewBrandName] = useState('')
    const [dropDown, setDropDown] = useState(false)
    const [selected, setSelected] = useState(false)
    const [addNew, setAddNew] = useState(false)

    console.log(selectedBrand)
    

    function handleBrandSelection(selected) {
        setSelectedBrand(selected)
        setSelected(true)
        setDropDown(false)
        setNewBrandName('')
        setSearchInput('')
    }

    useEffect(() => {
        selectedBrand.id.trim() && onSelectingBrand && onSelectingBrand(selectedBrand.id)
    }, [selectedBrand])

    
    const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery({
        queryKey: queryKeys.brands,
        initialPageParam: null,
        queryFn: async ({ pageParam }) =>  {
            console.log('page param', pageParam)
            // if (cursor) {
            //     searchParams.set('cursor', cursor)
            // }
            
           const res = await fetch('/api/filters/brands?cursor=' + pageParam)
            if (!res.ok) {
                throw new Error(`Failed to fetch cars: ${res.statusText}`)
            }
            
            return await res.json()
        },
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    })

    

    const brands = data?.pages.flatMap(page => page.items) ?? []

    const sentinelRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!hasNextPage) return

        const el = sentinelRef.current
        if (!el) return

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !isFetchingNextPage) {
                fetchNextPage()
            }
        })

        observer.observe(el)
        return () => observer.disconnect()
    }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  return (
    <div className={styles.Wrapper}>
        <input type="text" name="brandId" value={selectedBrand.id} style={{ display: 'none' }} readOnly/>
        <input type="text" name="brandName" value={newBrandName.trim() || selectedBrand.name} style={{ display: 'none' }} readOnly/>

        {dropDown ?
            <input type="text" key="search" autoFocus value={searchInput} onChange={e => setSearchInput(e.target.value)}/>
            :
         addNew ?
            <input type="text" key="new model" autoFocus value={newBrandName} onChange={e => setNewBrandName(e.target.value)}/>
            :
            <span>{selected ? selectedBrand.name : 'Select Brand'}</span>
        }
        
        <div className={styles.Icon}>
            {dropDown ?
                <ChevronUp  onClick={() => setDropDown(false)}/>
                :
            addNew || selected ? 
                <X onClick={() => {
                    setSelectedBrand({ id: '', name: ''})
                    setNewBrandName('')
                    setSelected(false)
                    setAddNew(false)
                }}/>
                :
                <ChevronDown onClick={() => setDropDown(true)}/>
            }
            
        </div>
        {dropDown && (
            <div className={styles.DropDown}>
                {brands.length > 0 ? (
                    <ul>
                        {brands.map(({ id, name }) => (
                            <li key={id} value={id} onClick={() => handleBrandSelection({ id, name })}>{name}</li>
                        ))}
                        <li ref={sentinelRef}/>
                    </ul>
                ) : (
                    <span>No Brands</span>
                )}
                
                <button
                    onClick={() => {
                        setAddNew(true)
                        setDropDown(false)
                        setSelectedBrand({ id: '', name: ''})
                    }}
                >
                    Add New Brand
                </button>
            </div>
        )}
    </div>
  )
}
