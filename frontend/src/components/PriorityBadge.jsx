import { PRIORITY } from "../constants";

const PriorityBadge = ({ priority }) => {
  if (priority === PRIORITY.HIGH) {
    return <span className="badge-high">🔴 High Priority</span>;
  }
  return <span className="badge-normal">🔵 Normal</span>;
};

export default PriorityBadge;
