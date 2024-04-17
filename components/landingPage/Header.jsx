// React komponenta pro hlavičku
const Header = ({ user, logout }) => {
  return (
    <header className="bg-secondary p-4 shadow-md">
      <div className="flex justify-between items-center container mx-auto">
        <div className="flex items-center space-x-4">
          <img src="/logo.svg" className="h-10" alt="SchnApp!" />
          <span className="text-2xl font-thin">SchnApp!</span>
        </div>
        <div
          className="flex items-center space-x-4 cursor-pointer"
          data-tooltip-id="tooltip"
          data-tooltip-place="left"
          data-tooltip-content="Odhlásit se"
          onClick={() => logout()}
        >
          <img src={user.user_metadata.avatar_url} alt="Avatar" className="h-10 w-10 rounded-full" />
          <span className="font-semibold">{user.user_metadata.nickname}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
