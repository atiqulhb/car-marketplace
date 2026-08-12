import { useState, useTransition } from 'react'
import { useQueryStates } from 'nuqs'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { carFilterParsers } from '@/components/Filters'
import styles from './Sort.module.css'

const sorts = [
    {
        title: "Old Cars",
        value: "year_desc"
    },
    {
        title: "New Cars",
        value: "year_asc"
    }
]

export default function Sort() {
    const [dropDown, setDropDown] = useState(false)
    const [isPending, startTransition] = useTransition()

     const [params, setParams] = useQueryStates(carFilterParsers, {
          history: "push",
          shallow: false,
          startTransition
     })

     const handleSort = (selectedValue) => {
        setParams({ sort: selectedValue })
        setDropDown(false)
     }

  return (
    <div className={styles.Brand2}>
        <span>Sort</span>
        <div className={styles.IconWrapper}>
            {dropDown ? (
                <ChevronUp size={20} strokeWidth={1} onClick={() => setDropDown(false)}/>
            ) : (
                <ChevronDown size={13} strokeWidth={1} onClick={() => setDropDown(true)}/>
            )}
        </div>
        {dropDown && (
            <div className={styles.DropDown}>
                <ul>
                    {sorts.map(({ value, title }) => (
                            <li key={value} onClick={() => handleSort(value)}>{title}</li>
                    ))}
                </ul>
                            
            </div>
        )}
</div>
  )
}
