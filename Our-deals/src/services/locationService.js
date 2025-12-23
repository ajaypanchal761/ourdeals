// Google Maps Location Service
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
const STORAGE_KEY = 'userLocation'

let googleMapsPromise = null

// Load Google Maps Script
const loadGoogleMaps = () => {
  if (googleMapsPromise) return googleMapsPromise

  googleMapsPromise = new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve(window.google.maps)
      return
    }

    if (document.getElementById('google-maps-script')) {
      // Script already added but likely not loaded, wait for it
      // This is a simple fallback, improved robust loading would require checking global callback
      const interval = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(interval)
          resolve(window.google.maps)
        }
      }, 100)
      return
    }

    const script = document.createElement('script')
    script.id = 'google-maps-script'
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = () => resolve(window.google.maps)
    script.onerror = (err) => reject(err)
    document.head.appendChild(script)
  })

  return googleMapsPromise
}

// Get browser coordinates
export const getBrowserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (error) => {
        reject(error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  })
}

// Reverse Geocoding: lat,lng -> Address
export const reverseGeocode = async (lat, lng, language = 'en') => {
  await loadGoogleMaps()
  const geocoder = new window.google.maps.Geocoder()

  return new Promise((resolve, reject) => {
    geocoder.geocode({ location: { lat, lng }, language }, (results, status) => {
      if (status === 'OK' && results[0]) {
        // Extract city (locality)
        let city = ''
        const addressComponents = results[0].address_components

        for (const component of addressComponents) {
          if (component.types.includes('locality')) {
            city = component.long_name
            break
          }
        }

        if (!city) {
          // Fallback to administrative_area_level_2 or sublocality
          for (const component of addressComponents) {
            if (component.types.includes('administrative_area_level_2')) {
              city = component.long_name
              break
            }
          }
        }

        // Fallback to formatted address part if still empty
        if (!city) {
          city = results[0].formatted_address.split(',')[0]
        }

        resolve({
          lat,
          lng,
          city: city || results[0].formatted_address,
          displayName: results[0].formatted_address,
        })
      } else {
        reject(new Error('Reverse geocode failed: ' + status))
      }
    })
  })
}

// Search Predictions: query -> [{ description, place_id }]
export const searchAddressSuggestions = async (query, language = 'en') => {
  await loadGoogleMaps()
  const service = new window.google.maps.places.AutocompleteService()

  return new Promise((resolve, reject) => {
    service.getPlacePredictions({ input: query, language }, (predictions, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
        const results = predictions.map(p => ({
          displayName: p.description,
          place_id: p.place_id,
          // lat/lng not available here, must be fetched via detail
          city: p.structured_formatting?.main_text || p.description
        }))
        resolve(results)
      } else {
        resolve([]) // Return empty on failure/no-results to avoid crashing UI
      }
    })
  })
}

// Get Place Details: place_id -> { lat, lng, city, displayName }
export const getPlaceDetails = async (placeId, language = 'en') => {
  await loadGoogleMaps()

  // We need a dummy element for PlacesService, or use Geocoder
  // Geocoder is often easier for simple lat/lng from place_id
  const geocoder = new window.google.maps.Geocoder()

  return new Promise((resolve, reject) => {
    geocoder.geocode({ placeId: placeId, language }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const lat = results[0].geometry.location.lat()
        const lng = results[0].geometry.location.lng()

        // Same city extraction logic
        let city = ''
        const addressComponents = results[0].address_components
        for (const component of addressComponents) {
          if (component.types.includes('locality')) {
            city = component.long_name
            break
          }
        }
        if (!city) {
          for (const component of addressComponents) {
            if (component.types.includes('administrative_area_level_2')) {
              city = component.long_name
              break
            }
          }
        }

        resolve({
          lat,
          lng,
          city: city || results[0].formatted_address,
          displayName: results[0].formatted_address
        })
      } else {
        reject(new Error('Place details failed'))
      }
    })
  })
}

// Save user location object to localStorage
export const saveUserLocation = (location) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(location))
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('userLocationChanged'))
    }
  } catch {
    // ignore
  }
}

// Load user location from localStorage
export const loadUserLocation = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}


