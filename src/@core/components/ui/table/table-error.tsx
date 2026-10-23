import type { FC } from 'react'
import { useState } from 'react'
import { Card, CardBody } from 'reactstrap'
import { AlertTriangle, RefreshCw } from 'react-feather'
import Button from '@/@core/components/button'
import { m } from '@/paraglide/messages'

interface TableErrorProps {
  error?: Error
  /**
   * Refetches the data that failed to load.
   * The retry button is only rendered when this is provided, so the component
   * never falls back to a full page reload.
   */
  onRetry?: () => void | Promise<unknown>
}

const TableError: FC<TableErrorProps> = ({ error, onRetry }) => {
  const [retrying, setRetrying] = useState(false)

  const handleRetry = async () => {
    if (!onRetry || retrying) return

    setRetrying(true)

    try {
      await onRetry()
    } catch (retryError) {
      // The parent owns error reporting; keep the button usable on failure.
      console.error('Table retry failed', retryError)
    } finally {
      setRetrying(false)
    }
  }

  return (
    <Card role="alert" aria-busy={retrying}>
      <CardBody className="flex flex-col items-center justify-center text-center py-5 min-h-[320px]">
        <div className="avatar avatar-xl bg-light-danger mb-2">
          <span className="avatar-content">
            <AlertTriangle size={32} />
          </span>
        </div>
        <h3 className="mb-1 font-medium text-lg">{m.loading_error()}</h3>
        <p className="text-muted mb-2 max-w-sm">
          {error?.message ||
            "We couldn't load the data for this table. This might be due to a network issue or a server error."}
        </p>
        {onRetry && (
          <Button
            color="danger"
            outline
            onClick={handleRetry}
            loading={retrying}
            disabled={retrying}
            aria-label={m.try_again()}
            className="flex gap-[6px]"
          >
            <RefreshCw size={14} className="mr-50" />
            {m.try_again()}
          </Button>
        )}
      </CardBody>
    </Card>
  )
}

export default TableError
