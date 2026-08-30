import { Card, CardBody } from "reactstrap";
import cs from "classnames";

interface Props {
  className?: string;
  icon: React.ReactNode;
  color?: string;
  stats?: string;
  title: string;
}

const StatsVertical: React.FC<Props> = ({
  icon,
  color,
  stats,
  title,
  className,
}) => {
  return (
    <Card
      className={cs("text-center h-full rounded-sm", {
        [className!]: className !== undefined,
      })}
    >
      <CardBody className="flex flex-col items-center justify-center">
        <div
          className={`avatar p-50 m-0 mb-1 ${
            color ? `bg-light-${color}` : "bg-light-primary"
          }`}
        >
          <div className="avatar-content">{icon}</div>
        </div>
        <h2 className="fw-bolder">{stats}</h2>
        <p className="card-text line-ellipsis text-lg font-semibold mt-0.5">
          {title}
        </p>
      </CardBody>
    </Card>
  );
};

export default StatsVertical;
