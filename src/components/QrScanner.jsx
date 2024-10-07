import { Scanner } from '@yudiel/react-qr-scanner'
import { useEffect, useRef, useState } from 'react'
import './QrScanner.css'
import useScanner from '../store/scanner'

export function QrScanner() {
  const { lastRecord, setLastRecord } = useScanner()
  const [message, setMessage] = useState()
  const { action, setAction } = useScanner()
  const actionRef = useRef(action)

  useEffect(() => {
    actionRef.current = action
  }, [action])

  const handleScan = async (result) => {
    if (actionRef.current === '') {
      setMessage('Selecciona una acción primero')
      setTimeout(() => {
        setMessage('')
      }, 3000)
      return
    }

    try {
      const response = await fetch(
        'https://futuristic-minds-scanner.igeco.mx/server/user-check',
        // 'http://localhost:3011/user-check',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uuid: result[0].rawValue,
            action: actionRef.current,
          }),
        }
      )
      const data = await response.json()
      if (data.status) {
        console.log(data)
        setMessage(data)
        setLastRecord(data)
        setTimeout(() => {
          setMessage('')
        }, 3000)
      } else {
        setMessage(data.message)
        setTimeout(() => {
          setMessage('')
        }, 3000)
      }
    } catch (error) {
      console.error(error)
      setMessage('No se pudo conectar al servidor')
    }
  }

  return (
    <>
      <div className='actions'>
        <select onChange={(e) => setAction(e.target.value)} value={action}>
          <option value=''>Selecciona una acción</option>
          <option value='check-in'>Checar entradas</option>
          <option value='check-out'>Checar salidas</option>
        </select>
      </div>
      <Scanner
        onScan={(result) => handleScan(result)}
        allowMultiple
        paused={false}
        scanDelay={2000}
      />

      {message && (
        <div className='text-scanner'>
          {message?.status ? (
            <div className='text-success'>
              {message?.user?.nombre}
            </div>
          ) : (
            <div className='text-failure'>{message}</div>
          )}
        </div>
      )}

      <div className='last-record'>
        <p className='text-status'>ULTIMA LECTURA: {lastRecord?.message}</p>
        <div className='text-success'>
          <p  className='container-user'>
            {lastRecord?.user?.name} 
            <br />
            {lastRecord?.user?.paternSurname}{' '}
            <br />
            {lastRecord?.user?.maternSurname}
            <br />
             <spam className='text-institution' >{lastRecord?.user?.institution}</spam>
             </p>
          <br />
          <br />
        </div>
      </div>
    </>
  )
}
