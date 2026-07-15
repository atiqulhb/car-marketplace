'use client'

import { addCar } from "@/actions/addCar";
import { useActionState } from "react";
import styles from './styles.module.css'
import CustomSelect from '@/components/CustomSelect'
import MultipleImageUpload from "@/components/MultipleImageUpload"

export default function AddCar() {
  const [state, action, isPending] = useActionState(addCar, { success: null, error: null })
  return (
    <div className={styles.Wrapper}>
      <form action={action}>
        <CustomSelect/>
        <input type="text" name="brand"/>
        <input type="text" name="model"/>
        <input type="number" name="year"/>
        <input type="number" name="price"/>
        <MultipleImageUpload/>
        <button type="submit">Add Car</button>
      </form>
    </div>
  )
}
