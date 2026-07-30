'use client'

import { addCar } from "@/actions/addCar";
import { useActionState, useState } from "react";
import styles from './styles.module.css'
import CustomBrandSelect from '@/components/CustomBrandSelect'
import CustomModelSelect from '@/components/CustomModelSelect'
import MultipleImageUpload from "@/components/MultipleImageUpload"

export default function AddCar() {
  const [selectedBrandId, setSelectedBrandId] = useState('')
  console.log('selected brand id', selectedBrandId)
  const [state, action, isPending] = useActionState(addCar, { success: null, error: null })
  return (
    <div className={styles.Wrapper}>
      <form action={action}>
        <CustomBrandSelect onSelectingBrand={(id) => setSelectedBrandId(id)}/>
        <CustomModelSelect selectedBrandId={selectedBrandId}/>
        <input type="number" name="year"/>
        <input type="number" name="price"/>
        <MultipleImageUpload/>
        <button type="submit">Add Car</button>
      </form>
    </div>
  )
}
