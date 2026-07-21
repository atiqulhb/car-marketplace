'use client'

import { useQueryClient } from "@tanstack/react-query"
import { parseAsArrayOf, useQueryStates } from "nuqs"
import { parseAsInteger, parseAsString, parseAsStringLiteral } from "nuqs/server";
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect, useTransition } from 'react'
import styles from './styles.module.css'
import { ChevronDown, ChevronUp, Search, X } from "lucide-react";

const SORT_KEYS = ["newest", "oldest", "price_asc", "price_desc", "mileage_asc", "year_desc"] as const

export const carFilterParsers = {
  brand:       parseAsArrayOf(parseAsString).withDefault([]),
  model:       parseAsArrayOf(parseAsString).withDefault([]),
  yearMin:     parseAsInteger,
  yearMax:     parseAsInteger,
  priceMin:    parseAsInteger,
  priceMax:    parseAsInteger,
  search:      parseAsString.withDefault(""),
  sort:        parseAsStringLiteral(SORT_KEYS).withDefault("newest"),
};



export default function Filters() {
     const [brandDropDown, setBrandDropDown] = useState(false)
     const [isPending, startTransition] = useTransition()

     const [params, setParams] = useQueryStates(carFilterParsers, {
          history: "push",
          shallow: false,
          startTransition
     })

     function toggleBrand (slug: string) {
          console.log(slug)
          if (slug === "all") {
               console.log('it\'s all')
               setParams({ brand: [] })
          } else {
               setParams((prev) => {
                    const current = prev.brand ?? []
                    const next = current.includes(slug) ? current.filter((b) => b !== slug) : [...current, slug]
                    return { brand: next }
               })
          }
     }

     function toggleParam(field, param) {
          if (param === "all") {
               setParams({[field]: []})
          } else {
               setParams((prev) => {
                    const current = prev[field] ?? []
                    const next = current.includes(param) ? current.filter((b) => b !== param) : [...current, param]
                    return { [field]: next }
               })
          }
     }


     const brands = ["sfsf", "fwer", "etrt", "3453", "34534"]

     function handleSelectingBrand(e) {
          toggleParam("brand", e.target.textContent)
          setBrandDropDown(false)
     }
    return (
     //    <div className={styles.Filters}>
     //       {/* <select onChange={(e) => toggleParam("brand", e.target.value)}>
     //            <option value="all">All Brands</option>
     //            <option value="sfsf">sfsf</option>
     //            <option value="fwer">fwer</option>
     //            <option value="etrt">etrt</option>
     //            <option value="sfsf">3453</option>
     //            <option value="fwer">34534</option>
     //       </select> */}
     //       <div className={styles.Brand2}>
     //           {brandDropDown ? (
     //                <input type="text" name="brandSearch" id="" autoFocus/>
     //           ) : (
     //                <span>{params.brand.length > 0 ? "Add more Brand" : "Add Brand"}</span>
     //           )}
     //           <div className={styles.IconWrapper}>
     //                {brandDropDown ? (
     //                     <ChevronUp onClick={() => setBrandDropDown(false)}/>
     //                ) : (
     //                     <ChevronDown onClick={() => setBrandDropDown(true)}/>
     //                )}
     //           </div>
     //           {brandDropDown && (
     //        <div className={styles.DropDown}>
     //           <ul>
     //                {brands.map((b) => (
     //                     <li value={b} key={b} onClick={handleSelectingBrand}>{b}</li>
     //                ))}
     //           </ul>
               
     //        </div>
     //    )}
     //       </div>
     //       <select onChange={(e) => toggleParam("model", e.target.value)}>
     //            <option value="all">All Models</option>
     //            <option value="24234">24234</option>
     //            <option value="wrwer">wrwer</option>
     //            <option value="werwer">werwer</option>
     //            <option value="wrwer">wrwr</option>
     //            <option value="werwer">234234</option>
     //       </select>
     //       <select onChange={(e) => setParams({ sort: e.target.value })}>
     //           <option value="id_asc">Latest</option>
     //            <option value="id_desc">Oldest</option>
     //            <option value="price_asc">Price: Low to High</option>
     //            <option value="price_desc">Price: High to Low</option>
     //       </select>
     //    </div>
     <aside className={styles.Filters}>
         <div className={styles.Search}>
            <div className={styles.SearchBar}>
               <input type="text" name="" id="" />
               <Search size={15} strokeWidth={1} />
            </div>
         </div>
          <div className={styles.FilterSelection}>
               <div className={styles.SingleFilter}>
                    <div className={styles.Brand2}>
                         {brandDropDown ? (
                              <input type="text" name="brandSearch" id="" autoFocus/>
                         ) : (
                              <span>{params.brand.length > 0 ? "Add More Brand" : "Add Brand"}</span>
                         )}
                         <div className={styles.IconWrapper}>
                              {brandDropDown ? (
                                   <ChevronUp size={20} strokeWidth={1} onClick={() => setBrandDropDown(false)}/>
                              ) : (
                                   <ChevronDown size={13} strokeWidth={1} onClick={() => setBrandDropDown(true)}/>
                              )}
                         </div>
                         {brandDropDown && (
                              <div className={styles.DropDown}>
                                   <ul>
                                        {brands.map((b) => (
                                             <li value={b} key={b} onClick={handleSelectingBrand}>{b}</li>
                                        ))}
                                   </ul>
                                             
                              </div>
                         )}
                    </div>
               </div>
          </div>
          <div  className={styles.SelectedFilters}>
               {params.brand.map((b) => (
                    <div key={b} className={styles.SelectedFilter}>
                         <span>{b}</span>
                         <div className={styles.IconWrapper} onClick={() => toggleParam("brand", b)}>
                              <X size={20} strokeWidth={1}/>
                         </div>
                    </div>
               ))}
          </div>
     </aside>
    )
}