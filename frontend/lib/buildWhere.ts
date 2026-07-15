export function buildWhere(params) {
	const { search, brand, model, fuelType, min_mileage, max_mileage, min_price, max_price, year } = params

	return {
		"AND": [
	      search && {
	        "OR": [
	          {
	            "brand": {
	              "name": {
	                "contains": search,
	                "mode": "insensitive"
	              }
	            }
	         },
	         {
	            "model": {
	              "name": {
	                "contains": search,
	                "mode": "insensitive"
	              }
	            }
	         },
	         {
	            "fuelType": {
	              "name": {
	                "contains": search,
	                "mode": "insensitive"
	              }
	            }
	         }
	         
	        ]
	       },
	       brand && {
	        "brand": {
	          "id": {
	            "in": brand.split(',').map(s => s.trim())
	          }
	        }
	     	},
	     	model && {
	        "model": {
	          "id": {
	            "in": model.split(',').map(s => s.trim())
	          }
	        }
	     },
	     fuelType && {
	        "fuelType": {
	          "id": {
	            "in": fuelType.split(',').map(s => s.trim())
	          }
	        }
	     },
	     year && {
	        "year": {
	          "in": year.split(',').map(s => Number(s.trim()))
	        }
	     },
	     (min_mileage != null || max_mileage != null) && {
	        "mileage": {
	          ...( min_mileage != null && { "gte": min_mileage }),
	         ...( max_mileage != null && { "lte": max_mileage })
	        }
	     },
	     (min_price != null || max_price != null) && {
	        "price": {
	         ...( min_price != null && { "gte": String(min_price) }),
	          ...( max_price != null && { "lte": String(max_price) })
	        }
	      }
	    ].filter(Boolean)
	}
}