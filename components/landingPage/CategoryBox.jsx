import { Link } from "react-router-dom";

const CategoryBox = ({ category, room }) => {
  return (
    <li key={room.id} className="mb-1">
      <Link to={`/chat/${category.hash}/${room.hash}`} className="hover:text-accent hover:underline cursor-pointer">
        {room.name}
      </Link>
    </li>
  );
};

export default CategoryBox;
