'use client'

import { useQueryClient } from "@tanstack/react-query"
import { useQueryStates } from "nuqs"
import { parseAsInteger, parseAsString, parseAsStringLiteral } from "nuqs/server";
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect, useTransition } from 'react'
import styles from './styles.module.css'

const SORT_KEYS = ["newest", "oldest", "price_asc", "price_desc", "mileage_asc", "year_desc"] as const

export const carFilterParsers = {
  brand:       parseAsString.withDefault(""),
  model:       parseAsString.withDefault(""),
  yearMin:     parseAsInteger,
  yearMax:     parseAsInteger,
  priceMin:    parseAsInteger,
  priceMax:    parseAsInteger,
  search:      parseAsString.withDefault(""),
  sort:        parseAsStringLiteral(SORT_KEYS).withDefault("newest"),
};



export default function Filters() {
     const [params, setParams] = useQueryStates(carFilterParsers, {
          history: "push",
          shallow: false,
     })


    return (
        <div className={styles.Filters}>
           <select value={params.brand} onChange={(e) => setParams({ brand: e.target.value })}>
                <option value="">All Brands</option>
                <option value="sfsf">sfsf</option>
                <option value="fwer">fwer</option>
                <option value="etrt">etrt</option>
                <option value="sfsf">3453</option>
                <option value="fwer">34534</option>
           </select>
           <select>
                <option value="">All Models</option>
                <option value="24234">24234</option>
                <option value="wrwer">wrwer</option>
                <option value="werwer">werwer</option>
                <option value="wrwer">wrwr</option>
                <option value="werwer">234234</option>
           </select>
           <select value={params.sort} onChange={(e) => setParams({ sort: e.target.value })}>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
           </select>
        </div>
    )
}