// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function useLocalStorageState(
  key,
  initialValue = '',
  {serializer = JSON.stringify, deserializer = JSON.parse} = {},
) {
  const [value, setValue] = React.useState(() => {
    return (
      deserializer(window.localStorage.getItem(key)) ||
      (typeof initialValue === 'function' ? initialValue() : initialValue)
    )
  })

  const keyRef = React.useRef(key)

  React.useEffect(() => {
    if (keyRef.current !== key) {
      window.localStorage.removeItem(keyRef.current)
      keyRef.current = key
    }
    window.localStorage.setItem(key, serializer(value))
  }, [key, serializer, value])

  return [value, setValue]
}

function Greeting({initialName = ''}) {
  const [state, setState] = useLocalStorageState('name', initialName)

  function handleChange(event) {
    setState({name: event.target.value})
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={state.name} onChange={handleChange} id="name" />
      </form>
      {state.name ? (
        <strong>Hello {state.name}</strong>
      ) : (
        'Please type your name'
      )}
    </div>
  )
}

function App() {
  return <Greeting initialName="Bob" />
}

export default App
