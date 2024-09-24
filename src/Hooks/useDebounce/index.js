
import { useState, useEffect } from "react";

function useDebounce(value, delayTime) {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(()=>{
        const timerId = setTimeout(()=>{
            const valueTrim = value.trim()
            setDebouncedValue(valueTrim)
        },delayTime)

        return ()=>clearTimeout(timerId)
    },[value])
    return debouncedValue
}

export default useDebounce;