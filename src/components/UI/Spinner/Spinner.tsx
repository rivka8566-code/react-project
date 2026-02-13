import './Spinner.css'

interface SpinnerProps {
  inline?: boolean
}

const Spinner = ({ inline = false }: SpinnerProps) => {
  if (inline) {
    return <div className="spinner-inline"></div>
  }
  
  return (
    <div className="spinner-overlay">
      <div className="spinner"></div>
    </div>
  )
}

export default Spinner
