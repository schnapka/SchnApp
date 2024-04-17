import CategoryBox from "./CategoryBox";

const CategoriesList = ({ categories }) => {
  return (
    <div className="w-full py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <div key={category.name} className="bg-background p-8 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-3">{category.name}</h2>
            <ul className="list-disc list-inside">
              {category.rooms.map((room) => (
                <CategoryBox key={room.id} category={category} room={room} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesList;
