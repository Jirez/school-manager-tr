import { Card, CardBody } from 'reactstrap'
import { XOctagon } from 'react-feather'
import illustration from '@/assets/images/illustration/email.svg'

interface ErrorComponentProps {
  message: string
  title?: string
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({
  message,
  title = 'Error',
}) => {
  return (
    <div className="h-[85vh] flex flex-row items-center">
      <div className="flex items-center mx-auto">
        <Card className="card-developer-meetup">
          <div className="meetup-img-wrapper rounded-top flex justify-center">
            <img src={illustration} height="170" />
          </div>
          <CardBody>
            <div className="meetup-header flex flex-col items-center">
              <div className="mb-3">
                <XOctagon size={56} color="darkred" />
              </div>
              <div className="text-2xl font-semibold mb-1">{title}</div>
              <div className="text-sm font-medium w-[75%]">{message}</div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default ErrorComponent
