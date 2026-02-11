import { useState, useRef, useEffect } from 'react'

function ChevronDown() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function Select({ value, onValueChange, placeholder = 'Select...', label, id, children }) {
  const [open, setOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const ref = useRef(null)
  const listRef = useRef(null)
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`

  const childArray = Array.isArray(children) ? children : [children]

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (open && focusedIndex >= 0 && listRef.current) {
      const options = listRef.current.querySelectorAll('[role="option"]')
      options[focusedIndex]?.focus()
    }
  }, [focusedIndex, open])

  const selectedOption = childArray.find(child => child.props.value === value)
  const displayText = selectedOption ? selectedOption.props.children : placeholder

  function handleKeyDown(event) {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (!open) {
          setOpen(true)
          setFocusedIndex(0)
        }
        break
      case 'Escape':
        setOpen(false)
        ref.current?.querySelector('button')?.focus()
        break
      case 'ArrowDown':
        event.preventDefault()
        if (!open) {
          setOpen(true)
          setFocusedIndex(0)
        } else {
          setFocusedIndex(prev => Math.min(prev + 1, childArray.length - 1))
        }
        break
      case 'ArrowUp':
        event.preventDefault()
        if (open) {
          setFocusedIndex(prev => Math.max(prev - 1, 0))
        }
        break
    }
  }

  function handleOptionKeyDown(event, childValue) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onValueChange(childValue)
      setOpen(false)
      ref.current?.querySelector('button')?.focus()
    } else if (event.key === 'Escape') {
      setOpen(false)
      ref.current?.querySelector('button')?.focus()
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      setFocusedIndex(prev => Math.min(prev + 1, childArray.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setFocusedIndex(prev => Math.max(prev - 1, 0))
    }
  }

  return (
    <div className="relative" ref={ref}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-slate-300 mb-1"
        >
          {label}
        </label>
      )}
      <button
        type="button"
        id={selectId}
        onClick={() => {
          setOpen(!open)
          if (!open) setFocusedIndex(0)
        }}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={label ? undefined : selectId}
        className="flex items-center justify-between w-full h-11 px-4 py-2 text-sm bg-slate-800 border border-slate-700 rounded-lg hover:border-greyhound-green focus:outline-none focus:ring-2 focus:ring-greyhound-green focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
      >
        <span className={value ? 'text-white' : 'text-slate-300'}>{displayText}</span>
        <ChevronDown />
      </button>
      {open && (
        <ul
          ref={listRef}
          role="listbox"
          aria-label={label || placeholder}
          className="absolute z-50 w-full mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden"
        >
          {childArray.map((child, index) => (
            <li
              key={child.props.value}
              role="option"
              tabIndex={0}
              aria-selected={value === child.props.value}
              onClick={() => {
                onValueChange(child.props.value)
                setOpen(false)
                ref.current?.querySelector('button')?.focus()
              }}
              onKeyDown={(e) => handleOptionKeyDown(e, child.props.value)}
              className={`px-4 py-3 text-sm cursor-pointer transition-colors focus:outline-none focus:bg-greyhound-green focus:text-white ${
                value === child.props.value
                  ? 'bg-greyhound-green text-white font-medium'
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              {child.props.children}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function SelectItem({ value, children }) {
  return <div data-value={value}>{children}</div>
}

export { Select, SelectItem }
